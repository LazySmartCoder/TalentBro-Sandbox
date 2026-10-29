import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar as RBar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bot, Play, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/dash/Shell";
import { Bar, Kpi, Panel, Pill, chartColors } from "@/components/dash/bits";
import { DEPARTMENTS, aiInterviews, aiSkillRadar, type AiInterview } from "@/lib/data";

export const Route = createFileRoute("/ai-interviews")({
  head: () => ({
    meta: [
      { title: "AI Interviews — TalentBro Readiness Insights" },
      {
        name: "description",
        content:
          "AI-evaluated mock interviews with communication, technical and problem-solving scores, verdicts and coaching gaps.",
      },
      { property: "og:title", content: "AI Interviews — TalentBro" },
      {
        property: "og:description",
        content: "AI-scored mock interviews with verdicts, strengths and coaching gaps per student.",
      },
    ],
  }),
  component: AiInterviewsPage,
});

const VERDICTS = ["All", "Strong Hire", "Hire", "Borderline", "Needs Work"];

function AiInterviewsPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [verdict, setVerdict] = useState("All");
  const [selected, setSelected] = useState<AiInterview | null>(null);

  const list = useMemo(
    () =>
      aiInterviews.filter(
        (a) =>
          `${a.student} ${a.roll} ${a.role}`.toLowerCase().includes(q.toLowerCase()) &&
          (dept === "All" || a.department === dept) &&
          (verdict === "All" || a.verdict === verdict),
      ),
    [q, dept, verdict],
  );

  const avg = Math.round(list.reduce((a, b) => a + b.overall, 0) / Math.max(1, list.length));
  const deptAvg = DEPARTMENTS.map((d) => {
    const rows = aiInterviews.filter((a) => a.department === d);
    return {
      short: d.split(" ")[0],
      score: rows.length ? Math.round(rows.reduce((a, b) => a + b.overall, 0) / rows.length) : 0,
    };
  });

  return (
    <Shell
      title="AI Interviews"
      subtitle="Automated mock interview evaluations and readiness coaching"
      actions={
        <button
          onClick={() => toast.success("New AI mock interview batch queued for 40 students")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Play className="size-3.5" /> Launch Batch
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Interviews Evaluated" value={list.length} hint="in selection" icon={Bot} />
        <Kpi label="Average Score" value={avg} suffix="/100" delta={6} hint="vs last batch" />
        <Kpi label="Strong Hire" value={list.filter((a) => a.verdict === "Strong Hire").length} hint="top verdicts" />
        <Kpi label="Needs Coaching" value={list.filter((a) => a.verdict === "Needs Work").length} hint="flagged students" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Department Readiness" description="Average AI interview score by branch">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptAvg} margin={{ left: -18, right: 6, top: 6 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="short" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip contentStyle={tooltip} cursor={{ fill: "oklch(0 0 0 / 0.04)" }} />
              <RBar dataKey="score" name="Avg score" fill={chartColors.ink} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Skill Benchmark" description="Cohort vs recruiter benchmark">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={aiSkillRadar} outerRadius="72%">
              <PolarGrid stroke={chartColors.grid} />
              <PolarAngleAxis dataKey="skill" fontSize={10} />
              <Radar dataKey="benchmark" stroke={chartColors.light} fill={chartColors.light} fillOpacity={0.4} />
              <Radar dataKey="score" stroke={chartColors.ink} fill={chartColors.ink} fillOpacity={0.18} />
              <Tooltip contentStyle={tooltip} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel className="mt-4" bodyClassName="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search evaluations by student, roll no or role…"
              className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm">
            <option>All</option>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select value={verdict} onChange={(e) => setVerdict(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm">
            {VERDICTS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => (
          <button key={a.id} onClick={() => setSelected(a)} className="panel p-5 text-left transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{a.student}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {a.roll} · {a.role}
                </p>
              </div>
              <Pill tone={a.verdict === "Strong Hire" ? "solid" : "outline"}>{a.verdict}</Pill>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <p className="stat-num text-3xl">{a.overall}</p>
              <p className="pb-1.5 font-mono text-[11px] text-muted-foreground">
                {a.date} · {a.duration}
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["Communication", a.communication],
                ["Technical", a.technical],
                ["Problem Solving", a.problemSolving],
              ].map(([l, v]) => (
                <div key={l as string} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 text-[11px] text-muted-foreground">{l}</span>
                  <div className="flex-1">
                    <Bar value={Number(v)} />
                  </div>
                  <span className="w-6 text-right font-mono text-[11px]">{v}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
        {list.length === 0 && (
          <Panel className="sm:col-span-2 xl:col-span-3">
            <p className="py-8 text-center text-sm text-muted-foreground">No evaluations match these filters.</p>
          </Panel>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
          <div className="panel max-h-[88vh] w-full max-w-2xl overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">{selected.student}</h2>
                <p className="font-mono text-xs text-muted-foreground">
                  {selected.roll} · {selected.role} · {selected.date}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-md p-1 hover:bg-accent">
                <X className="size-4" />
              </button>
            </div>
            <div className="grid gap-3 px-6 py-5 sm:grid-cols-5">
              {[
                ["Overall", selected.overall],
                ["Comm.", selected.communication],
                ["Technical", selected.technical],
                ["Problem", selected.problemSolving],
                ["Confidence", selected.confidence],
              ].map(([l, v]) => (
                <div key={l as string} className="rounded-md border border-border px-3 py-2.5 text-center">
                  <p className="mono-label">{l}</p>
                  <p className="stat-num mt-1 text-xl">{v}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 px-6 pb-5">
              <div className="rounded-md bg-muted p-4">
                <p className="mono-label">AI summary</p>
                <p className="mt-1.5 text-sm">{selected.summary}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mono-label">Strengths</p>
                  <ul className="mt-2 space-y-1.5">
                    {selected.strengths.map((s) => (
                      <li key={s} className="text-xs">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mono-label">Improvement areas</p>
                  <ul className="mt-2 space-y-1.5">
                    {selected.gaps.map((s) => (
                      <li key={s} className="text-xs">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <button
                onClick={() => toast.success(`Coaching plan assigned to ${selected.student}`)}
                className="rounded-md border border-border px-3.5 py-2 text-xs font-medium hover:bg-accent"
              >
                Assign coaching
              </button>
              <button
                onClick={() => toast.success(`Re-interview scheduled for ${selected.student}`)}
                className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                Schedule re-interview
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

const tooltip = {
  borderRadius: 8,
  border: "1px solid oklch(0.9 0 0)",
  background: "oklch(1 0 0)",
  fontSize: 12,
} as const;
