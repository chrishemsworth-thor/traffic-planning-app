export type TrafficScore = 1 | 2 | 3 | 4 | 5;

export interface TripScoreRequest {
  origin: string;
  destination: string;
  departureTimeIso: string;
}

export interface ScoredOption {
  departureTimeIso: string;
  trafficSec: number;
  freeflowSec: number;
  ratio: number;
  score: TrafficScore;
  leaveAtIso: string;
}

export interface TripScoreResponse {
  timezone: "Asia/Kuala_Lumpur";
  primary: ScoredOption;
  alternatives: ScoredOption[];
}
