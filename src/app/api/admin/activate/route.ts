import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { activate } from "@/lib/subscription";

const Body = z.object({ email: z.string().email(), plan: z.enum(["solo", "pro", "max"]) });

/** Trusted manual activation after you have confirmed payment in your payment dashboard. */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!data.user?.email || !admins.includes(data.user.email.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Provide email and plan" }, { status: 400 });
  const result = await activate(parsed.data.email, parsed.data.plan);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
