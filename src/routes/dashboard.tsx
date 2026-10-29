import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, GraduationCap, TrendingUp } from "lucide-react";
import {
  getInstitutionOverview,
  me,
  type InstitutionOverview,
} from "@/lib/api";
import { Shell } from "@/components/dash/Shell";
import { GateLoading } from "@/components/load-state";
import { Bar as MiniBar, Kpi, Panel } from "@/components/dash/bits";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — TalentBro Institutions" }],
  }),
  component: Overview,
});

function Overview() {
  const navigate = useNavigate();
  const [gate, setGate] = useState<"loading" | "allowed">("loading");
  const [overview, setOverview] = useState<InstitutionOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    me()
      .then((u) => {
        if (cancelled) return;
        if (u?.role === "institution_staff" && u.profile_complete === false) {
          void navigate({ to: "/client-onboarding", replace: true });
          return;
        }
        setGate("allowed");
      })
      .catch(() => {
        if (!cancelled) setGate("allowed");
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (gate !== "allowed") return;
    let cancelled = false;
    Promise.all([getInstitutionOverview()])
      .then(([ov]) => {
        if (cancelled) return;
        setOverview(ov);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not load the dashboard.");
      });
    return () => {
      cancelled = true;
    };
  }, [gate]);

  if (gate === "loading" || (overview === null && !error)) {
    return <GateLoading />;
  }

  if (error !== null || overview === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="panel max-w-md p-8 text-center">
          <p className="text-sm font-semibold">Dashboard unavailable</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "No institution linked to this account."}
          </p>
          <button
            onClick={() => {
              setError(null);
              setOverview(null);
              setGate("loading");
              setTimeout(() => setGate("allowed"), 50);
            }}
            className="mt-5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const inst = overview.institution;
  const k = overview.kpis;
  const rate = k.total_students ? Math.round((k.placed / k.total_students) * 100) : 0;
  const maxTier = Math.max(1, ...overview.tiers.map((t) => t.count));

  return (
    <Shell
      title="Placement Overview"
      subtitle={`${inst.name} · ${inst.city ?? ""}${inst.state ? `, ${inst.state}` : ""} · Batch of ${overview.batch.year}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Total Students"
          value={k.total_students}
          hint={`${k.eligible_students} eligible`}
          icon={GraduationCap}
        />
        <Kpi
          label="Placement Rate"
          value={rate}
          suffix="%"
          hint={`${k.placed} placed · ${k.in_selection} in selection`}
          icon={TrendingUp}
        />
        <Kpi
          label="Average CGPA"
          value={k.avg_cgpa?.toFixed(2) ?? "—"}
          hint={`highest ${k.highest_cgpa?.toFixed(2) ?? "—"}`}
          icon={GraduationCap}
        />
        <Kpi
          label="Active Recruiters"
          value={k.recruiters}
          hint={`${k.active_drives} active drives · ${k.total_openings} openings`}
          icon={Building2}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-3" title="Company Tiers" description="Recorded recruiter spread">
          <div className="space-y-3">
            {overview.tiers.map((t) => (
              <div key={t.tier}>
                <div className="flex justify-between text-xs">
                  <span>{t.label}</span>
                  <span className="font-mono text-muted-foreground">{t.count} companies</span>
                </div>
                <div className="mt-1.5">
                  <MiniBar value={t.count} max={maxTier} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}
