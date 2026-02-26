# Trip Traffic Scorer MVP (Next.js + TypeScript + Tailwind)

Vercel-deployable MVP with:
- `POST /api/trip/score` (core)
- `GET /api/calendar/events` (auth-protected)
- Landing `/`, planner `/trip`, dashboard `/dashboard`
- Kuala Lumpur timezone output (`Asia/Kuala_Lumpur`)
- Google Routes API traffic/freeflow scoring
- In-memory LRU cache keyed by `origin|destination|timeBucket15min`
- Unit tests for score mapping and probing selection

## Local run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## API contract

### POST `/api/trip/score`
Request:
```json
{
  "origin": "Kuala Lumpur Sentral",
  "destination": "Petronas Twin Towers",
  "departureTimeIso": "2026-03-02T10:00:00.000Z"
}
```

Response:
```json
{
  "timezone": "Asia/Kuala_Lumpur",
  "primary": {
    "departureTimeIso": "...",
    "trafficSec": 1800,
    "freeflowSec": 1200,
    "ratio": 1.5,
    "score": 3,
    "leaveAtIso": "..."
  },
  "alternatives": []
}
```

### Scoring
`ratio = trafficSec / freeflowSec`
- score 5: `<=1.10`
- score 4: `1.10-1.30`
- score 3: `1.30-1.60`
- score 2: `1.60-2.00`
- score 1: `>2.00`

### Alternative probing
Offsets in minutes around target: `[-120,-90,-60,-45,-30,-15,0,+15,+30]`
- run only when initial score `<=3`
- return best 2 alternatives
- prefer alternatives that improve by `>= +1` score level

## Calendar integration
- NextAuth Google OAuth via `/api/auth/[...nextauth]`
- `/api/calendar/events` returns next 7 days events
- `/dashboard` displays events and attempts traffic score for events with location

## Deploy on Vercel
1. Import repo
2. Set env vars from `.env.example`
3. Deploy
