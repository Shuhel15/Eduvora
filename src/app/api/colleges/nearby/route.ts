import { NextRequest, NextResponse } from "next/server";

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

type CollegeResult = {
  id: string;
  name: string;
  type: "College" | "University";
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  distanceKm: number | null;
  durationMinutes: number | null;
};

type CollegeBase = Omit<CollegeResult, "distanceKm" | "durationMinutes">;

const OVERPASS_TIMEOUT_MS = 15_000;
const ROUTING_TIMEOUT_MS = 15_000;

const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// Getting coordinates from OverpassElement based on its type
function getCoordinates(element: OverpassElement) {
  if (element.type === "node") {
    return {
      lat: element.lat,
      lon: element.lon,
    };
  }

  return {
    lat: element.center?.lat,
    lon: element.center?.lon,
  };
}

// Sleep helper for retry
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch Overpass with retry + alternate server
async function fetchOverpass(query: string) {
  let lastError: unknown = null;

  for (
    let serverIndex = 0;
    serverIndex < OVERPASS_SERVERS.length;
    serverIndex++
  ) {
    const server = OVERPASS_SERVERS[serverIndex];

    // Retry each server up to 2 times
    for (let attempt = 1; attempt <= 2; attempt++) {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, OVERPASS_TIMEOUT_MS);

      try {
        console.log(
          `Overpass request: server=${serverIndex + 1}/${OVERPASS_SERVERS.length}, attempt=${attempt}/2`,
        );

        const response = await fetch(server, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Eduvora/1.0 (career-guidance-platform)",
            Accept: "application/json",
          },
          body: new URLSearchParams({
            data: query,
          }).toString(),
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();

          console.error("Overpass API error:", {
            server,
            attempt,
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });

          throw new Error(
            `Overpass failed: ${response.status} ${response.statusText}`,
          );
        }

        const data: unknown = await response.json();

        if (
          !data ||
          typeof data !== "object" ||
          !Array.isArray((data as { elements?: unknown }).elements)
        ) {
          throw new Error("Invalid Overpass response.");
        }

        console.log("Overpass request successful.");

        return data as {
          elements: OverpassElement[];
        };
      } catch (error) {
        lastError = error;

        console.error("Overpass request failed:", {
          server,
          attempt,
          error,
        });

        // Small delay before retry
        if (attempt < 2) {
          await sleep(700);
        }
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All Overpass servers failed.");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

    const requestedRadius = Number(searchParams.get("radius"));

    const radius = Number.isFinite(requestedRadius)
      ? Math.min(Math.max(requestedRadius, 1_000), 50_000)
      : 50_000;

    // Validate coordinates
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid latitude and longitude are required.",
        },
        { status: 400 },
      );
    }

    // 1. Search colleges using Overpass

    const overpassQuery = `
      [out:json][timeout:25];

      (
        nwr["amenity"="college"](around:${radius},${lat},${lon});
        nwr["amenity"="university"](around:${radius},${lat},${lon});
      );

      out center tags;
    `;

    let data: {
      elements: OverpassElement[];
    };

    try {
      data = await fetchOverpass(overpassQuery);
    } catch (error) {
      console.error("All Overpass attempts failed:", error);

      return NextResponse.json(
        {
          success: false,
          error:
            "College search service is temporarily unavailable. Please try again in a few seconds.",
        },
        { status: 503 },
      );
    }

    //2. Convert Overpass data into college objects

    const colleges: (CollegeBase | null)[] = data.elements
      .map<CollegeBase | null>((element) => {
        const coordinates = getCoordinates(element);

        if (coordinates.lat === undefined || coordinates.lon === undefined) {
          return null;
        }

        const tags = element.tags ?? {};

        return {
          id: `${element.type}-${element.id}`,

          name: tags.name ?? "Unnamed College",

          type: tags.amenity === "university" ? "University" : "College",

          latitude: coordinates.lat,
          longitude: coordinates.lon,

          address:
            tags["addr:full"] ||
            [
              tags["addr:housenumber"],
              tags["addr:street"],
              tags["addr:city"],
              tags["addr:state"],
            ]
              .filter(Boolean)
              .join(", ") ||
            null,

          phone: tags.phone || tags["contact:phone"] || null,

          email: tags.email || tags["contact:email"] || null,

          website: tags.website || tags["contact:website"] || null,
        };
      })
      .filter(Boolean);

    const validColleges = colleges.filter(
      (college): college is CollegeBase => college !== null,
    );

    //3. No colleges found

    if (validColleges.length === 0) {
      return NextResponse.json({
        success: true,
        colleges: [],
      });
    }

    // 4. Get distance + travel time

    const collegesWithRoutes = await getMatrixDetails(lat, lon, validColleges);

    const sortedColleges = collegesWithRoutes.sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    );

    //  5. Final response

    return NextResponse.json({
      success: true,
      colleges: sortedColleges,
    });
  } catch (error) {
    console.error("Nearby colleges API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch nearby colleges.",
      },
      { status: 500 },
    );
  }
}

// Routing and distance calculation using OpenRouteService
async function getMatrixDetails(
  userLat: number,
  userLon: number,
  colleges: CollegeBase[],
): Promise<CollegeResult[]> {
  if (colleges.length === 0) {
    return [];
  }

//  Straight-line distance
  function getStraightLineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const earthRadiusKm = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;

    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const latitude1 = (lat1 * Math.PI) / 180;

    const latitude2 = (lat2 * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(latitude1) * Math.cos(latitude2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

//  Select only 10 closest colleges before ORS
  const collegesWithStraightLineDistance = colleges.map((college) => ({
    college,

    straightLineDistanceKm: getStraightLineDistanceKm(
      userLat,
      userLon,
      college.latitude,
      college.longitude,
    ),
  }));

  collegesWithStraightLineDistance.sort(
    (a, b) => a.straightLineDistanceKm - b.straightLineDistanceKm,
  );

  const selectedColleges = collegesWithStraightLineDistance
    .slice(0, 10)
    .map((item) => item.college);


  //  If OpenRouteService fails, we still return colleges.
  // Distance will be straight-line distance.
  const fallbackResults: CollegeResult[] = selectedColleges.map((college) => ({
    ...college,

    distanceKm: Number(
      getStraightLineDistanceKm(
        userLat,
        userLon,
        college.latitude,
        college.longitude,
      ).toFixed(1),
    ),

    durationMinutes: null,
  }));

//  OpenRouteService API key
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    console.warn(
      "OPENROUTESERVICE_API_KEY is missing. Using straight-line distances.",
    );

    return fallbackResults;
  }

//  ORS Matrix request
  const locations = [
    [userLon, userLat],

    ...selectedColleges.map((college) => [college.longitude, college.latitude]),
  ];

  const routingAbortController = new AbortController();

  const routingTimeout = setTimeout(() => {
    routingAbortController.abort();
  }, ROUTING_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        method: "POST",

        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          locations,

          sources: [0],

          destinations: selectedColleges.map((_, index) => index + 1),

          metrics: ["distance", "duration"],

          units: "km",
        }),

        cache: "no-store",

        signal: routingAbortController.signal,
      },
    );
  } catch (error) {
    console.error("OpenRouteService request failed:", error);

    return fallbackResults;
  } finally {
    clearTimeout(routingTimeout);
  }

//  ORS failed
  if (!response.ok) {
    const errorText = await response.text();

    console.error("OpenRouteService Matrix error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    return fallbackResults;
  }

// Parse ORS response
  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    console.error("OpenRouteService returned invalid JSON:", error);

    return fallbackResults;
  }

  if (!data || typeof data !== "object") {
    return fallbackResults;
  }

  const distances = (data as { distances?: unknown }).distances;

  const durations = (data as { durations?: unknown }).durations;

//  Invalid ORS response
  if (
    !Array.isArray(distances) ||
    !Array.isArray(distances[0]) ||
    !Array.isArray(durations) ||
    !Array.isArray(durations[0])
  ) {
    console.warn("Invalid ORS matrix response. Using fallback distances.");

    return fallbackResults;
  }

//  Merge ORS data with colleges
  const collegesWithRoutes: CollegeResult[] = selectedColleges.map(
    (college, index) => ({
      ...college,

      distanceKm:
        typeof distances[0][index] === "number" &&
        Number.isFinite(distances[0][index])
          ? Number(distances[0][index].toFixed(1))
          : fallbackResults[index].distanceKm,

      durationMinutes:
        typeof durations[0][index] === "number" &&
        Number.isFinite(durations[0][index])
          ? Math.round(durations[0][index] / 60)
          : null,
    }),
  );

//  Final sorting
  return collegesWithRoutes.sort(
    (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
  );
}
