import type { Metadata } from "next";
import { PageHero } from "@/components/site/bits";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Talk to the Stampwala team about chains, integrations or setup help." };

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Tell us about <span className="marker">your shop.</span></>} sub="Chains, integrations, setup help or just a question — we reply within one working day." />
      <section className="section !pt-12"><div className="wrap grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <ContactForm />
        <div className="space-y-4">
          {[["Setup help", "We can configure your card and QR stand for ₹999."], ["Chains & franchises", "10+ outlets? Custom pricing, your own WhatsApp number and a dedicated manager."], ["Privacy & DPDP", "Need a data-processing agreement? Ask and we'll send it."]].map(([t, d]) => <div key={t} className="card p-6"><b>{t}</b><p className="mt-1 text-ink-2">{d}</p></div>)}
        </div>
      </div></section>
    </>
  );
}
