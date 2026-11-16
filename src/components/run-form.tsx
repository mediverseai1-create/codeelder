"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Playbook { id: string; name: string }

export function RunForm({ kind, playbooks, cost }: { kind: "review" | "task"; playbooks: Playbook[]; cost: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body: Record<string, string | undefined> = {
      title: String(f.get("title") ?? ""),
      code: String(f.get("code") ?? ""),
      playbookId: String(f.get("playbookId") ?? "") || undefined,
    };
    if (kind === "review") body.language = String(f.get("language") ?? "auto") || "auto";
    else body.description = String(f.get("description") ?? "");
    setBusy(true); setError(null);
    const res = await fetch(`/api/${kind}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res || !res.ok) return setError(data.error ?? "Network error. Please try again.");
    router.push(`/app/${kind}s/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="title">Title</label><input id="title" name="title" className="input" maxLength={120} required /></div>
        {kind === "review" ? (
          <div><label className="label" htmlFor="language">Language</label><input id="language" name="language" className="input" placeholder="auto" maxLength={30} /></div>
        ) : (
          <div><label className="label" htmlFor="playbookId">Playbook</label>
            <select id="playbookId" name="playbookId" className="input"><option value="">None</option>{playbooks.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        )}
      </div>
      {kind === "task" && (
        <div><label className="label" htmlFor="description">What should change?</label><textarea id="description" name="description" rows={3} className="input" maxLength={4000} required /></div>
      )}
      <div><label className="label" htmlFor="code">{kind === "review" ? "Code" : "Relevant code (optional)"}</label>
        <textarea id="code" name="code" rows={12} className="input font-mono" maxLength={40000} required={kind === "review"} spellCheck={false} /></div>
      {kind === "review" && (
        <div><label className="label" htmlFor="playbookId">Playbook</label>
          <select id="playbookId" name="playbookId" className="input"><option value="">None</option>{playbooks.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      )}
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? "Working… this can take up to a minute" : `Run · ${cost} credits`}</button>
    </form>
  );
}
