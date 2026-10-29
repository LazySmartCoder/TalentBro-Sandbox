import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building, Clock, Mail, MapPin, Phone, Users, CalendarRange, FileCheck2 } from "lucide-react";
import {
  Bar as ChartBar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Shell } from "@/components/dash/Shell";
import { Kpi, Panel, Pill, chartColors } from "@/components/dash/bits";
import { getInstitutionOverview, type InstitutionOverview } from "@/lib/api";

export const Route = createFileRoute("/placement-cell")({
  head: () => ({
    meta: [
      { title: "Placement Cell — TalentBro Placement Dashboard" },
      {
        name: "description",
        content:
          "The Training & Placement Cell at Sardar Vallabhbhai Institute of Technology — team, office hours and responsibilities.",
      },
    ],
  }),
  component: PlacementCellPage,
});

const MOMENTUM_STAGES = [
  { stage: "Eligible", value: 168 },
  { stage: "Applied", value: 132 },
  { stage: "Shortlisted", value: 96 },
  { stage: "Placed", value: 92 },
];

const MOMENTUM_COLORS = [chartColors.ink, chartColors.mid, chartColors.light, "oklch(0.87 0 0)"];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid oklch(0.9 0 0)",
  background: "oklch(1 0 0)",
  fontSize: 12,
  fontFamily: "inherit",
} as const;

const TEAM = [
  { name: "Dr. Anjali Joshi", role: "Training & Placement Officer", email: "placement@svit.ac.in", phone: "+91 98220 12345", ext: "TPO" },
  { name: "Prof. Ramesh Kulkarni", role: "Head, L&D Training", email: "ramesh.kulkarni@svit.ac.in", phone: "+91 98220 22311", ext: "L&D" },
  { name: "Ms. Sneha Patil", role: "Placement Coordinator — CSE & IT", email: "sneha.patil@svit.ac.in", phone: "+91 98220 31240", ext: "PC-1" },
  { name: "Mr. Vivek Deshmukh", role: "Placement Coordinator — ENTC & AI·DS", email: "vivek.deshmukh@svit.ac.in", phone: "+91 98220 44152", ext: "PC-2" },
  { name: "Ms. Kavita Rao", role: "Placement Support & Documentation", email: "kavita.rao@svit.ac.in", phone: "+91 98220 56189", ext: "SUP" },
  { name: "Mr. Arjun Nair", role: "Industry Relations Manager", email: "arjun.nair@svit.ac.in", phone: "+91 98220 67430", ext: "IR" },
];

const OFFICE_HOURS = [
  { day: "Monday – Friday", time: "9:30 AM – 5:30 PM" },
  { day: "Saturday", time: "10:00 AM – 2:00 PM" },
];

const RESPONSIBILITIES = [
  "Drive scheduling & student shortlisting",
  "Company onboarding & campus visit management",
  "Mock interview & GD program coordination",
  "Offer letters, acceptance & joining tracking",
  "Readiness assessments & intervention plans",
  "Alumni & industry partnerships",
  "Placement reports & management reviews",
];

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
}

function PlacementCellPage() {
  const [overview, setOverview] = useState<InstitutionOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    getInstitutionOverview()
      .then((ov) => {
        if (!cancelled) setOverview(ov);
      })
      .catch(() => {
        /* demo page — data is optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const depts = (overview?.departments ?? []).map((d) => ({
    ...d,
    avgCtc: d.avg_expected_ctc,
  }));

  return (
    <Shell
      title="Placement Cell"
      subtitle="Training & Placement Cell, Sardar Vallabhbhai Institute of Technology, Pune"
      actions={
        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium">
          <Building className="size-3.5 text-muted-foreground" /> Admin Block · Floor 2
        </span>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Team members" value={TEAM.length} icon={Users} hint="campus-wide support" />
        <Kpi label="Drives handled" value={34} suffix="AY" icon={CalendarRange} delta={12} hint="2025-26 season" />
        <Kpi label="Avg. offer rate" value={61} suffix="%" icon={FileCheck2} delta={4} hint="vs last year" />
        <Kpi label="Student tickets" value={127} suffix="resolved" icon={Phone} hint="avg. 2-day turnaround" />
      </div>

      <Panel
        className="mt-4"
        title="Placement Momentum"
        description="Students at each stage of the placement pipeline · demo data"
      >
        <ResponsiveContainer width="100%" height={268}>
          <BarChart data={MOMENTUM_STAGES} margin={{ left: -18, right: 6, top: 6 }}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis dataKey="stage" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} domain={[0, 200]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0 0 0 / 0.04)" }} />
            <ChartBar dataKey="value" name="Students" radius={[4, 4, 0, 0]} barSize={44}>
              {MOMENTUM_STAGES.map((d, i) => (
                <Cell key={d.stage} fill={MOMENTUM_COLORS[i]} />
              ))}
              <LabelList dataKey="value" position="top" fontSize={11} fill="oklch(0.35 0 0)" />
            </ChartBar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel
        className="mt-4"
        title="Placement team"
        description="The people who run recruitment, readiness and training on campus."
        bodyClassName="p-0"
      >
        <ul className="divide-y divide-border">
          {TEAM.map((m) => (
            <li key={m.email} className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary font-display text-xs font-bold text-primary-foreground">
                {initials(m.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">{m.role}</p>
              </div>
              <div className="hidden flex-col items-end gap-0.5 md:flex">
                <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">
                  <Mail className="size-3" />
                  {m.email}
                </a>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <Phone className="size-3" /> {m.phone}
                </span>
              </div>
              <Pill tone="outline">{m.ext}</Pill>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Office hours & contact"
          description="Walk-in support for students during office hours."
        >
          <ul className="space-y-3">
            {OFFICE_HOURS.map((o) => (
              <li key={o.day} className="flex items-center justify-between gap-3 rounded-md border border-border px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" /> {o.day}
                </span>
                <span className="font-mono text-xs">{o.time}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 rounded-md border border-border bg-muted/30 px-3.5 py-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="size-3.5" /> Training & Placement Cell, Admin Block, 2nd Floor, Vadulgaon, Pune 413312</p>
            <p className="flex items-center gap-2"><Mail className="size-3.5" /> placement@svit.ac.in</p>
            <p className="flex items-center gap-2"><Phone className="size-3.5" /> +91 98220 12345</p>
          </div>
        </Panel>

        <Panel
          title="What the cell manages"
          description="Every activity that runs between training and a signed offer."
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {RESPONSIBILITIES.map((r) => (
              <li key={r} className="rounded-md border border-border px-3.5 py-2.5 text-[13px]">
                <span className="mr-2 text-foreground">✓</span>
                {r}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {depts.length > 0 && (
        <Panel
          className="mt-4"
          title="Department Analytics"
          description="Placement rate and average expected CTC by course"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={depts} margin={{ left: -18, right: 6, top: 6 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="short" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0 0 0 / 0.04)" }} />
              <ChartBar dataKey="rate" name="Placement %" radius={[4, 4, 0, 0]}>
                {depts.map((d, i) => (
                  <Cell key={d.department} fill={i % 2 ? chartColors.mid : chartColors.ink} />
                ))}
              </ChartBar>
              <ChartBar
                dataKey="avgCtc"
                name="Avg Exp CTC (LPA)"
                fill={chartColors.light}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {depts.map((d) => (
              <div
                key={d.department}
                className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{d.department}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {d.placed}/{d.total} placed · {d.eligible} eligible · ₹{d.avgCtc} LPA avg
                  </p>
                </div>
                <span className="stat-num text-sm">{d.rate}%</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </Shell>
  );
}