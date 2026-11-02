import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Shell } from "@/components/dash/Shell";
import { Typewriter } from "@/components/chat/rich-text";
import { cn } from "@/lib/utils";
import {
  getClientChatSession,
  sendClientChatMessage,
  type ClientChatMessage,
} from "@/lib/client-chats";

export const Route = createFileRoute("/client-chat")({
  validateSearch: (search: Record<string, unknown>): { session?: string } => {
    const session = typeof search["session"] === "string" ? search["session"] : undefined;
    return session ? { session } : {};
  },
  head: () => ({
    meta: [
      { title: "New Chat — TalentBro Placement Dashboard" },
      {
        name: "description",
        content:
          "Ask TalentBro about your placement data — student readiness, drives, companies and reporting.",
      },
      { property: "og:title", content: "New Chat — TalentBro" },
      { property: "og:description", content: "Ask TalentBro about your placement data." },
    ],
  }),
  component: ClientChatPage,
});

const NEW_CHAT_HEADING = "How can I help with your placements today?";
const NEW_CHAT_DESC =
  "Ask about your students, their readiness, mock interviews, self-training or your drives. I only see this institute's data, and I compute every number I quote.";

const SUGGESTIONS = [
  "Which students are eligible but not placed yet?",
  "How many drives are live and what are their deadlines?",
  "Summarise my department-wise placement rate",
  "Which recruiters are in the Super Dream tier?",
];

type Thread = {
  id: string;
  messages: ClientChatMessage[];
};

function ClientChatPage() {
  const { session } = Route.useSearch();
  const navigate = useNavigate();
  const [booted, setBooted] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const threadIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session) {
      setThread(null);
      threadIdRef.current = null;
      setError(null);
      setAnimating(false);
      setBooted(true);
      return;
    }
    if (threadIdRef.current === session) {
      setBooted(true);
      return;
    }
    const data = getClientChatSession(session);
    if (!data) {
      threadIdRef.current = null;
      setThread(null);
      setError("That chat could not be found.");
      setBooted(true);
      return;
    }
    threadIdRef.current = data.id;
    setThread({ id: data.id, messages: data.messages });
    setAnimating(false);
    setBooted(true);
  }, [session]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [thread]);

  function sendMessage(text: string) {
    const content = text.trim();
    if (!content || sending) return;
    const from = thread?.id ?? null;
    setSending(true);
    setError(null);
    setThread((prev) => ({
      id: prev?.id ?? "",
      messages: [...(prev?.messages ?? []), { role: "user", content }],
    }));
    setInput("");

    const res = sendClientChatMessage(content, from);
    threadIdRef.current = res.session_id;
    setThread((prev) => ({
      id: res.session_id,
      messages: [
        ...(prev?.messages ?? []),
        { role: "assistant", content: res.reply },
      ],
    }));
    setAnimating(true);
    if (res.session_id !== from) {
      void navigate({ to: "/client-chat", search: { session: res.session_id }, replace: true });
    }
    setSending(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  if (!booted) {
    return (
      <Shell title="Chat">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Chat" fullBleed>
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
          {!thread || thread.messages.length === 0 ? (
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
              <h2 className="text-lg font-semibold sm:text-xl">{NEW_CHAT_HEADING}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {NEW_CHAT_DESC}
              </p>
              <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={sending}
                    className="cursor-pointer rounded-lg border border-border bg-card px-4 py-3 text-left text-[13px] transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-4 py-6 sm:px-6">
              {thread.messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "flex w-full min-w-0 flex-col",
                      m.role === "user" ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "w-fit max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]",
                        m.role === "user"
                          ? "rounded-br-md bg-foreground text-background"
                          : "rounded-bl-md border border-border bg-card text-foreground",
                      )}
                    >
                      {m.role === "assistant" ? (
                        <Typewriter
                          text={m.content}
                          active={animating && i === thread.messages.length - 1}
                          onTick={() => {
                            const scroller = scrollerRef.current;
                            if (scroller) scroller.scrollTop = scroller.scrollHeight;
                          }}
                          onDone={() => setAnimating(false)}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mx-auto w-full max-w-3xl px-4 pt-3 pb-5 sm:px-6">
            {error && (
              <div className="mb-2 rounded-md border border-red-500/40 bg-red-500/5 px-4 py-3 text-xs text-red-500">
                {error}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 focus-within:ring-2 focus-within:ring-ring/25">
              <textarea
                ref={inputRef}
                value={input}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your placements…"
                aria-label="Message TalentBro"
                className="max-h-[180px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={sending || !input.trim()}
                aria-label="Send"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
