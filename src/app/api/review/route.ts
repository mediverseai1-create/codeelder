import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewCode, scoreFindings } from "@/lib/ai";
import { assertCredits, getAccount, recordUsage } from "@/lib/account";
import { fail } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  title: z.string().trim().min(1, "Give the review a title").max(120),
  language: z.string().trim().max(30).default("auto"),
  code: z.string().min(1, "Paste some code to review").max(40_000, "Code is too long (40,000 characters max)"),
  playbookId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const acc = await getAccount();
    if (!acc) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const body = Body.parse(await req.json());
    assertCredits(acc, "review");
    const supabase = await createClient();

    let playbook: string | null = null;
    if (body.playbookId) {
      const { data } = await supabase.from("playbooks").select("instructions").eq("id", body.playbookId).maybeSingle();
      playbook = data?.instructions ?? null;
    }

    const result = await reviewCode(body.code, body.language, playbook, acc.plan.premiumModel);
    const score = scoreFindings(result.findings);
    const { data, error } = await supabase.from("reviews")
      .insert({ user_id: acc.userId, title: body.title, language: body.language, code: body.code, result, score })
      .select("id").single();
    if (error) throw error;
    await recordUsage(acc.userId, "review");
    return NextResponse.json({ id: data.id });
  } catch (e) {
    return fail(e);
  }
}
