import type { Metadata } from "next";
import { Cards, Cta, PageHero } from "@/components/page";

export const metadata: Metadata = { title: "Security" };

export default function Security() {
  return (
    <main className="pb-8">
      <PageHero eyebrow="Security" title="Built to keep your code yours" intro="What we do to protect your account and your work, and what we ask you to do too." />
      <Cards items={[
        { t: "Account isolation", d: "Every review, conversation, task and playbook is stored against your account. Database row-level security stops other users from reading or changing your records." },
        { t: "Server-side secrets", d: "Service keys and the AI provider key live only on the server. They are never sent to your browser." },
        { t: "Verified payments", d: "A plan is activated only after a payment is confirmed by a verified signal or a trusted administrator. Visiting a payment page never grants access." },
        { t: "Tamper-resistant usage", d: "Credit usage is recorded by the server, so it cannot be edited or deleted from a browser." },
        { t: "You choose what to share", d: "CodeElder does not read your repositories. It only sees the code you paste into it." },
        { t: "Input validation", d: "Every request is validated on the server, with size limits on code and messages." },
      ]} />
      <section className="mx-auto mt-12 max-w-3xl px-4 text-sm text-muted">
        <h2 className="text-lg font-semibold text-fg">Your part</h2>
        <p className="mt-2">Do not paste passwords, private keys or personal data into any tool, including this one. Use a strong, unique password for your account. AI output can be wrong, so test changes before you ship them.</p>
        <p className="mt-2">Code you submit is sent to our AI provider to produce a response. Review the Privacy page for details.</p>
      </section>
      <Cta />
    </main>
  );
}
