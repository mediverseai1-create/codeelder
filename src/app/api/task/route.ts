import { NextResponse } from "next/server";
import { z } from "zod";
import { planTask } from "@/lib/ai";
import { assertCredits, getAccount, recordUsage } from "@/lib/account";
import { fail } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  title: z.string().trim().min(1, "Give the task a title").max(120),
  description: z.string().trim().min(5, "Describe the change you want").max(4000),
  code: z.string().max(40_000, "Code is too long (40,000 characters max)").optional(),
  playbookId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const acc = await getAccount();
    if (!acc) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (!acc.plan.tasks) {
      return NextResponse.json({ error: "Task planning is available on the Pro and Max plans." }, { status: 403 });
    }
    const body = Body.parse(await req.json());
    assertCredits(acc, "task");
    const supabase = await createClient();

    let playbook: string | null = null;
    if (body.playbookId) {
      const { data } = await supabase.from("playbooks").select("instructions").eq("id", body.playbookId).maybeSingle();
      playbook = data?.instructions ?? null;
    }

    const result = await planTask(body.description, body.code || null, playbook, acc.plan.premiumModel);
    const { data, error } = await supabase.from("tasks")
      .insert({ user_id: acc.userId, title: body.title, description: body.description, code: body.code || null, result })
      .select("id").single();
    if (error) throw error;
    await recordUsage(acc.userId, "task");
    return NextResponse.json({ id: data.id });
  } catch (e) {
    return fail(e);
  }
}
