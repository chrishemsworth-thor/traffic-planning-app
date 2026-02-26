import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="space-y-6 py-10">
      <h1 className="text-4xl font-bold">Traffic-aware trip planning in seconds</h1>
      <p className="max-w-2xl text-slate-300">
        Enter origin, destination, and preferred departure time to get an interpretable traffic score and alternatives.
      </p>
      <div className="flex gap-3">
        <Link href="/trip" className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-950">Plan a trip</Link>
        <Link href="/dashboard" className="rounded border border-slate-700 px-4 py-2">Open dashboard</Link>
      </div>
    </section>
  );
}
