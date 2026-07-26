export type ActionType = "CLOCK_IN" | "CLOCK_OUT" | "BREAK_START" | "BREAK_END" | "ON_CALL";
export type VerificationMode = "camera_qr" | "my_badge" | "biometric" | "manual_pin";

export interface LocationState {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface AttendanceLog {
  id: number;
  timestamp: string;
  type: string;
  mode: string;
  status: string;
  location: string;
}

export const OFFICE_BRANCHES = [
  { name: "Phnom Penh HQ", lat: 11.5564, lng: 104.9282 },
  { name: "Sihanoukville Clinic", lat: 10.6275, lng: 103.5221 },
  { name: "Siem Reap Center", lat: 13.3671, lng: 103.8448 },
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
