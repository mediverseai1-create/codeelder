import Link from "next/link";
import { notFound } from "next/navigation";
import { Chat } from "@/components/chat";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Assistant" };

export default async function Conversation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: conv } = await supabase.from("conversations").select("id,title").eq("id", id).maybeSingle();
  if (!conv) notFound();
  const [{ data: msgs }, { data: convs }, { data: playbooks }] = await Promise.all([
    supabase.from("messages").select("role,content").eq("conversation_id", id).order("created_at"),
    supabase.from("conversations").select("id,title").order("updated_at", { ascending: false }).limit(30),
    supabase.from("playbooks").select("id,name").order("name"),
  ]);
  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="card p-3 text-sm">
        <Link href="/app/assistant" className="btn btn-ghost mb-2 w-full">New chat</Link>
        {convs?.map((c) => (
          <Link key={c.id} href={`/app/assistant/${c.id}`} className={`block truncate rounded-md px-2 py-1.5 hover:bg-surface2 ${c.id === id ? "bg-surface2 text-fg" : "text-muted"}`}>{c.title}</Link>
        ))}
      </aside>
      <Chat key={id} conversationId={id} initial={(msgs ?? []) as { role: "user" | "assistant"; content: string }[]} playbooks={playbooks ?? []} />
    </div>
  );
}
