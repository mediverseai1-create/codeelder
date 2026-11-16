import { PricingCards } from "@/components/site";
import { getAccount } from "@/lib/account";

export const metadata = { title: "Billing" };

export default async function Billing() {
  const acc = (await getAccount())!;
  const paid = acc.plan.id !== "free";
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold">Billing</h1>
      <section className="card grid gap-4 p-5 sm:grid-cols-3">
        <div><p className="text-sm text-muted">Current plan</p><p className="text-xl font-bold">{acc.plan.name}</p></div>
        <div><p className="text-sm text-muted">Status</p><p className="text-xl font-bold capitalize">{paid ? acc.status : "free"}</p></div>
        <div><p className="text-sm text-muted">{paid ? "Renews / expires" : "Credits reset"}</p><p className="text-xl font-bold">{acc.periodEnd.toLocaleDateString()}</p></div>
        <div className="sm:col-span-3 text-sm text-muted">Credits used: {acc.used} of {acc.plan.credits} ({acc.remaining} remaining)</div>
      </section>
      <section>
        <h2 className="mb-3 font-semibold">Plans</h2>
        <PricingCards current={acc.plan.id} />
      </section>
      <section className="card p-5 text-sm text-muted">
        <h2 className="font-semibold text-fg">After you pay</h2>
        <p className="mt-2">Use the same email you registered with ({acc.email}) at checkout. Your plan is activated once the payment is confirmed; this is not instant when you return from the payment page. If your plan has not changed after a few minutes, contact support with your receipt.</p>
        <p className="mt-2">To change plans, pay for the new plan; it replaces your current one on confirmation. Plans are monthly and do not renew automatically until you pay again.</p>
      </section>
    </div>
  );
}
