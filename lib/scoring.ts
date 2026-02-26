import { TrafficScore } from "@/types/trip";

export function computeScore(ratio: number): TrafficScore {
  if (ratio <= 1.1) return 5;
  if (ratio <= 1.3) return 4;
  if (ratio <= 1.6) return 3;
  if (ratio <= 2.0) return 2;
  return 1;
}

export function roundTo15MinBucket(iso: string): string {
  const date = new Date(iso);
  const minutes = date.getUTCMinutes();
  const rounded = Math.floor(minutes / 15) * 15;
  date.setUTCMinutes(rounded, 0, 0);
  return date.toISOString();
}
