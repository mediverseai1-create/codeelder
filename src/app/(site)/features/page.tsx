import type { Metadata } from "next";
import { Audience, FinalCta, Trust, Workflow } from "@/components/sections";
import { CREDIT_COST } from "@/lib/plans";

export const metadata: Metadata = { title: "Features" };

const rows = [
  { t: "Assistant", c: CREDIT_COST.chat, d: "A persistent chat for debugging, design questions and explanations. Each conversation keeps its context, and a playbook can steer the tone and standards." },
  { t: "Code review", c: CREDIT_COST.review, d: "Submit a file or snippet. You get a summary and findings ranked from critical to informational, each with a line reference and a suggested fix. The score is calculated from the findings, never guessed by the model." },
  { t: "Task planner", c: CREDIT_COST.task, d: "Describe the change and attach the relevant code. CodeElder returns ordered steps, a proposed patch and the risks. Available on Pro and Max." },
  { t: "Playbooks", c: 0, d: "Reusable instructions such as your naming rules, test expectations or security checklist. Attach one to any run." },
];

export default function Features() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Everything a second pair of eyes should do</h1>
      <p className="mt-3 text-muted">Four tools that work from the same history and the same rules.</p>
      <div className="mt-10 space-y-4">
        {rows.map((r) => (
          <div key={r.t} className="card p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">{r.t}</h2>
              <span className="text-xs text-muted">{r.c ? `${r.c} credit${r.c > 1 ? "s" : ""} per run` : "No credits"}</span>
            </div>
            <p className="mt-2 text-muted">{r.d}</p>
          </div>
        ))}
      </div>
      <Workflow />
      <Audience />
      <Trust />
      <FinalCta />
    </main>
  );
}
