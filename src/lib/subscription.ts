import { createAdminClient } from "@/lib/supabase/server";
import { PLANS, planByPrice, type PlanId } from "@/lib/plans";

/** Activates a 30-day period for the user with this email. Service role only. */
export async function activate(email: string, amountOrPlan: number | PlanId) {
  const plan = typeof amountOrPlan === "number" ? planByPrice(amountOrPlan) : amountOrPlan;
  if (!plan || plan === "free" || !PLANS[plan]) return { ok: false as const, reason: "Amount does not match a plan" };

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (!profile) return { ok: false as const, reason: "No account with that email" };

  const now = new Date();
  const end = new Date(now.getTime() + 30 * 86_400_000);
  const { error } = await admin.from("subscriptions").upsert({
    user_id: profile.id, plan, status: "active",
    current_period_start: now.toISOString(), current_period_end: end.toISOString(),
    source: "payment", updated_at: now.toISOString(),
  }, { onConflict: "user_id" });
  if (error) return { ok: false as const, reason: error.message };
  return { ok: true as const, plan };
}
