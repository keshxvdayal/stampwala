import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms", description: "Terms of service for Stampwala." };

export default function Terms() {
  return (
    <article className="wrap max-w-3xl pb-24 pt-16 md:pt-24">
      <h1 className="h-lg">Terms of service</h1>
      <p className="mt-3 text-sm text-muted">Template for review by your legal counsel before launch. Last updated 24 November 2026.</p>
      {[["The service", "Stampwala provides software for running digital loyalty programs. Features and limits depend on your plan."], ["Acceptable use", "Don't use the service to send unsolicited messages, to impersonate others, or to collect data without consent. Messages must comply with WhatsApp's Business and Commerce policies."], ["Billing", "Paid plans are billed monthly or yearly in advance, plus GST. You can cancel any time; refunds are available within 30 days of payment."], ["Your data", "You own your customer data. You can export it at any time and we delete it on request after account closure."], ["Availability", "We aim for high availability but don't guarantee uninterrupted service. Planned maintenance is announced in advance where possible."], ["Liability", "To the extent allowed by law, Stampwala's liability is limited to the fees you paid in the 12 months before the claim."]].map(([t, d]) => (
        <section key={t} className="mt-9"><h2 className="h-md">{t}</h2><p className="mt-3 text-[16.5px] leading-relaxed text-ink-2">{d}</p></section>
      ))}
    </article>
  );
}
