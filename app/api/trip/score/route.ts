import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchRouteDurations } from "@/lib/routesClient";
import { computeScore } from "@/lib/scoring";
import { getProbeOffsets, selectAlternatives } from "@/lib/probing";
import { addMinutes, KUALA_LUMPUR_TIMEZONE } from "@/lib/time";
import type { ScoredOption, TripScoreResponse } from "@/types/trip";

const requestSchema = z.object({
  origin: z.string().min(3),
  destination: z.string().min(3),
  departureTimeIso: z.string().datetime()
});

async function buildOption(origin: string, destination: string, departureTimeIso: string): Promise<ScoredOption> {
  const { trafficSec, freeflowSec } = await fetchRouteDurations(origin, destination, departureTimeIso);
  const ratio = freeflowSec > 0 ? trafficSec / freeflowSec : 1;
  const score = computeScore(ratio);
  return {
    departureTimeIso,
    trafficSec,
    freeflowSec,
    ratio,
    score,
    leaveAtIso: addMinutes(departureTimeIso, -Math.round(trafficSec / 60))
  };
}

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const { origin, destination, departureTimeIso } = parsed.data;
    const primary = await buildOption(origin, destination, departureTimeIso);

    const offsets = getProbeOffsets(primary.score);
    const candidates = await Promise.all(
      offsets.map((offset) => buildOption(origin, destination, addMinutes(departureTimeIso, offset)))
    );

    const alternatives = selectAlternatives(primary, candidates);

    const response: TripScoreResponse = {
      timezone: KUALA_LUMPUR_TIMEZONE,
      primary,
      alternatives
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
