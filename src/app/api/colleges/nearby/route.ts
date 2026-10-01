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

const OVERPASS_TIMEOUT_MS = 30_000;
const ROUTING_TIMEOUT_MS = 15_000;

//Getting coordinates from OverpassElement based on its type
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));
    const requestedRadius = Number(searchParams.get("radius"));
    const radius = Number.isFinite(requestedRadius)
      ? Math.min(Math.max(requestedRadius, 1_000), 50_000)
      : 50_000;

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

    // Searching for colleges and universities from giver lat, lon and radius using Overpass API 
    // and giving the response in JSON format
    const overpassQuery = `
      [out:json][timeout:25];

      (
        nwr["amenity"="college"](around:${radius},${lat},${lon});
        nwr["amenity"="university"](around:${radius},${lat},${lon});
      );

      out center tags;
    `;


    const overpassAbortController = new AbortController();
    const overpassTimeout = setTimeout(
      () => overpassAbortController.abort(),
      OVERPASS_TIMEOUT_MS,
    );

    let response: Response;

    try {
      response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Eduvora/1.0 (career-guidance-platform)",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          data: overpassQuery,
        }).toString(),
        cache: "no-store",
        signal: overpassAbortController.signal,
      });
    } finally {
      clearTimeout(overpassTimeout);
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Overpass API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new Error(
        `Overpass API failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: unknown = await response.json();

    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as { elements?: unknown }).elements)
    ) {
      throw new Error("Overpass API returned an invalid response.");
    }

    const colleges: (CollegeBase | null)[] = (
      data as { elements: OverpassElement[] }
    ).elements
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

    //Getting distance and time from user location to each college
    const validColleges = colleges.filter(
      (college): college is NonNullable<typeof college> => college !== null,
    );

    const collegesWithRoutes = await getMatrixDetails(lat, lon, validColleges);

    const sortedColleges = collegesWithRoutes.sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    );

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

// Helper function for distance and time.

async function getMatrixDetails(
  userLat: number,
  userLon: number,
  colleges: CollegeBase[],
) {
  if (colleges.length === 0) {
    return [];
  }

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
      Math.sin(dLon / 2) ** 2 *
        Math.cos(latitude1) *
        Math.cos(latitude2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

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

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    console.warn(
      "OPENROUTESERVICE_API_KEY is not configured; using straight-line distances.",
    );
    return fallbackResults;
  }

  const locations = [
    [userLon, userLat],
    ...selectedColleges.map((college) => [college.longitude, college.latitude]),
  ];

  const routingAbortController = new AbortController();
  const routingTimeout = setTimeout(
    () => routingAbortController.abort(),
    ROUTING_TIMEOUT_MS,
  );

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

  if (!response.ok) {
    const errorText = await response.text();

    console.error("OpenRouteService Matrix error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    return fallbackResults;
  }

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

  if (
    !Array.isArray(distances) ||
    !Array.isArray(distances[0]) ||
    !Array.isArray(durations) ||
    !Array.isArray(durations[0])
  ) {
    return fallbackResults;
  }

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

  return collegesWithRoutes.sort(
    (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
  );
}