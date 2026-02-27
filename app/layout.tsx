import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Trip Traffic Scorer",
  description: "Plan departure times based on live traffic score"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="font-semibold text-cyan-400">Trip Traffic Scorer</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/trip" className="hover:text-cyan-300">Trip Planner</Link>
              <Link href="/dashboard" className="hover:text-cyan-300">Dashboard</Link>
            </div>
          </nav>
        </header>
        <Providers><main className="mx-auto max-w-5xl p-4">{children}</main></Providers>
      </body>
    </html>
  );
}
