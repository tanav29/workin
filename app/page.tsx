import Link from "next/link";
import { MapPin, Users, Radio } from "lucide-react";
import { LiveStats } from "@/components/app/live-stats";
import { HeroAuthCta } from "@/components/app/hero-auth-cta";

export default function Page() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium tracking-tight">Live</span>
              <span className="text-muted-foreground">— Find builders working nearby</span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Work near people
              <span className="text-muted-foreground"> you should meet.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Check in at your cafe, library or coworking space. See who&apos;s working within a few kilometers, wave hello, and make serendipity happen.
            </p>

            <div className="mt-6 flex justify-center">
              <LiveStats />
            </div>

            <HeroAuthCta />

            <p className="mt-3 text-xs text-muted-foreground">No spam. No feed. Just presence.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Live map",
              desc: "Real-time check-ins within 2–25 km. Fuzz your pin if you want privacy.",
            },
            {
              icon: Users,
              title: "Social context",
              desc: "See name, note, place and how long someone has been there.",
            },
            {
              icon: Radio,
              title: "Lightweight signals",
              desc: "Wave or request to join. Owner approves with one tap.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
                <f.icon className="size-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-10 rounded-xl border bg-card p-6 sm:p-8">
          <h2 className="text-sm font-semibold tracking-tight">How it works</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3 text-sm">
            <div className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">1</span>
              <p className="leading-6 text-muted-foreground"><span className="font-medium text-foreground">Allow location</span> on /nearby and set your radius.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">2</span>
              <p className="leading-6 text-muted-foreground"><span className="font-medium text-foreground">Check in</span> with what you&apos;re building, your status and visibility.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">3</span>
              <p className="leading-6 text-muted-foreground"><span className="font-medium text-foreground">Connect</span> — wave or request to join, meet IRL.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed px-4 py-3 text-xs text-muted-foreground">
          <span>Built for Indie hackers, designers & founders who like working around others.</span>
          <Link href="/nearby" className="font-medium text-foreground hover:underline underline-offset-4">Open map →</Link>
        </div>
      </section>
    </div>
  );
}
