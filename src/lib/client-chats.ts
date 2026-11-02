export type ClientChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClientChatSession = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  messages: ClientChatMessage[];
};

const STORAGE_KEY = "sandbox.clientChats.v1";
const CHANGE_EVENT = "sandbox:client-chats";

function daysAgo(days: number, hour = 10): string {
  const t = new Date();
  t.setDate(t.getDate() - days);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
}

function seededClientChats(): ClientChatSession[] {
  return [
    {
      id: "client-chat-1",
      title: "Eligible but unplaced students",
      created_at: daysAgo(1, 9),
      updated_at: daysAgo(1, 9),
      message_count: 4,
      messages: [
        {
          role: "user",
          content: "Which students are eligible but not placed yet?",
        },
        {
          role: "assistant",
          content:
            "Across the 2026 batch, 168 students are on the roll and 112 are placed. Of the remaining 56, 41 are eligible but unplaced and 15 still need eligibility checks. The largest eligible-unplaced clusters are CSE (14) and IT (11). Want me to list them by readiness score?",
        },
        {
          role: "user",
          content: "Yes, show the top 5 who need attention first.",
        },
        {
          role: "assistant",
          content:
            "Top 5 by intervention priority: Rohan Mehta (CSE, readiness 41), Sneha Kulkarni (IT, 44), Aditya Rao (CSE, 47), Fatima Shaikh (ECE, 49) and Karan Patel (MECH, 52). All five have completed fewer than two mock interviews, so booking a panel session is the fastest lift.",
        },
      ],
    },
    {
      id: "client-chat-2",
      title: "Live drives and deadlines",
      created_at: daysAgo(2, 14),
      updated_at: daysAgo(2, 14),
      message_count: 4,
      messages: [
        {
          role: "user",
          content: "How many drives are live and what are their deadlines?",
        },
        {
          role: "assistant",
          content:
            "Four drives are live right now: Infosys (closes in 3 days), Persistent Systems (5 days), TCS Digital (8 days) and Deloitte (11 days). Infosys has the highest pending-application count at 43, so it needs a reminder push today.",
        },
        {
          role: "user",
          content: "Which one has the best eligibility match?",
        },
        {
          role: "assistant",
          content:
            "Persistent Systems has the best match: 96 of your 168 students meet its CGPA and branch criteria. TCS Digital is second at 88, Infosys at 81 and Deloitte at 54. I can export the matched roster per drive from the Drives page.",
        },
      ],
    },
    {
      id: "client-chat-3",
      title: "Department-wise placement rate",
      created_at: daysAgo(3, 11),
      updated_at: daysAgo(3, 11),
      message_count: 4,
      messages: [
        {
          role: "user",
          content: "Summarise my department-wise placement rate",
        },
        {
          role: "assistant",
          content:
            "Placement rate by department: CSE 78% (42 of 54), IT 74% (28 of 38), ECE 66% (21 of 32), MECH 58% (14 of 24) and CIVIL 50% (7 of 14). The institute average is 67%.",
        },
        {
          role: "user",
          content: "Where is the biggest gap from last year?",
        },
        {
          role: "assistant",
          content:
            "ECE is down 9 points from last year's 75%, the largest drop. MECH is up 4 points, so the gap is concentrated in ECE. Two ECE drives closed without a single offer, which explains most of the decline.",
        },
      ],
    },
    {
      id: "client-chat-4",
      title: "Super Dream recruiters",
      created_at: daysAgo(4, 16),
      updated_at: daysAgo(4, 16),
      message_count: 4,
      messages: [
        {
          role: "user",
          content: "Which recruiters are in the Super Dream tier?",
        },
        {
          role: "assistant",
          content:
            "Three recruiters sit in the Super Dream tier this season: Deloitte, Google and Microsoft. Together they have 18 eligible students and 6 offers so far.",
        },
        {
          role: "user",
          content: "How many students are ready for that tier?",
        },
        {
          role: "assistant",
          content:
            "Only 9 students currently clear both the Super Dream CGPA bar and a readiness score above 80. CSE contributes 5, IT 3 and ECE 1. Pushing the next 7 borderline students through two mock interviews each would roughly double the pool.",
        },
      ],
    },
  ];
}

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read(): ClientChatSession[] {
  if (!canStore()) return seededClientChats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seededClientChats();
    const parsed = JSON.parse(raw) as ClientChatSession[];
    if (!Array.isArray(parsed)) return seededClientChats();
    return parsed;
  } catch {
    return seededClientChats();
  }
}

function sortRecent(list: ClientChatSession[]): ClientChatSession[] {
  return [...list].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

function write(list: ClientChatSession[]): void {
  if (!canStore()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortRecent(list)));
  } catch {
    // storage unavailable — keep in memory for this render
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

function uid(): string {
  return `client-chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function summarizeTitle(message: string): string {
  const words = message
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");
  const title = words ? words.charAt(0).toUpperCase() + words.slice(1) : "New chat";
  return title.length > 48 ? `${title.slice(0, 48)}…` : title;
}

function demoReply(message: string, title: string): string {
  const m = message.toLowerCase();
  if (/(eligible|unplaced|not placed)/.test(m))
    return "Of your 168 students, 41 are eligible but unplaced. The biggest clusters are CSE (14) and IT (11). Sorting by readiness, the lowest five all have fewer than two mock interviews — booking panels for them is the fastest improvement.";
  if (/(drive|deadline)/.test(m))
    return "Four drives are live: Infosys (3 days left), Persistent (5), TCS Digital (8) and Deloitte (11). Persistent has the best eligibility match at 96 of 168 students; Infosys has the most pending applications at 43.";
  if (/(department|branch|placement rate)/.test(m))
    return "Placement rate by department: CSE 78%, IT 74%, ECE 66%, MECH 58%, CIVIL 50%. The institute average is 67%. ECE has the largest year-on-year drop at 9 points.";
  if (/(recruiter|super dream|company|companies)/.test(m))
    return "Super Dream recruiters this season are Deloitte, Google and Microsoft. Six offers are out, with 18 eligible students. Only 9 students currently clear both the CGPA bar and a readiness score above 80.";
  if (/(mock|interview)/.test(m))
    return "Mock interview participation is 61% of the batch. Students who completed two or more panels are placed at nearly twice the rate of those with none. The placement cell should prioritise the 34 students who have not booked a single slot.";
  if (/(cgpa|eligib)/.test(m))
    return "Eligibility is calculated from CGPA, branch and backlog status per drive. 112 students clear at least one live drive, while 15 are blocked by a backlog flag that needs review.";
  return `Noted — I've grouped "${title}" with your placement questions. Ask me about eligible students, drives, department rates or recruiters and I'll answer from this institute's demo data.`;
}

export function getClientChatSessions(): ClientChatSession[] {
  return sortRecent(read());
}

export function getClientChatSession(id: string): ClientChatSession | null {
  return read().find((s) => s.id === id) ?? null;
}

export function deleteClientChatSession(id: string): void {
  const next = read().filter((s) => s.id !== id);
  write(next);
}

export function sendClientChatMessage(
  message: string,
  sessionId?: string | null,
): { session_id: string; reply: string; title: string } {
  const content = message.trim();
  const list = read();
  const existing = sessionId ? list.find((s) => s.id === sessionId) : null;
  const now = new Date().toISOString();
  const title = existing?.title ?? summarizeTitle(content);
  const reply = demoReply(content, title);

  if (existing) {
    existing.messages = [
      ...existing.messages,
      { role: "user", content },
      { role: "assistant", content: reply },
    ];
    existing.message_count = existing.messages.length;
    existing.updated_at = now;
  } else {
    const session: ClientChatSession = {
      id: uid(),
      title,
      created_at: now,
      updated_at: now,
      message_count: 2,
      messages: [
        { role: "user", content },
        { role: "assistant", content: reply },
      ],
    };
    list.push(session);
    write(list);
    return { session_id: session.id, reply, title };
  }

  write(list);
  return { session_id: existing.id, reply, title };
}

export function subscribeClientChatSessions(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
