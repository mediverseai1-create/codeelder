import { NextResponse } from "next/server";
import { z } from "zod";
import { chat } from "@/lib/ai";
import { assertCredits, getAccount, recordUsage } from "@/lib/account";
import { fail } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1, "Write a message first").max(8000, "Message is too long"),
  playbookId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const acc = await getAccount();
    if (!acc) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const body = Body.parse(await req.json());
    assertCredits(acc, "chat");
    const supabase = await createClient();

    let convId = body.conversationId;
    if (!convId) {
      const { data, error } = await supabase.from("conversations")
        .insert({ user_id: acc.userId, title: body.message.slice(0, 60) }).select("id").single();
      if (error) throw error;
      convId = data.id;
    } else {
      const { data } = await supabase.from("conversations").select("id").eq("id", convId).maybeSingle();
      if (!data) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const { data: past } = await supabase.from("messages").select("role, content")
      .eq("conversation_id", convId).order("created_at", { ascending: true }).limit(30);

    let playbook: string | null = null;
    if (body.playbookId) {
      const { data } = await supabase.from("playbooks").select("instructions").eq("id", body.playbookId).maybeSingle();
      playbook = data?.instructions ?? null;
    }

    const turns = [
      ...(past ?? []).map((m) => ({ role: (m.role === "user" ? "user" : "model") as "user" | "model", text: m.content })),
      { role: "user" as const, text: body.message },
    ];
    const reply = await chat(turns, playbook, acc.plan.premiumModel);

    // Persist only after the AI succeeded so failures never bill or leave dangling turns.
    const { error: insErr } = await supabase.from("messages").insert([
      { conversation_id: convId, user_id: acc.userId, role: "user", content: body.message },
      { conversation_id: convId, user_id: acc.userId, role: "assistant", content: reply },
    ]);
    if (insErr) throw insErr;
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
    await recordUsage(acc.userId, "chat");

    return NextResponse.json({ conversationId: convId, reply });
  } catch (e) {
    return fail(e);
  }
}
