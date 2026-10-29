import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/dash/Shell";
import { Bar, Kpi, Panel, Pill, chartColors } from "@/components/dash/bits";
import { deptStats, monthlyPlacements, overviewKpis, reports, yearlyTrend } from "@/lib/data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — TalentBro Placement Analytics" },
      {
        name: "description",
        content:
          "Generate annual, department, company and compliance placement reports with export-ready analytics.",
      },
      { property: "og:title", content: "Reports — TalentBro" },
      {
        property: "og:description",
        content: "Annual, department, company and compliance placement reports with export-ready analytics.",
      },
    ],
  }),
  component: ReportsPage,
});

const TYPES = ["All", "Annual", "Department", "Company", "Compliance", "AI"];

function ReportsPage() {
  const [type, setType] = useState("All");
  const k = overviewKpis();
  const depts = deptStats();

  const list = useMemo(
    () => (type === "All" ? reports : reports.filter((r) => r.type === type)),
    [type],
  );

  return (
    <Shell
      title="Reports"
      subtitle="Placement analytics, compliance disclosures and export-ready summaries"
      actions={
        <>
          <button
            onClick={() => toast.success("Report sent to printer queue")}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-xs font-medium hover:bg-accent"
          >
            <Printer className="size-3.5" /> Print
          </button>
          <button
            onClick={() => toast.success("New placement report generated")}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            <FileText className="size-3.5" /> Generate Report
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Students Covered" value={k.totalStudents} hint="batch of 2026" />
        <Kpi label="Offers Recorded" value={k.offers} delta={12} hint="all drives" />
        <Kpi label="Placement Rate" value={k.rate} suffix="%" delta={6} hint="AY 2025-26" />
        <Kpi label="Reports Filed" value={reports.length} hint="this academic year" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Offers vs Average CTC" description="Month-on-month placement performance">
          <ResponsiveContainer width="100%" height={252}>
            <LineChart data={monthlyPlacements} margin={{ left: -18, right: 6, top: 6 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip contentStyle={tooltip} />
              <Line type="monotone" dataKey="offers" stroke={chartColors.ink} strokeWidth={2} dot={{ r: 3 }} />
              <Line
                type="monotone"
                dataKey="avgCtc"
                stroke={chartColors.mid}
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Year-on-Year" description="Placement rate and average CTC">
          <div className="space-y-3">
            {yearlyTrend.map((y) => (
              <div key={y.year}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{y.year}</span>
                  <span className="font-mono text-muted-foreground">
                    {y.rate}% · ₹{y.avgCtc}L
                  </span>
                </div>
                <div className="mt-1.5">
                  <Bar value={y.rate} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4" title="Department Summary" description="Placement performance by branch" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Department", "Students", "Placed", "Rate", "Avg CTC", "Highest CTC"].map((h) => (
                  <th key={h} className="mono-label px-5 py-3 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {depts.map((d) => (
                <tr key={d.department} className="hover:bg-muted/60">
                  <td className="px-5 py-3 font-medium">{d.department}</td>
                  <td className="px-5 py-3 font-mono">{d.total}</td>
                  <td className="px-5 py-3 font-mono">{d.placed}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Bar value={d.rate} />
                      </div>
                      <span className="font-mono text-xs">{d.rate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono">₹{d.avgCtc}L</td>
                  <td className="px-5 py-3 font-mono">₹{d.highest}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <div key={r.id} className="panel flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <FileText className="size-5 text-muted-foreground" />
              <Pill tone="outline">{r.type}</Pill>
            </div>
            <p className="mt-3 text-sm font-semibold">{r.name}</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{r.period}</p>
            <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>{r.records.toLocaleString("en-IN")} records</span>
              <span>{r.size}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => toast.success(`${r.name} opened in viewer`)}
                className="flex-1 rounded-md border border-border py-2 text-xs font-medium hover:bg-accent"
              >
                Preview
              </button>
              <button
                onClick={() => toast.success(`${r.name} downloaded as PDF`)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                <Download className="size-3.5" /> Export
              </button>
            </div>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground">Generated {r.generated}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

const tooltip = {
  borderRadius: 8,
  border: "1px solid oklch(0.9 0 0)",
  background: "oklch(1 0 0)",
  fontSize: 12,
} as const;
