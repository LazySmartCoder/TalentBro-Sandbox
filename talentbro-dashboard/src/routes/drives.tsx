import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarPlus, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/dash/Shell";
import { Bar, Kpi, Panel, Pill } from "@/components/dash/bits";
import {
  COMPANY_NAMES,
  DEPARTMENTS,
  DRIVE_STAGES,
  drives as seedDrives,
  schedules,
  students,
  type Drive,
} from "@/lib/data";

export const Route = createFileRoute("/drives")({
  head: () => ({
    meta: [
      { title: "Placement Drives — TalentBro" },
      {
        name: "description",
        content:
          "Create campus drives, track candidate pipelines stage by stage and manage interview schedules from one board.",
      },
      { property: "og:title", content: "Placement Drives — TalentBro" },
      {
        property: "og:description",
        content: "Create drives, track stage-wise candidate pipelines and manage schedules.",
      },
    ],
  }),
  component: DrivesPage,
});

const FILTERS = ["All", "Live", "Upcoming", "Completed"] as const;

function DrivesPage() {
  const [list, setList] = useState<Drive[]>(seedDrives);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [creating, setCreating] = useState(false);
  const [active, setActive] = useState<Drive | null>(seedDrives[0] ?? null);

  const shown = useMemo(
    () => (filter === "All" ? list : list.filter((d) => d.status === filter)),
    [list, filter],
  );

  const pipeline = useMemo(() => {
    if (!active) return [];
    return students
      .filter((s) => active.departments.includes(s.department) && s.cgpa >= active.minCgpa)
      .slice(0, 8)
      .map((s, i) => ({
        student: s,
        stage: DRIVE_STAGES[Math.min(DRIVE_STAGES.length - 1, i % 5)] ?? "Registration",
      }));
  }, [active]);

  return (
    <Shell
      title="Placement Drives"
      subtitle="Plan, run and audit every campus hiring drive"
      actions={
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <CalendarPlus className="size-3.5" /> Create Drive
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Drives" value={list.length} hint="this academic year" />
        <Kpi label="Live Now" value={list.filter((d) => d.status === "Live").length} hint="in progress" />
        <Kpi label="Registrations" value={list.reduce((a, b) => a + b.registered, 0)} delta={18} />
        <Kpi label="Offers Rolled" value={list.reduce((a, b) => a + b.offers, 0)} delta={9} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground" />
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {shown.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d)}
              className={`panel block w-full p-5 text-left transition-shadow hover:shadow-md ${
                active?.id === d.id ? "ring-2 ring-ring/30" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {d.company} — {d.role}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {d.date} · {d.mode} · {d.venue} · ₹{d.ctc}L · CGPA ≥ {d.minCgpa}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Pill tone={d.status === "Live" ? "solid" : "outline"}>{d.status}</Pill>
                  <Pill>{d.stage}</Pill>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Registered", d.registered],
                  ["Shortlisted", d.shortlisted],
                  ["Interviewed", d.interviewed],
                  ["Offers", d.offers],
                ].map(([l, v]) => (
                  <div key={l as string}>
                    <p className="mono-label">{l}</p>
                    <p className="stat-num text-lg">{v}</p>
                    <div className="mt-1.5">
                      <Bar value={Number(v)} max={d.registered || 1} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {d.departments.map((dep) => (
                  <Pill key={dep}>{dep}</Pill>
                ))}
              </div>
            </button>
          ))}
          {shown.length === 0 && (
            <Panel>
              <p className="py-8 text-center text-sm text-muted-foreground">No drives in this state.</p>
            </Panel>
          )}
        </div>

        <div className="space-y-4">
          <Panel
            title="Candidate Pipeline"
            description={active ? `${active.company} · ${active.role}` : "Select a drive"}
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {pipeline.map(({ student, stage }) => (
                <li key={student.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted font-display text-[10px] font-bold">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{student.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {student.roll} · CGPA {student.cgpa}
                    </p>
                  </div>
                  <Pill tone={stage === "Offer Rollout" ? "solid" : "outline"}>{stage}</Pill>
                </li>
              ))}
            </ul>
            {active && (
              <div className="border-t border-border p-4">
                <button
                  onClick={() => {
                    const idx = DRIVE_STAGES.indexOf(active.stage);
                    const next = DRIVE_STAGES[Math.min(DRIVE_STAGES.length - 1, idx + 1)]!;
                    setList((prev) =>
                      prev.map((d) => (d.id === active.id ? { ...d, stage: next } : d)),
                    );
                    setActive({ ...active, stage: next });
                    toast.success(`${active.company} moved to ${next}`);
                  }}
                  className="w-full rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  Advance to next stage
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Interview Schedule" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {schedules.map((s) => (
                <li key={s.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium">{s.title}</p>
                    <Pill>{s.type}</Pill>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {s.date} · {s.time} · {s.company}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {creating && (
        <CreateDrive
          onClose={() => setCreating(false)}
          onCreate={(d) => {
            setList((prev) => [d, ...prev]);
            setActive(d);
            setCreating(false);
            toast.success(`${d.company} drive scheduled for ${d.date}`);
          }}
        />
      )}
    </Shell>
  );
}

function CreateDrive({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (d: Drive) => void;
}) {
  const [company, setCompany] = useState(COMPANY_NAMES[0]!);
  const [role, setRole] = useState("SDE-1");
  const [ctc, setCtc] = useState(9);
  const [date, setDate] = useState("2026-09-30");
  const [mode, setMode] = useState<Drive["mode"]>("On-campus");
  const [venue, setVenue] = useState("Seminar Hall A");
  const [minCgpa, setMinCgpa] = useState(6.5);
  const [depts, setDepts] = useState<string[]>(["Computer Engineering"]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({
            id: `drv-${Date.now()}`,
            company,
            role,
            ctc,
            date,
            mode,
            venue,
            stage: "Registration",
            status: "Upcoming",
            registered: 0,
            shortlisted: 0,
            interviewed: 0,
            offers: 0,
            departments: depts as Drive["departments"],
            minCgpa,
          });
        }}
        className="panel max-h-[88vh] w-full max-w-xl overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">Create Placement Drive</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-accent">
            <X className="size-4" />
          </button>
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          <Field label="Company">
            <select value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls}>
              {COMPANY_NAMES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Role">
            <input value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} required />
          </Field>
          <Field label="CTC (LPA)">
            <input
              type="number"
              step="0.1"
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Drive date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Mode">
            <select value={mode} onChange={(e) => setMode(e.target.value as Drive["mode"])} className={inputCls}>
              <option>On-campus</option>
              <option>Virtual</option>
              <option>Pool Campus</option>
            </select>
          </Field>
          <Field label="Venue">
            <input value={venue} onChange={(e) => setVenue(e.target.value)} className={inputCls} />
          </Field>
          <Field label={`Minimum CGPA — ${minCgpa.toFixed(1)}`}>
            <input
              type="range"
              min={5}
              max={9}
              step={0.5}
              value={minCgpa}
              onChange={(e) => setMinCgpa(Number(e.target.value))}
              className="w-full accent-foreground"
            />
          </Field>
          <div className="sm:col-span-2">
            <p className="mono-label mb-2">Eligible departments</p>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((d) => {
                const on = depts.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDepts((p) => (on ? p.filter((x) => x !== d) : [...p, d]))}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-3.5 py-2 text-xs font-medium hover:bg-accent">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
            Schedule drive
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono-label">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}
