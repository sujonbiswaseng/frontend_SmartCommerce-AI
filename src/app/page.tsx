import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:flex-nowrap md:gap-8 md:px-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Smart commerce
            </p>
            <span className="text-lg font-semibold">SmartCommerce AI</span>
          </div>
          <ThemeToggle variant="segmented" className="w-full md:w-auto" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-20 md:px-8 lg:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)] md:gap-10 md:items-center">
          <section className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="text-pretty text-4xl font-semibold leading-tight md:text-5xl">
              Operational AI for storefronts merchants actually trust.
            </h1>
            <p className="max-w-xl text-muted-foreground md:text-lg">
              Open the streamed assistant for catalog hygiene, omnichannel bundles,
              and search tuning—all without leaving a premium operator surface tuned
              for speed and audits.
            </p>
            <div className="flex flex-wrap gap-8">
              <Link
                href="/assistant"
                className="inline-flex rounded-xl bg-primary px-8 py-2 text-primary-foreground shadow-md transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Launch workspace
              </Link>
              <Link
                href="/assistant"
                className="inline-flex rounded-xl border border-border px-8 py-2 shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Try suggestions
              </Link>
            </div>
          </section>

          <aside
            className="relative overflow-hidden rounded-2xl border border-border bg-muted/40 p-8 shadow-lg"
            aria-label="Preview pane"
          >
            <div className="rounded-2xl border border-accent bg-accent/10 p-8 text-accent-foreground shadow-md backdrop-blur-sm supports-[backdrop-filter]:bg-accent/10">
              <p className="text-xs uppercase tracking-wide">Live operator frame</p>
              <div className="mt-12 space-y-8">
                <div className="h-16 rounded-xl bg-muted/80 shadow-md" />
                <div className="h-20 rounded-xl bg-muted/70 shadow-md" />
                <div className="h-20 rounded-xl bg-muted/70 shadow-md" />
              </div>
              <p className="mt-12 text-sm text-muted-foreground">
                Mirrors the streamed assistant UX with segmented themes, tactile
                cards, and glass composer controls.
              </p>
              <Link
                href="/assistant"
                className="mt-8 inline-flex rounded-xl border border-accent bg-card px-8 py-2 text-sm shadow-sm transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open assistant
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
