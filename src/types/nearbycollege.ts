export type College = {
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