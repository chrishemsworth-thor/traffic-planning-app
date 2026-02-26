"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface CalendarEvent {
  id: string;
  summary: string;
  location?: string;
  start: string;
}

interface EventScore {
  eventId: string;
  score?: number;
  leaveAtIso?: string;
  error?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [scores, setScores] = useState<Record<string, EventScore>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/calendar/events")
      .then(async (resp) => {
        const payload = await resp.json();
        if (!resp.ok) throw new Error(payload.error || "Failed");
        const loaded = payload.events || [];
        setEvents(loaded);

        await Promise.all(
          loaded
            .filter((event: CalendarEvent) => event.location && event.start)
            .map(async (event: CalendarEvent) => {
              try {
                const routeResp = await fetch("/api/trip/score", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    origin: process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "Kuala Lumpur Sentral",
                    destination: event.location,
                    departureTimeIso: new Date(event.start).toISOString()
                  })
                });
                const routePayload = await routeResp.json();
                if (!routeResp.ok) throw new Error(routePayload.error || "Unable to score");
                setScores((prev) => ({
                  ...prev,
                  [event.id]: {
                    eventId: event.id,
                    score: routePayload.primary.score,
                    leaveAtIso: routePayload.primary.leaveAtIso
                  }
                }));
              } catch (e) {
                setScores((prev) => ({ ...prev, [event.id]: { eventId: event.id, error: (e as Error).message } }));
              }
            })
        );
      })
      .catch((e) => setError(e.message));
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {!session ? (
        <button onClick={() => signIn("google")} className="rounded bg-cyan-500 px-3 py-2 font-medium text-slate-950">Sign in with Google</button>
      ) : (
        <>
          <div className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 p-3">
            <p>Signed in as {session.user?.email}</p>
            <button onClick={() => signOut()} className="rounded border border-slate-700 px-3 py-1">Sign out</button>
          </div>
          {error && <p className="text-rose-300">{error}</p>}
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="rounded border border-slate-800 bg-slate-900 p-3">
                <p className="font-medium">{event.summary}</p>
                <p className="text-sm text-slate-300">{event.start}</p>
                <p className="text-sm text-slate-300">{event.location || "No location"}</p>
                {scores[event.id]?.score && (
                  <p className="text-sm text-cyan-300">Traffic score {scores[event.id].score}, leave at {new Date(scores[event.id].leaveAtIso as string).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })}</p>
                )}
                {scores[event.id]?.error && <p className="text-sm text-rose-300">{scores[event.id].error}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
