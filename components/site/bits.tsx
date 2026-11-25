import { Reveal } from "./Reveal";

export function SectionHead({ eyebrow, title, sub, center = false, dark = false }: { eyebrow?: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <span className={`eyebrow ${dark ? "dark" : ""}`}><i />{eyebrow}</span>}
      <h2 className={`h-lg mt-5 ${dark ? "text-white" : ""}`}>{title}</h2>
      {sub && <p className={`lead mt-5 ${dark ? "!text-[#bcd7c9]" : ""}`}>{sub}</p>}
    </Reveal>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-white/[0.03] py-4" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl font-semibold text-ink-2">
        {row.map((t, i) => <span key={i} className="flex items-center gap-10">{t}<span className="text-saffron">✦</span></span>)}
      </div>
    </div>
  );
}

export function PageHero({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-6 pt-16 md:pt-24">
      <div className="aurora"><i /><i /></div><div className="grid-bg" />
      <div className="wrap relative">
        <span className="eyebrow"><i />{eyebrow}</span>
        <h1 className="h-xl mt-6 max-w-4xl">{title}</h1>
        {sub && <p className="lead mt-6 max-w-2xl">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
