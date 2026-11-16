import type { Metadata } from "next";
import { Prose } from "@/components/page";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <Prose>
      <h1 className="text-3xl font-bold text-fg">Privacy</h1>
      <p>Draft for review by a qualified professional before launch. It describes how the product works today.</p>
      <h2>What we collect</h2>
      <p>Your email and name, the code and messages you submit, the results generated, and usage counts used to manage credits and plans.</p>
      <h2>How we use it</h2>
      <p>To provide the service, show your history, enforce plan limits and handle billing. Submitted code and messages are sent to our AI provider to generate responses.</p>
      <h2>Storage and access</h2>
      <p>Data is stored with our database provider and is accessible to you through your account. Access rules prevent other users from reading it.</p>
      <h2>Payments</h2>
      <p>Payments are processed by a third-party payment provider. We do not store card details.</p>
      <h2>Your choices</h2>
      <p>You can request deletion of your account and data by contacting support.</p>
    </Prose>
  );
}
