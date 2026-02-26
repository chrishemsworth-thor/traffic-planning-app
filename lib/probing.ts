import { ScoredOption } from "@/types/trip";

const OFFSETS = [-120, -90, -60, -45, -30, -15, 0, 15, 30];

export function getProbeOffsets(initialScore: number): number[] {
  return initialScore <= 3 ? OFFSETS : [0];
}

export function selectAlternatives(primary: ScoredOption, candidates: ScoredOption[]): ScoredOption[] {
  const improved = candidates
    .filter((candidate) => candidate.departureTimeIso !== primary.departureTimeIso)
    .sort((a, b) => b.score - a.score || a.ratio - b.ratio);

  const plusOne = improved.filter((candidate) => candidate.score >= primary.score + 1).slice(0, 2);
  if (plusOne.length > 0) {
    return plusOne;
  }

  return improved.slice(0, 2);
}
