import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EnvGate } from "@/components/sandbox/env-gate";
import { getSandboxEnv } from "@/lib/sandbox-env";
import { BookOpen, MessageSquare, Mic, Users, BarChart3, FileText, Briefcase, GraduationCap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/student")({
  component: StudentEnvPage,
});

const tiles = [
  { to: "/chat", label: "AI Chat", icon: MessageSquare, desc: "Practice with AI, browse pre-typed prompts" },
  { to: "/self-training", label: "Self Training", icon: BookOpen, desc: "APLR, DSA, Technical, Basic Math, Situational" },
  { to: "/mock-interview", label: "Mock Interview", icon: Mic, desc: "AI panel, analysis & history" },
  { to: "/gd-training", label: "Group Discussion", icon: Users, desc: "Practice rounds with AI panel" },
  { to: "/leaderboard", label: "Leaderboard", icon: BarChart3, desc: "Readiness ranking" },
  { to: "/candidate-profile", label: "Profile", icon: FileText, desc: "Resume, skills, projects" },
  { to: "/companies", label: "Companies & Drives", icon: Briefcase, desc: "Browse companies and apply" },
  { to: "/tutorials", label: "Learning", icon: GraduationCap, desc: "Courses, tutorials & resources" },
  { to: "/notifications", label: "Notifications", icon: Sparkles, desc: "Updates from placement cell" },
];

function StudentEnvPage() {
  const navigate = useNavigate();
  const env = getSandboxEnv();

  return (
    <EnvGate allow="student">
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">TalentBro</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Student · Sandbox
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
                <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse-soft" />
                Student environment active
              </span>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome, Aarav Sharma
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Your placement readiness workspace. Practice, track progress, and explore opportunities.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tiles.map((tile) => (
                <Link
                  key={tile.to}
                  to={tile.to}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg border border-border bg-background">
                      <tile.icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{tile.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{tile.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </EnvGate>
  );
}
