import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Mail, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/dash/Shell";
import { Kpi, Panel, Pill } from "@/components/dash/bits";
import { companies, type Company } from "@/lib/data";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — TalentBro Recruiter Network" },
      {
        name: "description",
        content:
          "Track recruiter relationships, hiring tiers, CTC bands, SPOC contacts and offer counts across every campus partner.",
      },
      { property: "og:title", content: "Companies — TalentBro" },
      {
        property: "og:description",
        content: "Recruiter network with tiers, CTC bands, SPOC contacts and offer history.",
      },
    ],
  }),
  component: CompaniesPage,
});

const TIERS = ["All", "Super Dream", "Dream", "Core", "Mass"];
const STATUS = ["All", "Active", "Onboarding", "Archived"];

function CompaniesPage() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selected, setSelected] = useState<Company | null>(null);

  const list = useMemo(
    () =>
      companies.filter(
        (c) =>
          `${c.name} ${c.sector} ${c.hq} ${c.openRoles.join(" ")}`.toLowerCase().includes(q.toLowerCase()) &&
          (tier === "All" || c.tier === tier) &&
          (status === "All" || c.status === status),
      ),
    [q, tier, status],
  );

  const offers = list.reduce((a, b) => a + b.offers2026, 0);
  const topCtc = list.reduce((a, b) => Math.max(a, b.ctcMax), 0);

  return (
    <Shell
      title="Companies"
      subtitle="Recruiter network and campus hiring partners"
      actions={
        <button
          onClick={() => toast.success("Recruiter onboarding invite sent")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-3.5" /> Add Recruiter
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Partners" value={list.length} hint="in selection" icon={Building2} />
        <Kpi label="Offers 2026" value={offers} delta={11} hint="rolled out" />
        <Kpi label="Highest CTC" value={topCtc} suffix="LPA" hint="ceiling offered" />
        <Kpi label="Super Dream" value={list.filter((c) => c.tier === "Super Dream").length} hint="₹12L+ bracket" />
      </div>

      <Panel className="mt-4" bodyClassName="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search recruiters, sectors, roles…"
              className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm">
            {TIERS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm">
            {STATUS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div className="flex rounded-md border border-border p-0.5">
            {(["grid", "table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {view === "grid" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="panel p-5 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-muted font-display text-xs font-bold">
                    {c.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{c.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {c.sector} · {c.hq}
                    </p>
                  </div>
                </div>
                <Pill tone={c.tier === "Super Dream" ? "solid" : "outline"}>{c.tier}</Pill>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-muted py-2">
                  <p className="stat-num text-sm">₹{c.ctcMax}L</p>
                  <p className="mono-label">Max CTC</p>
                </div>
                <div className="rounded-md bg-muted py-2">
                  <p className="stat-num text-sm">{c.offers2026}</p>
                  <p className="mono-label">Offers</p>
                </div>
                <div className="rounded-md bg-muted py-2">
                  <p className="stat-num text-sm">{c.since}</p>
                  <p className="mono-label">Since</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.openRoles.map((r) => (
                  <Pill key={r}>{r}</Pill>
                ))}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <Panel className="mt-4" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Company", "Tier", "Sector", "CTC Band", "Offers", "Status", ""].map((h) => (
                    <th key={h} className="mono-label px-5 py-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/60">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3"><Pill tone="outline">{c.tier}</Pill></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{c.sector}</td>
                    <td className="px-5 py-3 font-mono text-xs">₹{c.ctcMin}L – ₹{c.ctcMax}L</td>
                    <td className="px-5 py-3 font-mono">{c.offers2026}</td>
                    <td className="px-5 py-3"><Pill tone={c.status === "Active" ? "solid" : "muted"}>{c.status}</Pill></td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelected(c)}
                        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
          <div className="panel w-full max-w-xl">
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <p className="font-mono text-xs text-muted-foreground">
                  {selected.sector} · HQ {selected.hq} · partner since {selected.since}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-md p-1 hover:bg-accent">
                <X className="size-4" />
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
              {[
                ["Hiring tier", selected.tier],
                ["CTC band", `₹${selected.ctcMin}L – ₹${selected.ctcMax}L`],
                ["Offers 2026", String(selected.offers2026)],
                ["Status", selected.status],
                ["Campus SPOC", selected.spoc],
                ["SPOC email", selected.spocEmail],
                ["Eligibility", selected.eligibility],
                ["Open roles", selected.openRoles.join(", ")],
              ].map(([l, v]) => (
                <div key={l} className="rounded-md border border-border px-3.5 py-2.5">
                  <p className="mono-label">{l}</p>
                  <p className="mt-1 truncate text-sm font-medium">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <button
                onClick={() => toast.success(`Follow-up email drafted to ${selected.spoc}`)}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-xs font-medium hover:bg-accent"
              >
                <Mail className="size-3.5" /> Contact SPOC
              </button>
              <button
                onClick={() => {
                  toast.success(`Drive request raised with ${selected.name}`);
                  setSelected(null);
                }}
                className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                Invite for drive
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
