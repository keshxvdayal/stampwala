"use client";
import Link from "next/link";
import { useState } from "react";
import { PLANS } from "@/lib/content";
import { Check, Arrow } from "@/components/ui/icons";

export function Pricing({ compact = false }: { compact?: boolean }) {
  const [annual, setAnnual] = useState(true);
  return (
    <div>
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full border border-line bg-card p-1" role="tablist">
          {[["Annual", true], ["Monthly", false]].map(([l, v]) => (
            <button key={String(l)} role="tab" aria-selected={annual === v} onClick={() => setAnnual(v as boolean)} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${annual === v ? "bg-wa text-[#04210f]" : "text-ink-2"}`}>
              {l}{v && <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${annual === v ? "bg-saffron text-ink" : "bg-saffron-soft text-[#6b4300]"}`}>Save 17%</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const price = p.monthly === null ? null : annual ? p.annual : p.monthly;
          return (
            <div key={p.id} className={`relative flex flex-col rounded-[28px] border-[1.5px] p-7 text-left ${"popular" in p ? "border-wa/50 bg-gradient-to-b from-[#0f4f39] to-[#0a3125] text-white shadow-[var(--shadow-pop)] xl:-translate-y-3" : "border-line bg-card"}`}>
              {"popular" in p && <span className="absolute -top-3.5 left-7 rounded-full bg-saffron px-3.5 py-1 text-xs font-bold text-ink">Most popular</span>}
              <h3 className="text-2xl font-semibold">{p.name}</h3>
              <p className={`mt-1 min-h-[44px] text-sm ${"popular" in p ? "text-[#bcd7c9]" : "text-muted"}`}>{p.blurb}</p>
              <div className="mt-5 font-display text-[52px] font-bold leading-none">
                {price === null ? <span className="text-[38px]">Custom</span> : <><span className="align-top text-2xl">₹</span>{price.toLocaleString("en-IN")}<span className={`ml-1 font-sans text-sm font-medium ${"popular" in p ? "text-[#bcd7c9]" : "text-muted"}`}>/month</span></>}
              </div>
              <p className={`mb-6 mt-2 min-h-5 text-[13px] ${"popular" in p ? "text-[#bcd7c9]" : "text-muted"}`}>
                {price === null ? "Volume pricing" : price === 0 ? "Free forever" : annual ? `₹${(price * 12).toLocaleString("en-IN")} billed yearly` : "Billed monthly · + GST"}
              </p>
              <ul className="flex-1 space-y-3 text-[14.5px]">
                {(compact ? p.features.slice(0, 5) : p.features).map((f) => (
                  <li key={f} className="flex gap-2.5"><span className={`mt-0.5 ${"popular" in p ? "text-wa" : "text-leaf"}`}><Check size={16} /></span>{f}</li>
                ))}
                {!compact && p.missing.map((f) => <li key={f} className="flex gap-2.5 opacity-50"><span className="mt-0.5 w-4 text-center">–</span>{f}</li>)}
              </ul>
              <Link href={p.id === "chain" ? "/contact" : `/signup?plan=${p.id}`} className={`btn mt-8 ${"popular" in p ? "btn-wa" : p.id === "starter" ? "btn-line" : "btn-dark"}`}>{p.cta} <Arrow size={16} /></Link>
            </div>
          );
        })}
      </div>
      <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-ink-2">
        {["No card for the trial", "30-day money-back", "Cancel in two clicks", "Export your data anytime"].map((t) => <span key={t} className="flex items-center gap-2"><span className="text-leaf"><Check size={16} /></span>{t}</span>)}
      </div>
    </div>
  );
}
