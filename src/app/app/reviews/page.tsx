import Link from "next/link";
import { RunForm } from "@/components/run-form";
import { CREDIT_COST } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Reviews" };

export default async function Reviews() {
  const supabase = await createClient();
  const [{ data: reviews }, { data: playbooks }] = await Promise.all([
    supabase.from("reviews").select("id,title,language,score,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("playbooks").select("id,name").order("name"),
  ]);
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div><h1 className="text-2xl font-bold">Code review</h1><p className="mt-1 text-sm text-muted">Paste code and get ranked findings with fixes.</p></div>
      <RunForm kind="review" playbooks={playbooks ?? []} cost={CREDIT_COST.review} />
      <section>
        <h2 className="mb-3 font-semibold">History</h2>
        {reviews?.length ? (
          <ul className="card divide-y divide-line">
            {reviews.map((r) => (
              <li key={r.id}><Link href={`/app/reviews/${r.id}`} className="flex justify-between gap-4 px-4 py-3 text-sm hover:bg-surface2">
                <span className="truncate">{r.title} <span className="text-muted">· {r.language}</span></span>
                <span className="shrink-0 text-muted">{r.score}/100 · {new Date(r.created_at).toLocaleDateString()}</span>
              </Link></li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">No reviews yet.</p>}
      </section>
    </div>
  );
}
