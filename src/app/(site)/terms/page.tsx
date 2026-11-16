import type { Metadata } from "next";
import { Prose } from "@/components/page";

export const metadata: Metadata = { title: "Terms" };

export default function Terms() {
  return (
    <Prose>
      <h1 className="text-3xl font-bold text-fg">Terms of service</h1>
      <p>Draft for review by a qualified professional before launch.</p>
      <h2>The service</h2>
      <p>CodeElder provides AI-assisted code review, answers and planning. Output may be inaccurate or incomplete. You are responsible for verifying it before use.</p>
      <h2>Your content</h2>
      <p>You keep ownership of the code you submit and confirm you have the right to submit it. Do not submit secrets or personal data.</p>
      <h2>Plans and payment</h2>
      <p>Paid plans are billed monthly through a third-party provider and activate after payment is confirmed. Plans do not renew automatically. Credits reset each period and do not roll over.</p>
      <h2>Acceptable use</h2>
      <p>Do not abuse the service, attempt to bypass limits, or use it to create malicious software.</p>
      <h2>Liability</h2>
      <p>The service is provided as is. To the extent permitted by law, we are not liable for losses arising from reliance on its output.</p>
    </Prose>
  );
}
