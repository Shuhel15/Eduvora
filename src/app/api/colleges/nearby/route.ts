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
    const radius = Number(searchParams.get("radius")) || 50000;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
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

    
    const response = await fetch("https://overpass-api.de/api/interpreter", {
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
    });

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

    const data = await response.json();

    const colleges = (data.elements as OverpassElement[])
      .map((element) => {
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
  colleges: {
    latitude: number;
    longitude: number;
  }[],
) {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouteService API key is missing.");
  }

  if (colleges.length === 0) {
    return [];
  }

  // User + maximum 10 nearest colleges
  const selectedColleges = colleges.slice(0, 10);

  const locations = [
    [userLon, userLat],
    ...selectedColleges.map((college) => [college.longitude, college.latitude]),
  ];

  const response = await fetch(
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
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("OpenRouteService Matrix error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error("Failed to calculate college distances.");
  }

  const data = await response.json();

  const distances = data.distances?.[0] ?? [];
  const durations = data.durations?.[0] ?? [];

  return selectedColleges.map((college, index) => ({
    ...college,
    distanceKm:
      distances[index] !== undefined
        ? Number(distances[index].toFixed(1))
        : null,
    durationMinutes:
      durations[index] !== undefined ? Math.round(durations[index] / 60) : null,
  }));
}
