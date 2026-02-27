import { describe, expect, it } from "vitest";
import { getProbeOffsets, selectAlternatives } from "@/lib/probing";
import type { ScoredOption } from "@/types/trip";

const primary: ScoredOption = {
  departureTimeIso: "2026-01-01T00:00:00.000Z",
  trafficSec: 3600,
  freeflowSec: 2400,
  ratio: 1.5,
  score: 3,
  leaveAtIso: "2025-12-31T23:00:00.000Z"
};

describe("probing", () => {
  it("probes around time only for score <=3", () => {
    expect(getProbeOffsets(3)).toEqual([-120, -90, -60, -45, -30, -15, 0, 15, 30]);
    expect(getProbeOffsets(4)).toEqual([0]);
  });

  it("returns best two alternatives with >= +1 improvement when possible", () => {
    const candidates: ScoredOption[] = [
      { ...primary, departureTimeIso: "2026-01-01T00:15:00.000Z", score: 4, ratio: 1.2 },
      { ...primary, departureTimeIso: "2026-01-01T00:30:00.000Z", score: 5, ratio: 1.08 },
      { ...primary, departureTimeIso: "2026-01-01T00:45:00.000Z", score: 3, ratio: 1.4 }
    ];

    const result = selectAlternatives(primary, candidates);
    expect(result).toHaveLength(2);
    expect(result[0].score).toBe(5);
    expect(result[1].score).toBe(4);
  });
});
