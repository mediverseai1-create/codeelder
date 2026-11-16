"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Msg { role: "user" | "assistant"; content: string }
interface Playbook { id: string; name: string }

export function Chat({ conversationId, initial, playbooks }: { conversationId?: string; initial: Msg[]; playbooks: Playbook[] }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [playbookId, setPlaybookId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    setBusy(true); setError(null);
    setMsgs((m) => [...m, { role: "user", content: message }]);
    setText("");
    const res = await fetch("/api/chat", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ conversationId, message, playbookId: playbookId || undefined }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res || !res.ok) {
      setMsgs((m) => m.slice(0, -1));
      setText(message);
      setError(data.error ?? "Network error. Please try again.");
      return;
    }
    setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    if (!conversationId) router.replace(`/app/assistant/${data.conversationId}`);
    else router.refresh();
  }

  return (
    <div className="card flex h-[70vh] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {msgs.length === 0 && <p className="text-sm text-muted">Ask about a bug, a design choice or a piece of code you do not understand.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-xl bg-accent/15 p-3" : "max-w-[92%] rounded-xl bg-surface2 p-3"}>
            <p className="whitespace-pre-wrap break-words text-sm">{m.content}</p>
          </div>
        ))}
        {busy && <p className="text-sm text-muted">Thinking…</p>}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="border-t border-line p-3">
        {error && <p role="alert" className="mb-2 text-sm text-danger">{error}</p>}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={8000}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e); }}
          placeholder="Message CodeElder (Ctrl+Enter to send)" className="input font-mono" aria-label="Message" />
        <div className="mt-2 flex items-center justify-between gap-2">
          <select value={playbookId} onChange={(e) => setPlaybookId(e.target.value)} className="input w-auto" aria-label="Playbook">
            <option value="">No playbook</option>
            {playbooks.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-primary" disabled={busy || !text.trim()}>Send · 1 credit</button>
        </div>
      </form>
    </div>
  );
}
