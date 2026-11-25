import Link from "next/link";
import { Logo } from "@/components/ui/icons";
import { INDUSTRIES } from "@/lib/content";

const col = (title: string, items: [string, string][]) => (
  <div>
    <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#8fb5a2]">{title}</h4>
    <ul className="space-y-2.5 text-[15px]">
      {items.map(([l, h]) => <li key={h}><Link href={h} className="text-[#d6e6dd] transition-colors hover:text-white">{l}</Link></li>)}
    </ul>
  </div>
);

export function Footer() {
  return (
    <footer className="border-t border-line bg-black/30 text-white">
      <div className="wrap pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-[#b9d3c6]">WhatsApp loyalty cards for Indian cafés, salons and shops. No app, no lost cards, no fake stamps.</p>
            <Link href="/signup" className="btn btn-wa btn-sm mt-6">Start free</Link>
          </div>
          {col("Product", [["Features", "/features"], ["How it works", "/how-it-works"], ["Pricing", "/pricing"], ["Compare", "/compare"], ["Live demo", "/demo"]])}
          {col("Industries", INDUSTRIES.slice(0, 5).map((i) => [i.name, `/industries/${i.slug}`] as [string, string]))}
          {col("Company", [["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"], ["Log in", "/login"]])}
          {col("Legal", [["Privacy", "/privacy"], ["Terms", "/terms"], ["DPDP & data", "/privacy#dpdp"]])}
        </div>
        <div className="mt-16 overflow-hidden border-t border-white/10 pt-8">
          <p className="font-display text-[clamp(64px,17vw,230px)] font-bold leading-[0.8] tracking-tighter text-white/[0.07] select-none" aria-hidden>Stampwala</p>
        </div>
        <div className="flex flex-wrap justify-between gap-3 pb-10 pt-6 text-sm text-[#8fb5a2]">
          <span>© 2026 Stampwala. Made for Indian businesses.</span>
          <span>WhatsApp is a trademark of Meta. Stampwala is not affiliated with or endorsed by Meta.</span>
        </div>
      </div>
    </footer>
  );
}
