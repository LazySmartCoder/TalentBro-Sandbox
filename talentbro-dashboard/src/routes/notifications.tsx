import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BellOff, CheckCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/dash/Shell";
import { Kpi, Panel, Pill } from "@/components/dash/bits";
import { notifications as seed, schedules } from "@/lib/data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — TalentBro Alerts" },
      {
        name: "description",
        content:
          "Drive updates, recruiter changes, student alerts and AI evaluation notices in one prioritised feed.",
      },
      { property: "og:title", content: "Notifications — TalentBro" },
      {
        property: "og:description",
        content: "Prioritised feed of drive, recruiter, student and AI alerts for the placement cell.",
      },
    ],
  }),
  component: NotificationsPage,
});

const CATEGORIES = ["All", "Drive", "Student", "Company", "AI", "System"];

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const list = useMemo(
    () =>
      items.filter(
        (n) =>
          `${n.title} ${n.body}`.toLowerCase().includes(q.toLowerCase()) &&
          (cat === "All" || n.category === cat) &&
          (!unreadOnly || !n.read),
      ),
    [items, cat, q, unreadOnly],
  );

  const unread = items.filter((n) => !n.read).length;

  return (
    <Shell
      title="Notifications"
      subtitle={`${unread} unread alerts across drives, recruiters and students`}
      actions={
        <button
          onClick={() => {
            setItems((p) => p.map((n) => ({ ...n, read: true })));
            toast.success("All notifications marked as read");
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <CheckCheck className="size-3.5" /> Mark all read
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Unread" value={unread} hint="requires attention" />
        <Kpi label="High Priority" value={items.filter((n) => n.priority === "High").length} hint="escalations" />
        <Kpi label="Drive Alerts" value={items.filter((n) => n.category === "Drive").length} hint="pipeline updates" />
        <Kpi label="Upcoming Events" value={schedules.length} hint="next 10 days" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel bodyClassName="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search notifications…"
                  className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="accent-foreground"
                />
                Unread only
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                    cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="mt-4" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {list.map((n) => (
                <li key={n.id} className={`px-5 py-4 transition-colors ${n.read ? "" : "bg-muted/50"}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    {!n.read && <span className="size-1.5 rounded-full bg-primary" />}
                    <p className="text-sm font-semibold">{n.title}</p>
                    <Pill tone={n.priority === "High" ? "solid" : "muted"}>{n.category}</Pill>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{n.body}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() =>
                        setItems((p) => p.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)))
                      }
                      className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium hover:bg-accent"
                    >
                      Mark as {n.read ? "unread" : "read"}
                    </button>
                    <button
                      onClick={() => {
                        setItems((p) => p.filter((x) => x.id !== n.id));
                        toast.success("Notification dismissed");
                      }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium hover:bg-accent"
                    >
                      Dismiss
                    </button>
                  </div>
                </li>
              ))}
              {list.length === 0 && (
                <li className="flex flex-col items-center gap-2 px-5 py-16 text-center">
                  <BellOff className="size-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">You are all caught up.</p>
                </li>
              )}
            </ul>
          </Panel>
        </div>

        <Panel title="Event Reminders" description="Auto-generated from the drive calendar" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {schedules.map((s) => (
              <li key={s.id} className="flex gap-3 px-5 py-3.5">
                <div className="w-12 shrink-0 rounded-md border border-border py-1 text-center">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{s.date.split(" ")[0]}</p>
                  <p className="stat-num text-sm">{s.date.split(" ")[1]}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{s.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {s.time} · {s.company}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}
