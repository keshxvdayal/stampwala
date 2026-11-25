import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG } from "@/lib/content";
import { Cta } from "@/components/site/Cta";

export function generateStaticParams() { return BLOG.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = BLOG.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = BLOG.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <article className="wrap max-w-3xl pb-16 pt-14 md:pt-20">
        <Link href="/blog" className="text-sm font-semibold text-muted hover:text-ink">← All posts</Link>
        <div className="mt-6 flex items-center gap-3"><span className="chip">{p.tag}</span><span className="text-sm text-muted">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {p.read} read</span></div>
        <h1 className="h-lg mt-5 !text-[clamp(2.2rem,5vw,3.6rem)]">{p.title}</h1>
        <p className="lead mt-5">{p.excerpt}</p>
        <div className="mt-10 border-t border-line pt-10">
          {p.body.map(([kind, text], i) => kind === "h"
            ? <h2 key={i} className="h-md mb-3 mt-10">{text}</h2>
            : <p key={i} className="mb-5 text-[18px] leading-[1.75] text-ink-2">{text}</p>)}
        </div>
      </article>
      <Cta />
    </>
  );
}
