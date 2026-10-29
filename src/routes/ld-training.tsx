import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarDays, Sparkles, TrendingUp, Users } from "lucide-react";
import {
  Bar as ChartBar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Shell } from "@/components/dash/Shell";
import { Bar, Kpi, Panel, Pill, chartColors } from "@/components/dash/bits";

export const Route = createFileRoute("/ld-training")({
  head: () => ({
    meta: [
      { title: "L&D Training — TalentBro Placement Dashboard" },
      {
        name: "description",
        content:
          "Learning & Development programs at Sardar Vallabhbhai Institute of Technology — training tracks, cohorts and schedule.",
      },
    ],
  }),
  component: LdTrainingPage,
});

const PROGRAMS = [
  { name: "Communication Development Program", track: "CDP", focus: "STAR storytelling · voice · fluency", audience: "CSE · IT", enrolled: 92, sessions: 12, weeks: "6 wks", status: "Live", progress: 68 },
  { name: "APLR Foundation Bootcamp", track: "APL", focus: "Quantitative · logical reasoning · puzzles", audience: "All branches", enrolled: 148, sessions: 16, weeks: "8 wks", status: "Live", progress: 52 },
  { name: "DSA & Coding Fundamentals", track: "DSA", focus: "Arrays · hash maps · recursion · DP", audience: "CSE · IT · AI·DS", enrolled: 74, sessions: 14, weeks: "10 wks", status: "Live", progress: 34 },
  { name: "GD & Interview Academy", track: "GDA", focus: "Group discussions · HR rounds · personal pitch", audience: "All branches", enrolled: 61, sessions: 10, weeks: "5 wks", status: "Upcoming", progress: 0 },
  { name: "English for Workplace", track: "EWP", focus: "Speaking · writing · email etiquette", audience: "All branches", enrolled: 118, sessions: 8, weeks: "4 wks", status: "Live", progress: 77 },
  { name: "Technical Interview Prep", track: "TIP", focus: "Java · OS · DBMS · OOP design", audience: "CSE · IT · AI·DS", enrolled: 38, sessions: 9, weeks: "6 wks", status: "Completed", progress: 100 },
] as const;

const SESSION_SUGGESTIONS = [
  { batch: "CDP-B2", program: "Communication Dev Program", focus: "Voice modulation · fluency drills · STAR practice", sessions: 4, priority: 92 },
  { batch: "APL-B3", program: "APLR Foundation Bootcamp", focus: "Speed arithmetic · time-boxed puzzle sets", sessions: 5, priority: 86 },
  { batch: "EWP-B1", program: "English for Workplace", focus: "Group presentation · email drafting", sessions: 3, priority: 80 },
  { batch: "GDA-B2", program: "GD & Interview Academy", focus: "Panel GD practice · situational HR rounds", sessions: 4, priority: 74 },
  { batch: "DSA-B2", program: "DSA & Coding Fundamentals", focus: "DP pattern drills · live coding", sessions: 3, priority: 62 },
] as const;

const SUGGESTION_COLORS = [
  chartColors.ink,
  chartColors.mid,
  chartColors.light,
  "oklch(0.87 0 0)",
  "oklch(0.91 0 0)",
];

function tones(status: string): "solid" | "outline" | "muted" {
  if (status === "Live" || status === "Completed") return "solid";
  if (status === "Scheduled") return "outline";
  return "muted";
}

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid oklch(0.9 0 0)",
  background: "oklch(1 0 0)",
  fontSize: 12,
  fontFamily: "inherit",
} as const;

const READINESS_CLASSIFICATIONS = [
  { area: "Communication", students: 46 },
  { area: "Aptitude", students: 58 },
  { area: "In-person consult", students: 24 },
  { area: "English", students: 39 },
  { area: "Overconfident", students: 17 },
];

const CLASSIFICATION_META = [
  {
    label: "Need Communication training",
    detail: "Voice, structure and STAR storytelling",
    value: READINESS_CLASSIFICATIONS[0].students,
  },
  {
    label: "Need Aptitude training",
    detail: "Quantitative and logical reasoning",
    value: READINESS_CLASSIFICATIONS[1].students,
  },
  {
    label: "In-person consultation needed",
    detail: "Open a counselling slot with the TPO",
    value: READINESS_CLASSIFICATIONS[2].students,
  },
  {
    label: "English training needed",
    detail: "Speaking, writing and email etiquette",
    value: READINESS_CLASSIFICATIONS[3].students,
  },
  {
    label: "Overconfident",
    detail: "Score gap between self-rating and evidence",
    value: READINESS_CLASSIFICATIONS[4].students,
  },
];

const maxClassification = Math.max(...READINESS_CLASSIFICATIONS.map((c) => c.students));

function LdTrainingPage() {
  const liveCount = PROGRAMS.filter((p) => p.status === "Live").length;
  const totalEnrolled = PROGRAMS.reduce((a, b) => a + b.enrolled, 0);

  return (
    <Shell
      title="L&D Training"
      subtitle="Learning & Development programs for readiness and placements — S.V.I.T., Pune"
      actions={
        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium">
          <CalendarDays className="size-3.5 text-muted-foreground" /> Term: AY 2026-27 · Sem I
        </span>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Active programs" value={liveCount} suffix="tracks" icon={BookOpen} hint={`${PROGRAMS.length} total`} />
        <Kpi label="Students enrolled" value={totalEnrolled} icon={Users} delta={8} hint="across all cohorts" />
        <Kpi label="Sessions this month" value={18} suffix="held" icon={CalendarDays} hint="on + hybrid + online" />
        <Kpi label="Avg. readiness uplift" value={11} suffix="%" icon={TrendingUp} delta={3} hint="after program completion" />
      </div>

      <Panel
        className="mt-4"
        title="Skill radar"
        description="Students on the readiness radar, classified by the training intervention they need"
      >
        <div className="grid items-center gap-4 lg:grid-cols-2">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={READINESS_CLASSIFICATIONS} outerRadius="68%">
              <PolarGrid stroke={chartColors.grid} />
              <PolarAngleAxis
                dataKey="area"
                tick={{ fontSize: 11, fill: "oklch(0.45 0 0)" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxClassification]}
                tick={{ fontSize: 10 }}
                stroke={chartColors.grid}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Radar
                dataKey="students"
                name="Students"
                stroke={chartColors.ink}
                fill={chartColors.ink}
                fillOpacity={0.16}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {CLASSIFICATION_META.map((c) => (
              <div key={c.label} className="rounded-md border border-border px-3.5 py-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{c.label}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{c.detail}</p>
                  </div>
                  <span className="stat-num text-sm">{c.value} students</span>
                </div>
                <div className="mt-2">
                  <Bar value={c.value} max={maxClassification} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel
        className="mt-4"
        title="Training programs"
        description="Cohort-based tracks run by the L&D team ahead of each recruitment cycle."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{p.track}</p>
                  <h3 className="mt-1 text-sm font-semibold">{p.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.focus}</p>
                </div>
                <Pill tone={tones(p.status)}>{p.status}</Pill>
              </div>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users className="size-3.5" /> {p.enrolled} enrolled</span>
                <span className="flex items-center gap-1.5"><Sparkles className="size-3.5" /> {p.sessions} sessions</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> {p.weeks}</span>
              </div>
              <div className="mt-3">
                <Bar value={p.progress} />
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{p.audience}</span>
                  <span className="font-mono">{p.progress}% complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        className="mt-4"
        title="Suggestions for next training sessions"
        description="Recommended sessions for each batch, from current readiness gaps"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={SESSION_SUGGESTIONS}
              layout="vertical"
              margin={{ top: 2, right: 26, bottom: 0, left: 0 }}
            >
              <CartesianGrid stroke={chartColors.grid} horizontal={false} />
              <XAxis type="number" dataKey="sessions" hide />
              <YAxis
                type="category"
                dataKey="batch"
                width={64}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: "oklch(0.4 0 0)" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "oklch(0 0 0 / 0.04)" }}
                formatter={(value) => [`${value} sessions`, "Suggested"]}
              />
              <ChartBar dataKey="sessions" radius={[0, 4, 4, 0]} barSize={20}>
                {SESSION_SUGGESTIONS.map((s, i) => (
                  <Cell key={s.batch} fill={SUGGESTION_COLORS[i]} />
                ))}
                <LabelList dataKey="sessions" position="right" fontSize={11} fill="oklch(0.35 0 0)" />
              </ChartBar>
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            {SESSION_SUGGESTIONS.map((s) => (
              <div key={s.batch} className="rounded-md border border-border px-3.5 py-2.5">
                <div className="flex items-center gap-3">
                  <Pill tone="outline">{s.batch}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{s.program}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{s.focus}</p>
                  </div>
                  <span className="stat-num text-sm">{s.sessions}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1">
                    <Bar value={s.priority} />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {s.priority}% priority
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
              <ArrowRight className="size-3.5" />
              Review the skill radar and batch scores before assigning trainers.
            </div>
          </div>
        </div>
      </Panel>
    </Shell>
  );
}