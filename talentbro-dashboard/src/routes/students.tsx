import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/dash/Shell";
import { Bar, Kpi, Panel, Pill } from "@/components/dash/bits";
import { DEPARTMENTS, students, type Student, type StudentStatus } from "@/lib/data";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — TalentBro Placement Dashboard" },
      {
        name: "description",
        content:
          "Search, filter and review final-year student profiles with CGPA, offers, packages and AI readiness scores.",
      },
      { property: "og:title", content: "Students — TalentBro" },
      {
        property: "og:description",
        content: "Searchable student directory with CGPA, offers, packages and AI readiness scores.",
      },
    ],
  }),
  component: StudentsPage,
});

const STATUSES: (StudentStatus | "All")[] = ["All", "Placed", "In Process", "Unplaced", "Higher Studies"];

function StudentsPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [minCgpa, setMinCgpa] = useState(0);
  const [sort, setSort] = useState<"name" | "cgpa" | "package" | "aiScore">("cgpa");
  const [selected, setSelected] = useState<Student | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const list = students.filter((s) => {
      const hay = `${s.name} ${s.roll} ${s.department} ${s.company ?? ""} ${s.skills.join(" ")}`.toLowerCase();
      return (
        hay.includes(q.toLowerCase()) &&
        (dept === "All" || s.department === dept) &&
        (status === "All" || s.status === status) &&
        s.cgpa >= minCgpa
      );
    });
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "package") return (b.package ?? 0) - (a.package ?? 0);
      if (sort === "aiScore") return b.aiScore - a.aiScore;
      return b.cgpa - a.cgpa;
    });
  }, [q, dept, status, minCgpa, sort]);

  const pageSize = 12;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize);

  const placed = filtered.filter((s) => s.status === "Placed");
  const avg = placed.length ? placed.reduce((a, b) => a + (b.package ?? 0), 0) / placed.length : 0;

  return (
    <Shell
      title="Students"
      subtitle={`${filtered.length} of ${students.length} final-year students match the current filters`}
      actions={
        <button
          onClick={() => toast.success(`Exported ${filtered.length} student records to CSV`)}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-xs font-medium transition-colors hover:bg-accent"
        >
          <Download className="size-3.5" /> Export
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="In Selection" value={filtered.length} hint="matching filters" />
        <Kpi label="Placed" value={placed.length} hint={`${Math.round((placed.length / Math.max(1, filtered.length)) * 100)}% of selection`} />
        <Kpi label="Average CTC" value={avg.toFixed(1)} suffix="LPA" hint="placed students" />
        <Kpi
          label="Avg AI Score"
          value={Math.round(filtered.reduce((a, b) => a + b.aiScore, 0) / Math.max(1, filtered.length))}
          hint="interview readiness"
        />
      </div>

      <Panel className="mt-4" bodyClassName="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search by name, roll no, company or skill…"
              className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none"
          >
            <option>All</option>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label className="flex h-9 items-center gap-2 rounded-md border border-input bg-card px-3 text-xs">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            CGPA ≥ <span className="font-mono font-semibold">{minCgpa.toFixed(1)}</span>
            <input
              type="range"
              min={0}
              max={9.5}
              step={0.5}
              value={minCgpa}
              onChange={(e) => setMinCgpa(Number(e.target.value))}
              className="w-24 accent-foreground"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-9 rounded-md border border-input bg-card px-3 text-sm outline-none"
          >
            <option value="cgpa">Sort: CGPA</option>
            <option value="name">Sort: Name</option>
            <option value="package">Sort: Package</option>
            <option value="aiScore">Sort: AI Score</option>
          </select>
        </div>
      </Panel>

      <Panel className="mt-4" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Student", "Department", "CGPA", "Status", "Offer", "AI Score", ""].map((h) => (
                  <th key={h} className="mono-label px-5 py-3 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-5 py-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{s.roll}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{s.department}</td>
                  <td className="px-5 py-3 font-mono tabular-nums">{s.cgpa.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <Pill tone={s.status === "Placed" ? "solid" : s.status === "Unplaced" ? "muted" : "outline"}>
                      {s.status}
                    </Pill>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {s.company ? (
                      <>
                        <span className="font-medium">₹{s.package}L</span>
                        <span className="block text-muted-foreground">{s.company}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16">
                        <Bar value={s.aiScore} />
                      </div>
                      <span className="font-mono text-xs">{s.aiScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelected(s)}
                      className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No students match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs">
          <span className="text-muted-foreground">
            Page {current + 1} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
              className="rounded-md border border-border px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={current >= pages - 1}
              onClick={() => setPage(current + 1)}
              className="rounded-md border border-border px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Panel>

      {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
    </Shell>
  );
}

function StudentModal({ student, onClose }: { student: Student; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <div className="panel max-h-[88vh] w-full max-w-2xl overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
              {student.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-lg font-bold">{student.name}</h2>
              <p className="font-mono text-xs text-muted-foreground">
                {student.roll} · {student.department}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-accent">
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          {[
            ["CGPA", student.cgpa.toFixed(2)],
            ["Active backlogs", String(student.backlogs)],
            ["Status", student.status],
            ["Offers", String(student.offers)],
            ["Package", student.package ? `₹${student.package} LPA` : "—"],
            ["Recruiter", student.company ?? "—"],
            ["Email", student.email],
            ["Phone", student.phone],
            ["Hometown", student.city],
            ["AI readiness", `${student.aiScore}/100`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border px-3.5 py-2.5">
              <p className="mono-label">{label}</p>
              <p className="mt-1 truncate text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5">
          <p className="mono-label">Skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {student.skills.map((s) => (
              <Pill key={s} tone="outline">
                {s}
              </Pill>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border px-6 py-4">
          <button
            onClick={() => toast.success(`Resume of ${student.name} shared with recruiters`)}
            className="rounded-md border border-border px-3.5 py-2 text-xs font-medium hover:bg-accent"
          >
            Share resume
          </button>
          <button
            onClick={() => toast.success(`${student.name} shortlisted for the next drive`)}
            className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Shortlist for drive
          </button>
        </div>
      </div>
    </div>
  );
}
