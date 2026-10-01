"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Clock3,
  Phone,
  Mail,
  Globe,
  Loader2,
  GraduationCap,
  AlertCircle,
  ExternalLink,
  School,
} from "lucide-react";

import { College } from "@/types/nearbycollege";

export default function NearbyCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const getNearbyColleges = () => {
    setError("");
    setColleges([]);
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationLoading(false);
      setError("Your browser does not support location services.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);

          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `/api/colleges/nearby?lat=${latitude}&lon=${longitude}&radius=50000`,
            {
              cache: "no-store",
            },
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to fetch nearby colleges.");
          }

          setColleges(Array.isArray(data.colleges) ? data.colleges : []);
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch nearby colleges.",
          );
        } finally {
          setLoading(false);
          setLocationLoading(false);
        }
      },
      (geoError) => {
        setLocationLoading(false);

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please allow location access and try again.",
            );
            break;

          case geoError.POSITION_UNAVAILABLE:
            setError("Your current location could not be determined.");
            break;

          case geoError.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;

          default:
            setError("Unable to get your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-10 flex flex-col items-center rounded-xl bg-purple-500/25 border border-purple-500 p-6  text-center shadow-lg shadow-purple-500/10 sm:p-10">
          <p className="flex w-fit items-center gap-2 border-2 rounded-full  border-purple-500  px-3 py-1.5 text-sm font-semibold text-purple-500 backdrop-blur-sm">
            <School className="h-4 w-4" />
            Nearby Colleges & Universities
          </p>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Explore Your College Options
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            Find colleges and universities near your current location with
            estimated driving distance and travel time.
          </p>

          <button
            type="button"
            onClick={getNearbyColleges}
            disabled={loading || locationLoading}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-102 hover:opacity-90 dark:bg-white dark:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading || locationLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Finding Colleges...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 duration-300" />
                Find Colleges Near Me
              </>
            )}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto mb-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 shadow-sm dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-4 h-6 w-3/4 rounded bg-muted" />
                <div className="mb-3 h-4 w-1/3 rounded bg-muted" />
                <div className="mb-6 h-10 w-full rounded bg-muted" />
                <div className="mb-2 h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && colleges.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-purple-500" />
                  <h2 className="text-xl font-bold">Colleges Near You</h2>
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Showing {colleges.length} nearby colleges and universities
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && colleges.length === 0 && (
          <div className="mx-auto max-w-xl rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
            <MapPin className="mx-auto h-10 w-10 text-purple-500 animate-bounce" />

            <h2 className="mt-4 text-lg font-semibold">
              Find colleges around you
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Allow location access to discover nearby colleges and
              universities.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function CollegeCard({ college }: { college: College }) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white dark:bg-neutral-900 dark:hover:bg-neutral-850 hover:border-purple-500 p-5 shadow-sm transition-all duration-300 hover:scale-102  hover:shadow-lg dark:border-white/10 ">
      {/* College Name */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 transition-transform duration-300 group-hover:rotate-3">
          <GraduationCap className="h-5 w-5 text-purple-500" />
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 font-bold leading-6 transition-colors ">
            {college.name}
          </h3>

          <span className="mt-1 inline-block text-xs text-gray-500 dark:text-gray-400">
            {college.type}
          </span>
        </div>
      </div>

      {/* Distance + Time */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-black/5 bg-black/3 p-3 transition-colors group-hover:bg-purple-500/5 dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="text-xs">Distance</span>
          </div>

          <p className="mt-1 text-lg font-semibold">
            {college.distanceKm !== null ? `${college.distanceKm} km` : "N/A"}
          </p>
        </div>

        <div className="rounded-xl border border-black/5 bg-black/3 p-3 transition-colors group-hover:bg-purple-500/5 dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock3 className="h-4 w-4 text-purple-500" />
            <span className="text-xs">Travel Time</span>
          </div>

          <p className="mt-1 text-lg font-semibold">
            {formatDuration(college.durationMinutes)}
          </p>
        </div>
      </div>

      {/* Address */}
      {college.address && (
        <div className="mt-5 flex gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />

          <p className="line-clamp-3">{college.address}</p>
        </div>
      )}

      {/* Contact */}
      <div className="mt-4 space-y-2 text-sm">
        {college.phone && (
          <a
            href={`tel:${college.phone}`}
            className="flex items-center gap-2 text-gray-500 transition-colors hover:text-purple-500 dark:text-gray-400"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span className="truncate">{college.phone}</span>
          </a>
        )}

        {college.email && (
          <a
            href={`mailto:${college.email}`}
            className="flex items-center gap-2 text-gray-500 transition-colors hover:text-purple-500 dark:text-gray-400"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{college.email}</span>
          </a>
        )}

        {college.website && (
          <a
            href={normalizeWebsite(college.website)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 transition-colors hover:text-purple-500 dark:text-gray-400"
          >
            <Globe className="h-4 w-4 shrink-0" />
            <span className="truncate">Official Website</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Directions */}
      <button
        type="button"
        onClick={openInGoogleMaps}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-emerald-500 hover:text-emerald-500 dark:border-white/10"
      >
        <Navigation className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        Get Directions
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}

function formatDuration(minutes: number | null) {
  if (minutes === null) {
    return "N/A";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function normalizeWebsite(website: string) {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
}
