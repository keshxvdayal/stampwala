import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/site/bits";
import { Reveal } from "@/components/site/Reveal";
import { Cta } from "@/components/site/Cta";

export const metadata: Metadata = { title: "About", description: "Why we're building loyalty for the shops that make Indian neighbourhoods feel like home." };

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title={<>For the shops that know your <span className="marker">name and your order.</span></>} sub="India's best businesses run on regulars. The tools to reward them were built for someone else — a Western chain, an app-first brand, an enterprise POS. Stampwala is built for the chai stall, the neighbourhood salon and the family bakery." />
      <section className="section">
        <div className="wrap grid gap-5 md:grid-cols-3">
          {[["Meet people where they are", "Customers already live in WhatsApp. The best loyalty tool asks them to learn nothing new."], ["Honesty over hype", "We say what's shipped, what's roadmap, and where we're not the right fit. Our comparison page lists our weaknesses too."], ["Your data is yours", "Consent first, opt-out always, export anytime. We never sell or share your customer list."]].map(([t, d], i) => (
            <Reveal key={t} delay={i * 80} className="card p-8"><h3 className="h-md">{t}</h3><p className="mt-3 text-ink-2">{d}</p></Reveal>
          ))}
        </div>
      </section>
      <section className="section bg-paper-2/70"><div className="wrap"><SectionHead eyebrow="Principles" title="How we decide what to build." />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">{["If the cashier needs training, we failed.", "If a feature makes the queue slower, it doesn't ship.", "Anything that can be gamed, will be — design for it.", "Small shops should get big-brand tools at small-shop prices."].map((x) => <li key={x} className="card p-6 font-display text-xl font-semibold">{x}</li>)}</ul></div></section>
      <Cta />
    </>
  );
}
