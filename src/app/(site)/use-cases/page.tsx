import type { Metadata } from "next";
import { Cards, Cta, PageHero } from "@/components/page";

export const metadata: Metadata = { title: "Use cases" };

export default function UseCases() {
  return (
    <main className="pb-8">
      <PageHero eyebrow="Use cases" title="One workspace, many jobs" intro="Ways developers and small teams use CodeElder day to day." />
      <Cards items={[
        { t: "Pre-merge review", d: "Run a review on a change before anyone else sees it, and fix the obvious problems first." },
        { t: "Security spot checks", d: "Paste a handler or query builder and ask for injection, authentication and input-handling risks." },
        { t: "Legacy code comprehension", d: "Ask what an unfamiliar function does and why it might have been written that way." },
        { t: "Refactor planning", d: "Describe the goal and get an ordered plan, a proposed patch and the risks before you touch the code." },
        { t: "Debugging", d: "Share the error and the code around it. Work through likely causes with a saved conversation." },
        { t: "Standards enforcement", d: "Encode team conventions in a playbook so every review checks the same rules." },
        { t: "Onboarding", d: "Help new developers understand a codebase by asking questions against real snippets." },
        { t: "Client projects", d: "Keep one playbook per client so agency work stays consistent." },
      ]} />
      <Cta />
    </main>
  );
}
