import { createAdminClient, createClient } from "@/lib/supabase/server";
import { CREDIT_COST, PLANS, type Plan, type PlanId, type UsageKind } from "@/lib/plans";

export interface Account {
  userId: string;
  email: string;
  plan: Plan;
  status: string;
  periodStart: Date;
  periodEnd: Date;
  used: number;
  remaining: number;
}

function monthStart() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

/** Resolves the signed-in user's plan and credit usage. Returns null if signed out. */
export async function getAccount(): Promise<Account | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const { data: sub } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
  const active = sub && sub.status === "active" && new Date(sub.current_period_end) > new Date();
  const planId: PlanId = active ? (sub.plan as PlanId) : "free";
  const periodStart = active ? new Date(sub.current_period_start) : monthStart();
  const periodEnd = active ? new Date(sub.current_period_end) : new Date(Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth() + 1, 1));

  const { data: events } = await supabase
    .from("usage_events").select("credits").eq("user_id", user.id).gte("created_at", periodStart.toISOString());
  const used = (events ?? []).reduce((s, e) => s + e.credits, 0);
  const plan = PLANS[planId];
  return {
    userId: user.id, email: user.email ?? "", plan,
    status: sub?.status ?? "none", periodStart, periodEnd, used,
    remaining: Math.max(0, plan.credits - used),
  };
}

export class LimitError extends Error {
  constructor(message: string, public status = 402) { super(message); }
}

export function assertCredits(acc: Account, kind: UsageKind) {
  if (acc.remaining < CREDIT_COST[kind]) {
    throw new LimitError("You have used all credits for this period. Upgrade your plan to continue.");
  }
}

/** Records usage with the service role so clients cannot forge or delete it. */
export async function recordUsage(userId: string, kind: UsageKind) {
  await createAdminClient().from("usage_events").insert({ user_id: userId, kind, credits: CREDIT_COST[kind] });
}
