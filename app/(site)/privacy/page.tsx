import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy", description: "How Stampwala handles customer and merchant data." };

export default function Privacy() {
  const S = ({ t, children, id }: { t: string; children: React.ReactNode; id?: string }) => (<section id={id} className="mt-10 scroll-mt-24"><h2 className="h-md">{t}</h2><div className="mt-3 space-y-3 text-[16.5px] leading-relaxed text-ink-2">{children}</div></section>);
  return (
    <article className="wrap max-w-3xl pb-24 pt-16 md:pt-24">
      <h1 className="h-lg">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted">Template for review by your legal counsel before launch. Last updated 24 November 2026.</p>
      <S t="What we collect"><p><b>From merchants:</b> business name, owner name, email, outlet and staff names, and the program settings you configure.</p><p><b>From your customers (on your behalf):</b> mobile number, optional name and birthday, visit and stamp history, and messages exchanged with your business account.</p></S>
      <S t="Who is the controller"><p>You, the merchant, decide why customer data is collected and are the data fiduciary under India&apos;s Digital Personal Data Protection Act, 2023. Stampwala acts as your processor and handles data only to provide the service.</p></S>
      <S t="Consent and opt-out" id="dpdp"><p>Customers consent when they join your club. They can send STOP at any time to stop messages, and opted-out customers are excluded from all campaigns.</p></S>
      <S t="Your control"><p>You can export your customer list as CSV at any time. On request we delete a merchant&apos;s data after account closure.</p></S>
      <S t="What we never do"><p>We never sell customer data, never use your customer list to market to them ourselves, and never share it with other merchants.</p></S>
      <S t="Contact"><p>Questions about this policy: use the <a className="font-semibold text-leaf underline" href="/contact">contact page</a>.</p></S>
    </article>
  );
}
