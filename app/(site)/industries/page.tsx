import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/bits";
import { Cta } from "@/components/site/Cta";
import { Arrow } from "@/components/ui/icons";
import { INDUSTRIES } from "@/lib/content";

export const metadata: Metadata = { title: "Industries", description: "Loyalty programs tuned for cafés, salons, restaurants, bakeries, retail stores and gyms." };

export default function Industries() {
  return (
    <>
      <PageHero eyebrow="Industries" title={<>One platform. <span className="marker">Tuned to how you sell.</span></>} sub="Visit rhythm differs by business. Pick yours to see the card, rewards and automations we'd start with." />
      <section className="section !pt-12">
        <div className="wrap grid gap-5 md:grid-cols-2">
          {INDUSTRIES.map((i) => (
            <Link key={i.slug} href={`/industries/${i.slug}`} className="card group flex gap-6 p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]">
              <div className="grid size-20 shrink-0 place-items-center rounded-3xl text-4xl" style={{ background: i.color + "18" }}>{i.icon}</div>
              <div><h2 className="h-md">{i.name}</h2><p className="mt-2 text-ink-2">{i.headline}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-leaf">See the playbook <Arrow size={15} /></span></div>
            </Link>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
