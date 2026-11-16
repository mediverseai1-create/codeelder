import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { TaskResult } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

async function setStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["ready", "applied", "dismissed"].includes(status)) return;
  const supabase = await createClient();
  await supabase.from("tasks").update({ status }).eq("id", id); // RLS limits to own rows
  revalidatePath(`/app/tasks/${id}`);
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: t } = await supabase.from("tasks").select("*").eq("id", id).maybeSingle();
  if (!t) notFound();
  const r = t.result as TaskResult;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/tasks" className="text-sm text-accent">← All tasks</Link>
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{t.title}</h1><p className="mt-1 text-sm text-muted">{t.description}</p></div>
        <span className="card px-3 py-1 text-xs">{t.status}</span>
      </div>
      <section className="card p-5"><h2 className="font-semibold">Plan</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">{r.plan.map((s, i) => <li key={i}>{s}</li>)}</ol></section>
      <section className="card p-5"><h2 className="font-semibold">Proposed patch</h2>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-bg p-3 font-mono text-xs">{r.patch}</pre></section>
      {r.risks.length > 0 && (
        <section className="card p-5"><h2 className="font-semibold">Risks</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{r.risks.map((s, i) => <li key={i}>{s}</li>)}</ul></section>
      )}
      <form action={setStatus} className="flex gap-2">
        <input type="hidden" name="id" value={id} />
        <button name="status" value="applied" className="btn btn-primary">Mark as applied</button>
        <button name="status" value="dismissed" className="btn btn-ghost">Dismiss</button>
      </form>
      <p className="text-xs text-muted">AI-generated. Review the patch and run your tests before merging.</p>
    </div>
  );
}
