import type { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
  focusNodeId: string | null;
  onRetryMessage: (id: string) => void;
}

export function ChatPanel({ messages, focusNodeId, onRetryMessage }: Props) {
  return (
    <section className="neu-card p-4">
      <h2 className="mb-3 text-lg font-semibold">加密通讯</h2>
      <ul className="space-y-2">
        {messages.map((message) => {
          const focused = focusNodeId && message.linkedNodeId === focusNodeId;
          return (
            <li key={message.id} className={"rounded-xl p-3 " + (focused ? "bg-blue-100" : "bg-surface") }>
              <p className="text-sm">{message.content}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                <span>{message.encrypted ? "E2E 已加密" : "未加密"}</span>
                <span>{message.status}</span>
                {message.status === "failed" ? (
                  <button type="button" onClick={() => onRetryMessage(message.id)} className="rounded bg-accent-danger px-2 py-0.5 text-white">重试</button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
