import type { ScoredOption } from "@/types/trip";

function colorByScore(score: number): string {
  if (score >= 4) return "text-emerald-300";
  if (score === 3) return "text-amber-300";
  return "text-rose-300";
}

function toLocal(iso: string): string {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur"
  }).format(new Date(iso));
}

export function ResultsCard({ title, option }: { title: string; option: ScoredOption }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={`text-3xl font-bold ${colorByScore(option.score)}`}>Score {option.score}/5</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">
        <li>Departure: {toLocal(option.departureTimeIso)}</li>
        <li>Estimated travel: {Math.round(option.trafficSec / 60)} min</li>
        <li>Free-flow: {Math.round(option.freeflowSec / 60)} min</li>
        <li>Ratio: {option.ratio.toFixed(2)}</li>
        <li>Leave at: {toLocal(option.leaveAtIso)}</li>
      </ul>
    </div>
  );
}
