import type { Metadata } from "next";
import { PricingCards } from "@/components/site";
import { CREDIT_COST } from "@/lib/plans";

export const metadata: Metadata = { title: "Pricing" };

export default function Pricing() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center text-4xl font-bold">Pricing</h1>
      <p className="mx-auto mb-10 mt-3 max-w-xl text-center text-muted">
        Every account starts free with 20 credits a month. Paid plans are billed monthly.
      </p>
      <PricingCards />
      <div className="card mx-auto mt-12 max-w-2xl p-6 text-sm">
        <h2 className="font-semibold">How credits work</h2>
        <p className="mt-2 text-muted">
          A chat message costs {CREDIT_COST.chat} credit, a code review {CREDIT_COST.review} and a planned task {CREDIT_COST.task}. Credits reset each billing period. Payment is handled securely on our payment partner&apos;s page; your plan is activated after the payment is confirmed, which can take a few minutes.
        </p>
      </div>
    </main>
  );
}
