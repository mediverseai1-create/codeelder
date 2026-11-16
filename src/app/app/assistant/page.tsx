import Link from "next/link";
import { Chat } from "@/components/chat";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Assistant" };

export default async function Assistant() {
  const supabase = await createClient();
  const [{ data: convs }, { data: playbooks }] = await Promise.all([
    supabase.from("conversations").select("id,title").order("updated_at", { ascending: false }).limit(30),
    supabase.from("playbooks").select("id,name").order("name"),
  ]);
  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="card p-3 text-sm">
        <p className="px-2 pb-2 font-semibold">Conversations</p>
        {convs?.length ? convs.map((c) => (
          <Link key={c.id} href={`/app/assistant/${c.id}`} className="block truncate rounded-md px-2 py-1.5 text-muted hover:bg-surface2 hover:text-fg">{c.title}</Link>
        )) : <p className="px-2 text-muted">None yet.</p>}
      </aside>
      <Chat initial={[]} playbooks={playbooks ?? []} />
    </div>
  );
}
