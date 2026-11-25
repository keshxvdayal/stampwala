import type { Metadata } from "next";
import { PageHero } from "@/components/site/bits";
import { Cta } from "@/components/site/Cta";
import { COMPARE } from "@/lib/content";

export const metadata: Metadata = { title: "Compare", description: "An honest comparison of Stampwala with paper punch cards, standalone loyalty apps and POS add-ons." };

export default function Compare() {
  const heads = ["", "Stampwala", "Paper card", "Loyalty app", "POS add-on"];
  return (
    <>
      <PageHero eyebrow="Compare" title={<>An honest comparison, <span className="marker">weaknesses included.</span></>} sub="Every option has a place. Here's where each one shines and where it doesn't." />
      <section className="section !pt-10">
        <div className="wrap">
          <div className="card overflow-x-auto">
            <table className="min-w-[820px] w-full text-left text-[15px]">
              <thead><tr>{heads.map((h, i) => <th key={i} className={`px-6 py-5 text-sm ${i === 1 ? "bg-mint font-display text-lg text-forest" : "text-muted"}`}>{h}</th>)}</tr></thead>
              <tbody>
                {COMPARE.map((r, ri) => (
                  <tr key={r[0]} className="border-t border-line">
                    {r.map((c, i) => <td key={i} className={`px-6 py-4 ${i === 0 ? "font-semibold" : ""} ${i === 1 ? "bg-mint/50 font-semibold" : "text-ink-2"} ${ri === COMPARE.length - 1 && i > 0 ? "italic" : ""}`}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[["Choose paper if", "you have a handful of daily regulars who all know each other and no interest in contacting them."], ["Choose a standalone app if", "you run a large brand that can drive installs with big incentives and wants a heavy points ecosystem."], ["Choose Stampwala if", "you want zero friction at the counter, direct WhatsApp contact with regulars, and fraud-resistant stamping."]].map(([t, d]) => (
              <div key={t} className="card p-7"><h3 className="h-md !text-xl">{t}</h3><p className="mt-2 text-ink-2">{d}</p></div>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
