import { getFromCache, setInCache } from "@/lib/cache";
import { roundTo15MinBucket } from "@/lib/scoring";

interface RouteDurationResult {
  trafficSec: number;
  freeflowSec: number;
}

function parseGoogleDuration(duration?: string): number {
  if (!duration) return 0;
  return Number(duration.replace("s", ""));
}

export async function fetchRouteDurations(origin: string, destination: string, departureTimeIso: string): Promise<RouteDurationResult> {
  const timeBucket = roundTo15MinBucket(departureTimeIso);
  const key = `${origin}|${destination}|${timeBucket}`;
  const cached = getFromCache(key);
  if (cached) return cached;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is missing");
  }

  const body = {
    origin: { address: origin },
    destination: { address: destination },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    departureTime: new Date(departureTimeIso).toISOString(),
    computeAlternativeRoutes: false,
    units: "METRIC"
  };

  const trafficResp = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.duration"
    },
    body: JSON.stringify(body)
  });

  if (!trafficResp.ok) {
    throw new Error(`Routes traffic call failed: ${trafficResp.status}`);
  }

  const trafficJson = await trafficResp.json();
  const trafficSec = parseGoogleDuration(trafficJson?.routes?.[0]?.duration);

  const freeflowResp = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.staticDuration"
    },
    body: JSON.stringify(body)
  });

  if (!freeflowResp.ok) {
    throw new Error(`Routes freeflow call failed: ${freeflowResp.status}`);
  }

  const freeflowJson = await freeflowResp.json();
  const freeflowSec = parseGoogleDuration(freeflowJson?.routes?.[0]?.staticDuration);

  const result = { trafficSec, freeflowSec: freeflowSec || trafficSec };
  setInCache(key, result);
  return result;
}
