import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EnvGate } from "@/components/sandbox/env-gate";
import { MessageSquare, BarChart3, Users, Briefcase, Sparkles } from "lucide-react";

export const Route = createFileRoute("/copilot")({
  component: CopilotPage,
});

const queries = [
  {
    title: "Cohort readiness snapshot",
    desc: "Overview of eligible/placed/in-process students with avg CGPA and CTCPackage",
    prompt: "Show me cohort readiness snapshot: total students, eligible, placed, in-process, avg CGPA, avg expected CTC",
  },
  {
    title: "Top students by readiness",
    desc: "Rank students by performance score",
    prompt: "List top 10 students by performance score with department and placement status",
  },
  {
    title: "Drive pipeline",
    desc: "Active/upcoming drives with registrations and openings",
    prompt: "Show active and upcoming drives with company, role, CTC, openings, registered count",
  },
  {
    title: "Department-wise placement rate",
    desc: "Placement % by department",
    prompt: "Give department-wise placement rate: total, eligible, placed, % placed",
  },
  {
    title: "Companies by tier",
    desc: "Breakdown by super dream/dream/core/mass",
    prompt: "Breakdown companies by tier with counts and average min CTC",
  },
];

function CopilotPage() {
  const navigate = useNavigate();

  const runQuery = (prompt: string) => {
    // For demo, route to chat with pre-filled context via query param
    void navigate({ to: "/chat", search: { q: prompt } as any });
  };

  return (
    <EnvGate allow="copilot">
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">TalentBro</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Placement Cell · AI Copilot
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void navigate({ to: "/" })}
                className="rounded-full border border-border px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-secondary"
              >
                Switch environment
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:px-8 sm:pt-16">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium">
                <Sparkles className="size-3" />
                Placement-cell AI Copilot
              </span>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ask in plain English. Get answers from demo data.
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Pre-typed queries below compute real answers using the shared demo dataset.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {queries.map((q) => (
                <button
                  key={q.title}
                  onClick={() => runQuery(q.prompt)}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg border border-border bg-background">
                      <MessageSquare className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{q.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{q.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => void navigate({ to: "/dashboard" })}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <BarChart3 className="size-4" />
                Open Staff Dashboard
              </button>
              <button
                onClick={() => void navigate({ to: "/students" })}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Users className="size-4" />
                Students
              </button>
              <button
                onClick={() => void navigate({ to: "/drives" })}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Briefcase className="size-4" />
                Drives
              </button>
            </div>
          </section>
        </main>
      </div>
    </EnvGate>
  );
}
