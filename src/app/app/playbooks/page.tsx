import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAccount } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Playbooks" };

const Schema = z.object({
  name: z.string().trim().min(1).max(80),
  instructions: z.string().trim().min(1).max(4000),
});

async function createPlaybook(formData: FormData) {
  "use server";
  const acc = await getAccount();
  if (!acc) return;
  const parsed = Schema.safeParse({ name: formData.get("name"), instructions: formData.get("instructions") });
  if (!parsed.success) return;
  const supabase = await createClient();
  const { count } = await supabase.from("playbooks").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= acc.plan.maxPlaybooks) return; // plan limit
  await supabase.from("playbooks").insert({ ...parsed.data, user_id: acc.userId });
  revalidatePath("/app/playbooks");
}

async function deletePlaybook(formData: FormData) {
  "use server";
  const supabase = await createClient();
  await supabase.from("playbooks").delete().eq("id", String(formData.get("id")));
  revalidatePath("/app/playbooks");
}

export default async function Playbooks() {
  const acc = (await getAccount())!;
  const supabase = await createClient();
  const { data: list } = await supabase.from("playbooks").select("*").order("created_at", { ascending: false });
  const atLimit = (list?.length ?? 0) >= acc.plan.maxPlaybooks;
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div><h1 className="text-2xl font-bold">Playbooks</h1>
        <p className="mt-1 text-sm text-muted">Reusable instructions you can attach to chats, reviews and tasks. {list?.length ?? 0} of {acc.plan.maxPlaybooks > 100 ? "unlimited" : acc.plan.maxPlaybooks} used.</p></div>
      {atLimit ? (
        <p className="card p-4 text-sm">You have reached your plan&apos;s playbook limit. Upgrade on the Billing page to add more.</p>
      ) : (
        <form action={createPlaybook} className="card space-y-4 p-5">
          <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" className="input" maxLength={80} required /></div>
          <div><label className="label" htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" rows={5} maxLength={4000} required className="input"
              placeholder="e.g. Prefer small pure functions. Flag any SQL built by string concatenation. Require tests for new branches." /></div>
          <button className="btn btn-primary">Save playbook</button>
        </form>
      )}
      <ul className="space-y-3">
        {list?.map((p) => (
          <li key={p.id} className="card p-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold">{p.name}</h2>
              <form action={deletePlaybook}><input type="hidden" name="id" value={p.id} /><button className="text-sm text-danger">Delete</button></form></div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{p.instructions}</p>
          </li>
        ))}
        {!list?.length && <li className="text-sm text-muted">No playbooks yet. Write one above to reuse your standards.</li>}
      </ul>
    </div>
  );
}
