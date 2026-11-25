import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/bits";
import { BLOG } from "@/lib/content";
import { Arrow } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Blog", description: "Practical guides on loyalty, WhatsApp and bringing regulars back." };

export default function Blog() {
  const [first, ...rest] = BLOG;
  return (
    <>
      <PageHero eyebrow="Blog" title={<>Practical notes on <span className="marker">keeping regulars.</span></>} />
      <section className="section !pt-12">
        <div className="wrap">
          <Link href={`/blog/${first.slug}`} className="card group grid overflow-hidden transition-shadow hover:shadow-[var(--shadow-pop)] md:grid-cols-[1fr_1.2fr]">
            <div className="grid min-h-[260px] place-items-center bg-forest p-10 text-center font-display text-3xl font-bold leading-tight text-white">{first.tag}<br /><span className="text-saffron">✦</span></div>
            <div className="p-10"><span className="chip">{first.tag}</span><h2 className="h-lg mt-4 !text-[2.2rem]">{first.title}</h2><p className="mt-3 text-ink-2">{first.excerpt}</p><span className="mt-6 inline-flex items-center gap-2 font-bold text-leaf">Read · {first.read} <Arrow size={16} /></span></div>
          </Link>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card group p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]">
                <span className="chip amber">{p.tag}</span><h3 className="h-md mt-4">{p.title}</h3><p className="mt-3 text-[15px] text-ink-2">{p.excerpt}</p>
                <span className="mt-5 block text-sm text-muted">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {p.read}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
