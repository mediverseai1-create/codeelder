import Link from "next/link";
import { RunForm } from "@/components/run-form";
import { getAccount } from "@/lib/account";
import { CREDIT_COST } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Tasks" };

export default async function Tasks() {
  const acc = (await getAccount())!;
  if (!acc.plan.tasks) {
    return (
      <div className="mx-auto max-w-xl card p-8 text-center">
        <h1 className="text-xl font-bold">Task planner</h1>
        <p className="mt-2 text-sm text-muted">Plans and patches for a described change are available on Pro and Max.</p>
        <Link href="/app/billing" className="btn btn-primary mt-5">See plans</Link>
      </div>
    );
  }
  const supabase = await createClient();
  const [{ data: tasks }, { data: playbooks }] = await Promise.all([
    supabase.from("tasks").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("playbooks").select("id,name").order("name"),
  ]);
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div><h1 className="text-2xl font-bold">Task planner</h1><p className="mt-1 text-sm text-muted">Describe a change and get a plan, a patch and the risks.</p></div>
      <RunForm kind="task" playbooks={playbooks ?? []} cost={CREDIT_COST.task} />
      <section>
        <h2 className="mb-3 font-semibold">History</h2>
        {tasks?.length ? (
          <ul className="card divide-y divide-line">
            {tasks.map((t) => (
              <li key={t.id}><Link href={`/app/tasks/${t.id}`} className="flex justify-between px-4 py-3 text-sm hover:bg-surface2"><span className="truncate">{t.title}</span><span className="text-muted">{t.status}</span></Link></li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">No tasks yet.</p>}
      </section>
    </div>
  );
}
