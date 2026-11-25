"use client";
import { useState } from "react";

export function Roi() {
  const [c, setC] = useState(80), [b, setB] = useState(220), [r, setR] = useState(30), [l, setL] = useState(10);
  const rev = Math.round(c * 30 * (r / 100) * (l / 100) * b);
  const f = (n: number) => "₹" + n.toLocaleString("en-IN");
  const row = (label: string, val: string, v: number, set: (n: number) => void, min: number, max: number, step = 1) => (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex justify-between text-[15px] font-semibold"><span>{label}</span><span className="text-leaf">{val}</span></div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} className="h-2 w-full cursor-pointer accent-[#25d366]" aria-label={label} />
    </div>
  );
  return (
    <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-[1.1fr_1fr]">
      <div className="card p-8">
        {row("Customers per day", String(c), c, setC, 10, 500)}
        {row("Average bill", f(b), b, setB, 50, 2000, 10)}
        {row("Share who are regulars", `${r}%`, r, setR, 5, 80)}
        {row("Extra visits thanks to loyalty", `${l}%`, l, setL, 2, 40)}
        <p className="mt-6 text-[12.5px] leading-relaxed text-muted">Formula: customers × 30 days × regular share × lift × average bill. A 10% lift is deliberately cautious — use a lower number if you prefer. Results vary by business.</p>
      </div>
      <div className="relative flex flex-col justify-center overflow-hidden rounded-[28px] bg-forest p-8 text-white md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-wa/25 blur-3xl" />
        <small className="relative text-sm text-[#bcd7c9]">Estimated extra sales per month</small>
        <b className="relative my-2 font-display text-[clamp(52px,7vw,82px)] leading-none text-[#9bf0bd]">{f(rev)}</b>
        <p className="relative text-[15px] leading-relaxed text-[#cfe3d8]">
          {rev > 599 ? `About ${(rev / 499).toFixed(1)}× the cost of the Growth plan (₹499/mo billed yearly). Even at half this lift, it covers itself.` : "At these numbers, start on the free Starter plan and see how your regulars respond."}
        </p>
      </div>
    </div>
  );
}
