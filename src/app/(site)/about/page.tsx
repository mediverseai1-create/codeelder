import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">About CodeElder</h1>
      <p className="mt-4 text-muted">
        CodeElder exists because good review is scarce. Most developers ship alone or with a team too busy to look closely. We built a workspace that gives every change a careful second opinion, and keeps the history so lessons are not lost.
      </p>
      <p className="mt-4 text-muted">
        AI output can be wrong. Treat findings and patches as suggestions to verify, and run your own tests before merging.
      </p>
      <section id="contact" className="card mt-10 p-6">
        <h2 className="text-xl font-semibold">Contact &amp; support</h2>
        <p className="mt-2 text-sm text-muted">
          Questions about billing, plan activation or your account? Sign in and use the details on your Billing page, or write to the support address configured by the site owner.
        </p>
      </section>
    </main>
  );
}
