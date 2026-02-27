import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const week = new Date(now);
  week.setDate(now.getDate() + 7);

  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", now.toISOString());
  url.searchParams.set("timeMax", week.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${session.accessToken}` }
  });

  if (!resp.ok) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }

  const payload = await resp.json();
  const events = (payload.items || []).map((event: any) => ({
    id: event.id,
    summary: event.summary,
    location: event.location,
    start: event.start?.dateTime || event.start?.date
  }));

  return NextResponse.json({ events });
}
