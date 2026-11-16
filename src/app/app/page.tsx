import Link from "next/link";
import { getAccount } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const acc = (await getAccount())!;
  const supabase = await createClient();
  const [{ data: reviews }, { data: convs }, { data: usage }] = await Promise.all([
    supabase.from("reviews").select("id,title,score,created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("conversations").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("usage_events").select("kind,credits").gte("created_at", acc.periodStart.toISOString()),
  ]);
  const byKind = { chat: 0, review: 0, task: 0 } as Record<string, number>;
  (usage ?? []).forEach((u) => (byKind[u.kind] += u.credits));
  const pct = Math.min(100, Math.round((acc.used / acc.plan.credits) * 100));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="card p-5 md:col-span-2">
          <div className="flex justify-between text-sm"><span className="text-muted">Credits this period</span><span>{acc.used} / {acc.plan.credits}</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">Chat {byKind.chat} · Reviews {byKind.review} · Tasks {byKind.task} · resets {acc.periodEnd.toLocaleDateString()}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Plan</p>
          <p className="mt-1 text-2xl font-bold">{acc.plan.name}</p>
          {acc.plan.id !== "max" && <Link href="/app/billing" className="mt-3 inline-block text-sm text-accent">Upgrade →</Link>}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card p-5">
          <div className="flex justify-between"><h2 className="font-semibold">Recent reviews</h2><Link href="/app/reviews" className="text-sm text-accent">New review</Link></div>
          {reviews?.length ? (
            <ul className="mt-3 divide-y divide-line text-sm">
              {reviews.map((r) => (
                <li key={r.id}><Link href={`/app/reviews/${r.id}`} className="flex justify-between py-2 hover:text-accent"><span className="truncate">{r.title}</span><span className="text-muted">{r.score}/100</span></Link></li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted">No reviews yet. Paste some code to get your first one.</p>}
        </section>
        <section className="card p-5">
          <div className="flex justify-between"><h2 className="font-semibold">Recent conversations</h2><Link href="/app/assistant" className="text-sm text-accent">New chat</Link></div>
          {convs?.length ? (
            <ul className="mt-3 divide-y divide-line text-sm">
              {convs.map((c) => (
                <li key={c.id}><Link href={`/app/assistant/${c.id}`} className="block truncate py-2 hover:text-accent">{c.title}</Link></li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted">Nothing here yet. Ask the assistant anything about your code.</p>}
        </section>
      </div>
    </div>
  );
}
