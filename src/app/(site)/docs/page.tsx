import type { Metadata } from "next";
import { Cta, PageHero } from "@/components/page";
import { CREDIT_COST } from "@/lib/plans";

export const metadata: Metadata = { title: "Getting started" };

const steps = [
  ["Create your account", "Sign up with your email and a password. You start on the free tier with 20 credits a month."],
  ["Ask the assistant", `Open Assistant and ask a question. Each message costs ${CREDIT_COST.chat} credit. Conversations are saved so you can return to them.`],
  ["Run a code review", `Open Reviews, paste code, name the language and run it. A review costs ${CREDIT_COST.review} credits. Findings are ranked by severity and point to the line they refer to.`],
  ["Write a playbook", "Open Playbooks and save instructions such as naming rules or security checks. Attach a playbook to any chat, review or task."],
  ["Plan a change (Pro and Max)", `Open Tasks, describe the change and paste relevant code. You get ordered steps, a proposed patch and the risks. A task costs ${CREDIT_COST.task} credits.`],
  ["Upgrade when you need more", "Open Billing, pay for a plan with the same email as your account, and your plan activates once the payment is confirmed."],
];

export default function Docs() {
  return (
    <main className="pb-8">
      <PageHero eyebrow="Documentation" title="Getting started" intro="From sign-up to your first useful review in about five minutes." />
      <ol className="mx-auto mt-12 max-w-3xl space-y-4 px-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="card flex gap-4 p-5"><span className="font-mono text-xl text-accent2">{i + 1}</span><div><h2 className="font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></div></li>
        ))}
      </ol>
      <section className="mx-auto mt-12 max-w-3xl px-4 text-sm text-muted">
        <h2 className="text-lg font-semibold text-fg">Tips for better results</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Review one file or function at a time. Focused input gives sharper findings.</li>
          <li>State the language, even if it seems obvious.</li>
          <li>Tell the assistant what you already tried when asking about a bug.</li>
          <li>Treat every result as a suggestion to verify. Run your tests before merging.</li>
        </ul>
      </section>
      <Cta />
    </main>
  );
}
