import { Spark } from "./charts";

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight">{title}</h1>{sub && <p className="mt-1.5 text-ink-2">{sub}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
export function Kpi({ label, value, delta, hint, icon, spark }: { label: string; value: string; delta?: number | null; hint?: string; icon?: string; spark?: number[] }) {
  return (
    <div className="kpi">
      <div className="flex items-start justify-between">
        <small className="text-[13px] font-medium text-muted">{label}</small>
        {icon && <span className="grid size-9 place-items-center rounded-xl bg-wa/15 text-base">{icon}</span>}
      </div>
      <b className="mt-2 block font-display text-[34px] leading-none">{value}</b>
      <div className="mt-3 flex items-end justify-between gap-2">
        {delta !== undefined && delta !== null ? <i className={`text-[13px] font-bold not-italic ${delta >= 0 ? "text-leaf" : "text-tomato"}`}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% <span className="font-medium text-muted">vs prev. 30d</span></i> : <i className="text-[13px] not-italic text-muted">{hint}</i>}
        {spark && <Spark data={spark} color="#25d366" />}
      </div>
    </div>
  );
}
export const Panel = ({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <section className={`card !rounded-[22px] p-6 ${className}`}>
    {(title || action) && <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-base font-bold !font-sans !tracking-normal">{title}</h2>{action}</div>}
    {children}
  </section>
);
export const TierChip = ({ tier }: { tier: string }) => <span className={`chip ${tier === "Platinum" ? "" : tier === "Gold" ? "amber" : "gray"}`}>{tier}</span>;
