"use client";

import { useState } from "react";
import { ResultsCard } from "@/components/ResultsCard";
import type { TripScoreResponse } from "@/types/trip";

export default function TripPage() {
  const [origin, setOrigin] = useState("Kuala Lumpur Sentral");
  const [destination, setDestination] = useState("Petronas Twin Towers");
  const [departureTimeIso, setDepartureTimeIso] = useState(new Date().toISOString().slice(0, 16));
  const [data, setData] = useState<TripScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const departureIso = new Date(departureTimeIso).toISOString();
      const resp = await fetch("/api/trip/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, departureTimeIso: departureIso })
      });
      const payload = await resp.json();
      if (!resp.ok) throw new Error(payload.error || "Request failed");
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Trip planner</h1>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-2">
        <input className="rounded bg-slate-800 p-2" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
        <input className="rounded bg-slate-800 p-2" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
        <input className="rounded bg-slate-800 p-2 md:col-span-2" type="datetime-local" value={departureTimeIso} onChange={(e) => setDepartureTimeIso(e.target.value)} />
        <button disabled={loading} className="rounded bg-cyan-500 px-3 py-2 font-medium text-slate-950 md:col-span-2">
          {loading ? "Scoring..." : "Score trip"}
        </button>
      </form>
      {error && <p className="rounded border border-rose-700 bg-rose-950 p-3 text-rose-200">{error}</p>}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <ResultsCard title="Primary" option={data.primary} />
          {data.alternatives.map((alt, idx) => (
            <ResultsCard key={alt.departureTimeIso} title={`Alternative ${idx + 1}`} option={alt} />
          ))}
        </div>
      )}
    </section>
  );
}
