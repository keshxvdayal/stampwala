import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/site/bits";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Cta } from "@/components/site/Cta";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = { title: "Pricing", description: "Free forever for one counter. Growth ₹499/month billed yearly. Pro ₹1,249/month. No setup fees, no per-stamp charges." };

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Start free. Pay when it&apos;s <span className="marker">paying you back.</span></>} sub="Clear prices in rupees. No setup fee, no per-stamp charge, no lock-in." />
      <section className="section !pt-6">
        <div className="wrap text-center">
          <Pricing />
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 text-left md:grid-cols-3">
            {[["Extra messages", "₹0.75 each", "Business-initiated messages beyond your monthly allowance. Packs never expire."], ["Extra outlet", "₹399 / month", "Add outlets to Growth or Pro. Each gets its own PINs and reports."], ["Done-for-you setup", "₹999 one time", "We configure your card and print-ready QR stand so you can start the same day."]].map(([t, p, d]) => (
              <Reveal key={t} className="card p-7"><span className="text-sm font-bold text-muted">{t}</span><div className="mt-1 font-display text-3xl font-bold">{p}</div><p className="mt-2 text-sm text-ink-2">{d}</p></Reveal>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-[13px] text-muted">Prices exclude GST. Replies inside a customer&apos;s conversation (codes, stamp confirmations, vouchers) are unlimited on every plan. Allowances apply to business-initiated messages only.</p>
        </div>
      </section>
      <section className="section bg-paper-2/70">
        <div className="wrap"><SectionHead center eyebrow="Questions" title="Pricing, answered." /><Faq /></div>
      </section>
      <Cta />
    </>
  );
}
