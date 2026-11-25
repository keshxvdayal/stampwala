import { FAQS } from "@/lib/content";
import { Plus } from "@/components/ui/icons";

export function Faq({ limit }: { limit?: number }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {FAQS.slice(0, limit).map(([q, a], i) => (
        <details key={q} open={i === 0} className="card group px-6 py-5 [&[open]]:shadow-[var(--shadow-pop)]">
          <summary className="flex items-center justify-between gap-4 text-[17px] font-semibold">
            {q}<span className="plus grid size-8 shrink-0 place-items-center rounded-full bg-mint text-forest transition-transform"><Plus size={16} /></span>
          </summary>
          <p className="mt-3 pr-10 leading-relaxed text-ink-2">{a}</p>
        </details>
      ))}
    </div>
  );
}
