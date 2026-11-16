import Link from "next/link";
import { notFound } from "next/navigation";
import type { Review } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

const COLOR: Record<string, string> = {
  critical: "bg-red-500/20 text-red-300", high: "bg-orange-500/20 text-orange-300",
  medium: "bg-yellow-500/20 text-yellow-200", low: "bg-sky-500/20 text-sky-300", info: "bg-surface2 text-muted",
};
const ORDER = ["critical", "high", "medium", "low", "info"];

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: r } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();
  const result = r.result as Review;
  const findings = [...result.findings].sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity));
  const lines = (r.code as string).split("\n");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/reviews" className="text-sm text-accent">← All reviews</Link>
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{r.title}</h1><p className="text-sm text-muted">{r.language} · {lines.length} lines</p></div>
        <div className="card px-5 py-3 text-center"><p className="text-3xl font-bold">{r.score}</p><p className="text-xs text-muted">score / 100</p></div>
      </div>
      <p className="card p-4 text-sm">{result.summary}</p>
      {findings.length === 0 && <p className="text-sm text-accent2">No issues found.</p>}
      <ul className="space-y-3">
        {findings.map((f, i) => (
          <li key={i} className="card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${COLOR[f.severity]}`}>{f.severity}</span>
              <h3 className="font-semibold">{f.title}</h3>
              {f.line ? <span className="text-xs text-muted">line {f.line}</span> : null}
            </div>
            {f.line && lines[f.line - 1] !== undefined && (
              <pre className="mt-3 overflow-x-auto rounded-md bg-bg p-2 font-mono text-xs text-muted">{lines[f.line - 1]}</pre>
            )}
            <p className="mt-3 text-sm">{f.explanation}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-accent2">Fix: {f.suggestion}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">AI-generated review. Verify each finding before changing code.</p>
    </div>
  );
}
