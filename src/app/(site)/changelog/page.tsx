import type { Metadata } from "next";
import { PageHero } from "@/components/page";

export const metadata: Metadata = { title: "Changelog" };

const entries = [
  { v: "Launch", items: ["Assistant chat with saved conversations", "Code review with ranked findings and calculated scores", "Task planner for Pro and Max", "Playbooks for reusable instructions", "Credit-based usage and billing page"] },
];

export default function Changelog() {
  return (
    <main className="pb-16">
      <PageHero eyebrow="Changelog" title="What's new" intro="Product updates as they ship." />
      <div className="mx-auto mt-12 max-w-3xl space-y-4 px-4">
        {entries.map((e) => (
          <section key={e.v} className="card p-6">
            <h2 className="font-semibold">{e.v}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{e.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </section>
        ))}
      </div>
    </main>
  );
}
