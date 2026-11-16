import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { activate } from "@/lib/subscription";

/**
 * Payment confirmation webhook.
 * A subscription is only activated when the request carries SELAR_WEBHOOK_SECRET
 * in the `x-webhook-secret` header. Returning from the payment link alone never activates anything.
 *
 * IMPORTANT: the field names below (email, amount, currency, reference/id) are a best-effort
 * guess and MUST be checked against the real payload your payment provider sends.
 * Until verified, use /api/admin/activate instead.
 */
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: Request) {
  const secret = process.env.SELAR_WEBHOOK_SECRET;
  const given = req.headers.get("x-webhook-secret") ?? "";
  if (!secret || !safeEqual(given, secret)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  const p = payload as Record<string, unknown>;
  const email = String(p.email ?? (p.customer as Record<string, unknown> | undefined)?.email ?? "").toLowerCase();
  const amount = Number(p.amount ?? p.price ?? 0);
  const currency = String(p.currency ?? "USD").toUpperCase();
  const externalId = String(p.reference ?? p.id ?? p.order_id ?? "") || null;

  const admin = createAdminClient();
  if (externalId) {
    const { data: seen } = await admin.from("payment_events").select("id").eq("external_id", externalId).maybeSingle();
    if (seen) return NextResponse.json({ ok: true, duplicate: true });
  }
  const { data: ev } = await admin.from("payment_events")
    .insert({ external_id: externalId, email, amount, currency, payload }).select("id").single();

  if (!email || currency !== "USD") return NextResponse.json({ ok: true, applied: false });
  const result = await activate(email, amount);
  if (result.ok && ev) await admin.from("payment_events").update({ applied: true }).eq("id", ev.id);
  return NextResponse.json({ ok: true, applied: result.ok });
}
