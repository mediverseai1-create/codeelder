import Link from "next/link";
import { GitPullRequestArrow, MessagesSquare, ScanSearch, BookMarked, Gauge, ShieldCheck } from "lucide-react";
import { PricingCards } from "@/components/site";
import { Audience, Compare, Faq, FinalCta, Trust, Workflow } from "@/components/sections";

const features = [
  { icon: MessagesSquare, title: "Assistant", text: "Ask about architecture, errors and unfamiliar code. Conversations are saved and follow your own rules." },
  { icon: ScanSearch, title: "Code review", text: "Paste code and get findings ranked by severity, with line references and a fix for each one." },
  { icon: GitPullRequestArrow, title: "Task planner", text: "Describe a change and receive an ordered plan, a proposed patch and the risks to watch." },
  { icon: BookMarked, title: "Playbooks", text: "Save your team's standards once. Apply them to any chat, review or task." },
  { icon: Gauge, title: "Clear usage", text: "A visible monthly credit balance, so you always know what a run will cost." },
  { icon: ShieldCheck, title: "Private by design", text: "Your code and history are isolated to your account with database-level access rules." },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        <p className="mx-auto w-fit rounded-full border border-line bg-surface px-3 py-1 text-xs text-accent2">AI engineering workspace</p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          A senior engineer for every <span className="text-accent">pull request</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          CodeElder reviews your code, answers the hard questions and plans the change, so you spend your time building, not second-guessing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn btn-primary">Start free</Link>
          <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <Icon className="text-accent" size={22} />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Workflow />
      <Audience />
      <Trust />

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
        <p className="mb-10 mt-2 text-center text-muted">Start free with 20 credits. Upgrade when you need more.</p>
        <PricingCards />
      </section>
      <Compare />
      <Faq />
      <FinalCta />
    </main>
  );
}
