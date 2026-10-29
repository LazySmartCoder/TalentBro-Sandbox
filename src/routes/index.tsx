import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { activateEnvironment } from "@/lib/sandbox-env";
import { SiteFooter } from "@/components/site-footer";
import { SandboxGraphic } from "@/components/graphics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sandbox | TalentBro Institutions" },
      {
        name: "description",
        content: "Activate a TalentBro Institutions sandbox environment.",
      },
    ],
  }),
  component: DemoPage,
});

const STUDENT_FEATURES = [
  "AI chat & practice planner",
  "Self-training hub (APLR/DSA/Technical/Basic Math/Situational)",
  "Mock interviews with analysis",
  "Group discussions",
  "Roadmap, coding assessment, reading comprehension",
  "Companies & drives, forum, learning/courses, resume builder",
];

const STAFF_FEATURES = [
  "Placement cell dashboard",
  "Students, companies, drives",
  "Readiness leaderboard & reports",
  "Launch targets, billing, staff chat",
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2 text-[13px] text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="text-foreground">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function EnvCard({
  env,
  eyebrow,
  title,
  copy,
  features,
  onPick,
}: {
  env: "student" | "staff";
  eyebrow: string;
  title: string;
  copy: string;
  features: string[];
  onPick: (env: "student" | "staff") => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-7 sm:p-9">
      <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {eyebrow}
      </span>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
      <FeatureList items={features} />
      <div className="mt-7">
        <button
          onClick={() => onPick(env)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Activate {title} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function DemoPage() {
  const navigate = useNavigate();

  const pick = (env: "student" | "staff") => {
    const { entry } = activateEnvironment(env);
    void navigate({ to: entry as any });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight">TalentBro</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Sandbox
            </span>
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-paper opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
          <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div className="max-w-3xl">
                <h1 className="text-[2.4rem] leading-[1.02] font-semibold sm:text-5xl lg:text-6xl">
                  Choose your sandbox
                  <br />
                  environment.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Open the Student Side or the Placement Cell side. All data runs from a shared demo
                  dataset with pre-typed AI prompts. Progress lives in your browser.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("environments")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
                >
                  Explore Demo <span aria-hidden>↓</span>
                </button>
              </div>

              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
                  <div className="pointer-events-none absolute inset-0 grid-paper opacity-30" />
                  <SandboxGraphic className="relative w-full" />
                  <div className="relative mt-1 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse-soft" />
                    sandbox ready
                  </div>
                </div>
              </div>
            </div>

            <div id="environments" className="mt-12 grid scroll-mt-24 gap-5 md:grid-cols-2">
              <EnvCard
                env="student"
                eyebrow="Candidate side"
                title="Student Side"
                copy="Aarav Sharma's workspace — chat, training, interviews, roadmap, drives, forum and more."
                features={STUDENT_FEATURES}
                onPick={pick}
              />
              <EnvCard
                env="staff"
                eyebrow="Placement cell"
                title="Placement Cell"
                copy="Cohort, companies, drives, readiness, launch targets, billing, and student drill-downs."
                features={STAFF_FEATURES}
                onPick={pick}
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
