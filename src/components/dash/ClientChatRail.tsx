import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deleteClientChatSession,
  getClientChatSessions,
  subscribeClientChatSessions,
  type ClientChatSession,
} from "@/lib/client-chats";

export function ClientChatRail() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ClientChatSession[]>([]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeSession = useRouterState({
    select: (s) => (s.location.search as { session?: string }).session,
  });

  useEffect(() => {
    setSessions(getClientChatSessions());
    return subscribeClientChatSessions(() => setSessions(getClientChatSessions()));
  }, []);

  const onChatPage = pathname.startsWith("/client-chat");

  function handleDelete(id: string) {
    deleteClientChatSession(id);
    setSessions(getClientChatSessions());
    if (onChatPage && activeSession === id) {
      void navigate({ to: "/client-chat", search: {}, replace: true });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-1 pt-3">
        <button
          type="button"
          onClick={() => void navigate({ to: "/client-chat", search: {} })}
          className={cn(
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-sidebar-border bg-transparent py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/60",
            onChatPage && !activeSession
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground",
          )}
        >
          <Plus className="size-4" /> New chat
        </button>
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto no-scrollbar">
        {sessions.length === 0 ? (
          <p className="px-1.5 text-xs text-sidebar-foreground/60">
            No previous chats yet — start one above.
          </p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-2 transition-colors",
                onChatPage && activeSession === s.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <button
                type="button"
                onClick={() => void navigate({ to: "/client-chat", search: { session: s.id } })}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-sm"
              >
                <MessageSquare className="size-3.5 shrink-0 opacity-70" />
                <span className="truncate text-[13px]">{s.title}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                aria-label={`Delete chat ${s.title}`}
                className="shrink-0 cursor-pointer rounded p-1 opacity-0 transition-opacity hover:bg-sidebar-accent group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
