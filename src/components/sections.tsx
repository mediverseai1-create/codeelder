import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { PLANS, PAID_PLANS, CREDIT_COST } from "@/lib/plans";

export function Section({ id, title, intro, children }: { id?: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto mt-24 max-w-6xl px-4">
      <h2 className="text-center text-3xl font-bold tracking-tight">{title}</h2>
      {intro && <p className="mx-auto mt-3 max-w-2xl text-center text-muted">{intro}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

const WORKFLOWS = [
  { n: "01", t: "Bring your code", d: "Paste a file, a diff or a failing function. No repository access is required, so you stay in control of what is shared." },
  { n: "02", t: "Pick the tool", d: "Ask the assistant a question, run a review for ranked findings, or describe a change to get a plan and patch." },
  { n: "03", t: "Apply your standards", d: "Attach a playbook with your naming rules, security checks or test expectations so output matches how you work." },
  { n: "04", t: "Verify and ship", d: "Every finding shows the exact line it refers to. Check it, apply the fix, and keep the record for next time." },
];

export function Workflow() {
  return (
    <Section title="How a change moves through CodeElder" intro="Four steps from a raw snippet to a change you trust.">
      <div className="grid gap-4 md:grid-cols-2">
        {WORKFLOWS.map((w) => (
          <div key={w.n} className="card flex gap-4 p-6">
            <span className="font-mono text-2xl text-accent2">{w.n}</span>
            <div><h3 className="font-semibold">{w.t}</h3><p className="mt-1 text-sm text-muted">{w.d}</p></div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const USERS = [
  { t: "Solo developers", d: "Get the second opinion you do not have. Catch the bug before your users do, and learn from every finding." },
  { t: "Freelancers and agencies", d: "Keep client work consistent. One playbook per client means the same standards on every project." },
  { t: "Small teams", d: "Review faster when senior time is scarce. Use findings to unblock a pull request before a human looks." },
  { t: "Learners", d: "Paste code you do not understand and ask why. Get explanations tied to your own code, not generic tutorials." },
];

export function Audience() {
  return (
    <Section title="Built for people who ship" intro="Whether you write alone or with a small crew.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {USERS.map((u) => (
          <div key={u.t} className="card p-6"><h3 className="font-semibold text-accent">{u.t}</h3><p className="mt-2 text-sm text-muted">{u.d}</p></div>
        ))}
      </div>
    </Section>
  );
}

export function Trust() {
  const items = [
    ["Your data stays yours", "Reviews, chats and tasks are tied to your account and protected by database-level access rules, so other users cannot read them."],
    ["Honest about limits", "Findings come from an AI model. We show the line each finding refers to so you can verify it, and the review score is calculated from the findings, not guessed."],
    ["No surprise bills", "Usage is measured in credits with a visible balance. When credits run out, runs stop instead of charging more."],
    ["Payments you can trust", "A plan is only activated after the payment is confirmed. Returning from a payment page never grants access by itself."],
  ];
  return (
    <Section title="Clear about what it does and does not do">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([t, d]) => (
          <div key={t} className="card p-6"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div>
        ))}
      </div>
    </Section>
  );
}

const ROWS: [string, (id: "free" | "solo" | "pro" | "max") => string | boolean][] = [
  ["Monthly credits", (id) => PLANS[id].credits.toLocaleString()],
  ["Assistant chat", () => true],
  ["Code review", () => true],
  ["Task planner with patches", (id) => PLANS[id].tasks],
  ["Playbooks", (id) => (PLANS[id].maxPlaybooks > 100 ? "Unlimited" : String(PLANS[id].maxPlaybooks))],
  ["Premium model", (id) => PLANS[id].premiumModel],
];

export function Compare() {
  const ids = ["free", ...PAID_PLANS] as const;
  return (
    <Section title="Compare plans" intro={`Chat costs ${CREDIT_COST.chat} credit, a review ${CREDIT_COST.review}, a task ${CREDIT_COST.task}.`}>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead><tr className="border-b border-line text-left">
            <th className="p-4 font-medium text-muted">Feature</th>
            {ids.map((id) => <th key={id} className="p-4 font-semibold">{PLANS[id].name}<span className="block text-xs font-normal text-muted">{PLANS[id].price ? `$${PLANS[id].price}/mo` : "Free"}</span></th>)}
          </tr></thead>
          <tbody>
            {ROWS.map(([label, get]) => (
              <tr key={label} className="border-b border-line last:border-0">
                <td className="p-4 text-muted">{label}</td>
                {ids.map((id) => {
                  const v = get(id);
                  return <td key={id} className="p-4">{v === true ? <Check size={16} className="text-accent2" aria-label="Included" /> : v === false ? <Minus size={16} className="text-muted" aria-label="Not included" /> : v}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

const FAQ = [
  ["Does CodeElder access my repositories?", "No. You paste the code you want help with. Nothing is read from your repositories automatically."],
  ["How accurate are the reviews?", "They are AI-generated and can be wrong or incomplete. Each finding points to a line so you can verify it. Treat results as a second opinion, not a replacement for tests or human review."],
  ["What is a credit?", `Credits measure usage. A chat message costs ${CREDIT_COST.chat}, a review ${CREDIT_COST.review} and a planned task ${CREDIT_COST.task}. Credits reset every billing period.`],
  ["How do I upgrade?", "Pay for a plan using the same email as your account. Your plan is activated once the payment is confirmed, which may take a few minutes."],
  ["Can I change or cancel my plan?", "Plans are monthly and do not renew on their own. Pay for a different plan to switch, or simply do not renew and you return to the free tier."],
  ["Which languages are supported?", "Any language the underlying model understands, including JavaScript, TypeScript, Python, Go, Java, C#, PHP, Ruby and SQL."],
  ["Is there a free option?", "Yes. Every account gets 20 free credits each month, with no card required."],
];

export function Faq() {
  return (
    <Section id="faq" title="Frequently asked questions">
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQ.map(([q, a]) => (
          <details key={q} className="card group p-5">
            <summary className="cursor-pointer list-none font-medium marker:hidden">{q}</summary>
            <p className="mt-3 text-sm text-muted">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto mt-24 max-w-4xl px-4">
      <div className="card border-accent p-10 text-center">
        <h2 className="text-3xl font-bold">Give your next change a second opinion</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">Create a free account and run your first review in under a minute.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn btn-primary">Start free</Link>
          <Link href="/pricing" className="btn btn-ghost">View pricing</Link>
        </div>
      </div>
    </section>
  );
}
