import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Briefcase,
  Building2,
  GraduationCap,
  IndianRupee,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Shell } from "@/components/dash/Shell";
import { Bar as MiniBar, Kpi, Panel, Pill, chartColors } from "@/components/dash/bits";
import {
  aiInterviews,
  ctcBands,
  deptStats,
  drives,
  funnel,
  monthlyPlacements,
  overviewKpis,
  schedules,
  yearlyTrend,
} from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentBro — Placement Command Center for College TPOs" },
      {
        name: "description",
        content:
          "TalentBro gives training & placement officers live KPIs, department analytics, drive pipelines and AI interview insights in one dashboard.",
      },
      { property: "og:title", content: "TalentBro — Placement Command Center" },
      {
        property: "og:description",
        content:
          "Live placement KPIs, department analytics, drive pipelines and AI interview insights for college TPOs.",
      },
    ],
  }),
  component: Overview,
});

const RANGES = ["This Month", "This Quarter", "Academic Year"] as const;

function Overview() {
  const k = overviewKpis();
  const depts = deptStats();
  const [range, setRange] = useState<(typeof RANGES)[number]>("Academic Year");
  const [metric, setMetric] = useState<"offers" | "avgCtc">("offers");

  const trend = useMemo(() => {
    if (range === "This Month") return monthlyPlacements.slice(-2);
    if (range === "This Quarter") return monthlyPlacements.slice(-4);
    return monthlyPlacements;
  }, [range]);

  const avgAi = Math.round(aiInterviews.reduce((a, b) => a + b.overall, 0) / aiInterviews.length);
  const live = drives.filter((d) => d.status !== "Completed");

  return (
    <Shell
      title="Placement Overview"
      subtitle="Sardar Vallabhbhai Institute of Technology, Pune · Batch of 2026"
      actions={
        <>
          <div className="flex rounded-md border border-border bg-card p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Link
            to="/drives"
            className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            New Drive
          </Link>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Eligible Students" value={k.totalStudents} delta={4} hint="vs last batch" icon={GraduationCap} />
        <Kpi label="Placement Rate" value={k.rate} suffix="%" delta={6} hint="target 92%" icon={TrendingUp} />
        <Kpi label="Average CTC" value={k.avgCtc} suffix="LPA" delta={13} hint={`high ₹${k.highestCtc}L`} icon={IndianRupee} />
        <Kpi label="Active Recruiters" value={k.recruiters} delta={9} hint={`${k.activeDrives} live drives`} icon={Building2} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Placement Momentum"
          description={metric === "offers" ? "Offers rolled out per month" : "Average CTC trend (LPA)"}
          action={
            <div className="flex rounded-md border border-border p-0.5">
              {(["offers", "avgCtc"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                    metric === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {m === "offers" ? "Offers" : "Avg CTC"}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={268}>
            <AreaChart data={trend} margin={{ left: -18, right: 6, top: 6 }}>
              <defs>
                <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.ink} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={chartColors.ink} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartColors.light }} />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={chartColors.ink}
                strokeWidth={2}
                fill="url(#ink)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Placement Funnel" description="Batch of 2026, all drives combined">
          <div className="space-y-3.5">
            {funnel.map((f, i) => {
              const first = funnel[0]?.value ?? 1;
              const prev = funnel[i - 1]?.value;
              return (
                <div key={f.stage}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium">{f.stage}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {f.value.toLocaleString("en-IN")}
                      {prev && <span className="ml-2">{Math.round((f.value / prev) * 100)}%</span>}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <MiniBar value={f.value} max={first} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Department Analytics" description="Placement rate and average CTC by branch">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={depts} margin={{ left: -18, right: 6, top: 6 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="short" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0 0 0 / 0.04)" }} />
              <Bar dataKey="rate" name="Placement %" radius={[4, 4, 0, 0]}>
                {depts.map((d, i) => (
                  <Cell key={d.department} fill={i % 2 ? chartColors.mid : chartColors.ink} />
                ))}
              </Bar>
              <Bar dataKey="avgCtc" name="Avg CTC (LPA)" fill={chartColors.light} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {depts.map((d) => (
              <div key={d.department} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{d.department}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {d.placed}/{d.total} placed · ₹{d.avgCtc}L avg
                  </p>
                </div>
                <span className="stat-num text-sm">{d.rate}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="6-Year Trend" description="Placement rate %">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={yearlyTrend} margin={{ left: -24, right: 6, top: 6 }}>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} domain={[60, 95]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke={chartColors.ink} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <Panel title="CTC Distribution" description="Offers by salary band">
            <div className="space-y-3">
              {ctcBands.map((b) => (
                <div key={b.band}>
                  <div className="flex justify-between text-xs">
                    <span>{b.band}</span>
                    <span className="font-mono text-muted-foreground">{b.students}</span>
                  </div>
                  <div className="mt-1.5">
                    <MiniBar value={b.students} max={130} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Active Drives"
          description={`${live.length} drives in progress or scheduled`}
          action={
            <Link to="/drives" className="text-xs font-medium underline underline-offset-4">
              View all
            </Link>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border">
            {live.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-md bg-muted font-display text-xs font-bold">
                  {d.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {d.company} · <span className="text-muted-foreground">{d.role}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {d.date} · {d.mode} · ₹{d.ctc}L · {d.registered} registered
                  </p>
                </div>
                <div className="w-32">
                  <MiniBar value={d.shortlisted} max={d.registered} />
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {d.shortlisted} shortlisted
                  </p>
                </div>
                <Pill tone={d.status === "Live" ? "solid" : "outline"}>{d.stage}</Pill>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Upcoming Schedule" description="Next 10 days" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {schedules.map((s) => (
                <li key={s.id} className="flex gap-3 px-5 py-3.5">
                  <div className="w-12 shrink-0 rounded-md border border-border py-1 text-center">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">
                      {s.date.split(" ")[0]}
                    </p>
                    <p className="stat-num text-sm">{s.date.split(" ")[1]}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {s.time} · {s.venue}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="AI Interview Insights"
            description="Last 24 evaluated mock interviews"
            action={<Sparkles className="size-4 text-muted-foreground" />}
          >
            <div className="flex items-end gap-4">
              <p className="stat-num text-4xl">{avgAi}</p>
              <div className="pb-1.5">
                <p className="text-xs text-muted-foreground">avg readiness score</p>
                <p className="font-mono text-[11px]">+6 pts vs previous batch</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {aiInterviews.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-xs">{a.student}</span>
                  <div className="w-20">
                    <MiniBar value={a.overall} />
                  </div>
                  <span className="w-8 text-right font-mono text-[11px]">{a.overall}</span>
                </div>
              ))}
            </div>
            <Link
              to="/ai-interviews"
              className="mt-4 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-xs font-medium transition-colors hover:bg-accent"
            >
              <Briefcase className="size-3.5" /> Open evaluations
            </Link>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

export const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid oklch(0.9 0 0)",
  background: "oklch(1 0 0)",
  fontSize: 12,
  fontFamily: "inherit",
} as const;
