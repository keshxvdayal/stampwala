import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@/components/site/bits";
import { Reveal } from "@/components/site/Reveal";
import { Cta } from "@/components/site/Cta";
import { Arrow } from "@/components/ui/icons";

export const metadata: Metadata = { title: "How it works", description: "From signup to first stamp in ten minutes: set up your card, print the QR, and start rewarding regulars." };

const setup = [
  ["Create your account", "Business name, category and email. We pre-fill a sensible card for your type of shop.", "1 min"],
  ["Design the card", "Pick stamps (3–15), an icon, a colour and the reward. Set the minimum bill and happy hours.", "3 min"],
  ["Add outlets & staff PINs", "Each cashier gets a 4–6 digit PIN tied to an outlet.", "2 min"],
  ["Print the QR stand", "Download your counter QR and put it by the till.", "2 min"],
  ["Stamp the first customer", "Open the counter terminal, scan, enter the code and bill. Done.", "2 min"],
];

export default function How() {
  return (
    <>
      <PageHero eyebrow="How it works" title={<>From signup to first stamp in <span className="marker">ten minutes.</span></>} sub="No installation, no hardware, no training. Here's exactly what happens on both sides of the counter." />
      <section className="section">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <Reveal className="card p-9">
            <span className="chip">Customer side</span>
            <ol className="mt-6 space-y-6">
              {[["Scan the QR", "Their camera opens your club page."], ["Join in one tap", "Name and mobile number. Consent is recorded."], ["Get a code", "A 4-digit code appears, valid for two minutes."], ["Show the cashier", "Stamp lands on their card; they get a confirmation message."], ["Collect the reward", "Full card → voucher. Quiet for 3 weeks → a friendly nudge."]].map(([t, d], i) => (
                <li key={t} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest font-bold text-white">{i + 1}</span><div><b>{t}</b><p className="text-ink-2">{d}</p></div></li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={100} className="card p-9">
            <span className="chip amber">Cashier side</span>
            <ol className="mt-6 space-y-6">
              {[["Open the counter terminal", "Sign in with your PIN once per shift."], ["Type the customer's code", "Four digits."], ["Enter the bill", "Below the minimum? It tells you."], ["Tap Verify & stamp", "Instant confirmation, tied to you and your outlet."], ["Redeem vouchers", "Enter the voucher code; it can only be used once."]].map(([t, d], i) => (
                <li key={t} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-saffron font-bold">{i + 1}</span><div><b>{t}</b><p className="text-ink-2">{d}</p></div></li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper-2/70">
        <div className="wrap">
          <SectionHead center eyebrow="Setup" title="Live in about ten minutes." />
          <div className="mx-auto mt-14 max-w-3xl space-y-4">
            {setup.map(([t, d, m], i) => (
              <Reveal key={t} delay={i * 60} className="card flex items-center gap-5 p-6">
                <span className="font-display text-4xl font-bold text-saffron">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1"><b className="text-lg">{t}</b><p className="text-ink-2">{d}</p></div>
                <span className="chip">{m}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <SectionHead eyebrow="Under the hood" title="Honest about how WhatsApp works." sub="Stampwala runs on the WhatsApp Business Platform (Cloud API)." />
          <div className="space-y-5 text-ink-2">
            <p><b className="text-ink">Replies are cheap and unlimited.</b> When a customer messages you, you can reply freely for 24 hours — that covers join confirmations, codes, stamps and vouchers.</p>
            <p><b className="text-ink">Outreach uses templates.</b> Win-back and birthday messages are business-initiated, so they use pre-approved templates and count against your plan&apos;s monthly allowance.</p>
            <p><b className="text-ink">No WhatsApp? No problem.</b> The web card works in any browser, and managers can stamp by phone number.</p>
            <Link href="/blog/whatsapp-business-api-for-small-shops" className="inline-flex items-center gap-2 font-bold text-leaf">Read the plain-English guide <Arrow size={16} /></Link>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
