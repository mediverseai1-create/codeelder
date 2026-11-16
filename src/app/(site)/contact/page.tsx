import type { Metadata } from "next";
import { PageHero } from "@/components/page";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <main className="pb-16">
      <PageHero eyebrow="Contact" title="Talk to us" intro="Questions about plans, billing or your account." />
      <div className="mx-auto mt-12 grid max-w-3xl gap-4 px-4 sm:grid-cols-2">
        <div className="card p-6"><h2 className="font-semibold">Support</h2>
          <p className="mt-2 text-sm text-muted">{email ? <>Email <a className="text-accent" href={`mailto:${email}`}>{email}</a>. Include your account email.</> : "Support contact details will be published here."}</p></div>
        <div className="card p-6"><h2 className="font-semibold">Plan not activated?</h2>
          <p className="mt-2 text-sm text-muted">Send your payment receipt and the email you registered with. Activation follows payment confirmation.</p></div>
      </div>
    </main>
  );
}
