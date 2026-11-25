import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INDUSTRIES } from "@/lib/content";
import { Cta } from "@/components/site/Cta";
import { Reveal } from "@/components/site/Reveal";
import { Arrow, Check } from "@/components/ui/icons";

export function generateStaticParams() { return INDUSTRIES.map((i) => ({ slug: i.slug })); }

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const i = INDUSTRIES.find((x) => x.slug === slug);
  return i ? { title: `WhatsApp loyalty for ${i.name}`, description: i.pitch } : {};
}

export default async function Industry({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const i = INDUSTRIES.find((x) => x.slug === slug);
  if (!i) notFound();
  const cols = (i.goal <= 6 ? i.goal : Math.ceil(i.goal / 2));
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-14 md:pt-24">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full blur-3xl" style={{ background: i.color + "30" }} />
        <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <Link href="/industries" className="text-sm font-semibold text-muted hover:text-ink">← All industries</Link>
            <div className="mt-6"><span className="eyebrow">{i.icon} {i.name}</span></div>
            <h1 className="h-xl mt-6">{i.headline}</h1>
            <p className="lead mt-6 max-w-xl">{i.pitch}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href={`/signup?category=${({ cafes: "cafe", salons: "salon", restaurants: "restaurant", bakeries: "bakery", retail: "retail", gyms: "gym" } as Record<string, string>)[i.slug]}`} className="btn btn-dark">Start free <Arrow /></Link><Link href="/demo" className="btn btn-line">Try the demo</Link></div>
          </div>
          <div className="mx-auto w-full max-w-sm rotate-2 rounded-[28px] p-7 text-white shadow-[var(--shadow-pop)]" style={{ background: i.color }}>
            <div className="font-display text-2xl font-bold">Your {i.name.split(" ")[0].replace(/s$/, "")} Club</div>
            <div className="mt-1 text-sm opacity-80">{i.goal} stamps → {i.reward}</div>
            <div className="dots !mt-6" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
              {Array.from({ length: i.goal }, (_, n) => <div key={n} className={`dot !text-2xl ${n < i.goal - 2 ? "on" : n === i.goal - 1 ? "gift" : ""}`}>{n < i.goal - 2 ? i.icon : n === i.goal - 1 ? "🎁" : ""}</div>)}
            </div>
            <div className="prog !h-2"><i style={{ width: `${((i.goal - 2) / i.goal) * 100}%` }} /></div>
          </div>
        </div>
      </section>
      <section className="section !pt-8">
        <div className="wrap grid gap-5 md:grid-cols-3">
          {[["What hurts today", i.pains, "red", "✕"], ["What Stampwala does", i.wins, "", "✓"], ["Reward ideas to start with", i.ideas, "amber", "★"]].map(([t, list, bg, mark], n) => (
            <Reveal key={t as string} delay={n * 80} className="card h-full p-8">
              <span className={`chip ${bg}`}>{t as string}</span>
              <ul className="mt-6 space-y-4">{(list as readonly string[]).map((x) => <li key={x} className="flex gap-3 text-[15.5px] text-ink-2"><span className="mt-0.5 font-bold text-leaf">{mark === "✓" ? <Check size={17} /> : mark as string}</span>{x}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </section>
      <Cta title={`Give your ${i.name.toLowerCase()} a reason to come back.`} />
    </>
  );
}
