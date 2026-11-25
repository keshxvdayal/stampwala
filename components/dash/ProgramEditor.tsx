"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type P = { name: string; goal: number; icon: string; color: string; reward: string; min_bill: number; cooldown_hours: number; happy_days: string; happy_mult: number; referral_bonus: number; gold_at: number; platinum_at: number };
const COLORS = ["#0B3B2C", "#7B2D26", "#1F3A93", "#5B2A86", "#B4530B", "#111111", "#0E7490", "#BE185D"];
const ICONS = ["☕", "🍕", "🍰", "💈", "🛍️", "🧁", "🍔", "🍜", "🥐", "🏋️", "💅", "🌸"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ProgramEditor({ initial }: { initial: P }) {
  const router = useRouter();
  const [p, setP] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | string>("idle");
  const set = <K extends keyof P>(k: K, v: P[K]) => { setP({ ...p, [k]: v }); setState("idle"); };
  const days = p.happy_days.split(",").filter(Boolean);
  const cols = (p.goal <= 6 ? p.goal : Math.ceil(p.goal / 2));
  async function save() {
    setState("saving");
    const r = await fetch("/api/program", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    const j = await r.json();
    if (j.ok) { setState("saved"); router.refresh(); } else setState(j.error ?? "Couldn't save.");
  }
  const Chip = ({ on, children, ...r }: { on: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => <button type="button" {...r} className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold ${on ? "border-wa/70 bg-wa/20 text-white" : "border-line bg-paper-2"}`}>{children}</button>;
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <div className="space-y-5">
        <section className="rounded-[22px] border border-line bg-card p-6">
          <h2 className="text-base font-bold !font-sans">Card design</h2>
          <label className="label" htmlFor="pn">Business name</label><input id="pn" className="input" value={p.name} onChange={(e) => set("name", e.target.value)} />
          <label className="label">Stamps to earn a reward</label>
          <div className="flex flex-wrap gap-2">{[4, 5, 6, 8, 10, 12].map((g) => <Chip key={g} on={p.goal === g} onClick={() => set("goal", g)}>{g}</Chip>)}</div>
          <label className="label">Stamp icon</label>
          <div className="flex flex-wrap gap-2">{ICONS.map((i) => <button type="button" key={i} onClick={() => set("icon", i)} className={`rounded-xl border-[1.5px] px-3 py-1.5 text-xl ${p.icon === i ? "border-wa/70 bg-wa/20" : "border-line bg-paper-2"}`}>{i}</button>)}</div>
          <label className="label">Card colour</label>
          <div className="flex flex-wrap gap-2.5">{COLORS.map((c) => <button type="button" key={c} aria-label={`Colour ${c}`} onClick={() => set("color", c)} className="size-9 rounded-full border-[3px] border-white" style={{ background: c, boxShadow: p.color === c ? "0 0 0 2.5px #10201a" : "0 0 0 1.5px #e3d8c0" }} />)}</div>
          <label className="label" htmlFor="pr">Reward</label><input id="pr" className="input" value={p.reward} maxLength={40} onChange={(e) => set("reward", e.target.value)} />
        </section>
        <section className="rounded-[22px] border border-line bg-card p-6">
          <h2 className="text-base font-bold !font-sans">Anti-fraud rules</h2>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="mb">Minimum bill for a stamp (₹)</label><input id="mb" type="number" min={0} className="input" value={p.min_bill} onChange={(e) => set("min_bill", +e.target.value)} /></div>
            <div><label className="label" htmlFor="cd">Cooldown between stamps (hours)</label><input id="cd" type="number" min={0} max={72} className="input" value={p.cooldown_hours} onChange={(e) => set("cooldown_hours", +e.target.value)} /></div>
          </div>
          <p className="mt-3 text-[13px] text-muted">Codes always expire after 2 minutes and work once.</p>
        </section>
        <section className="rounded-[22px] border border-line bg-card p-6">
          <h2 className="text-base font-bold !font-sans">Growth levers</h2>
          <label className="label">Happy-hour days</label>
          <div className="flex flex-wrap gap-2">{DAYS.map((d, i) => <Chip key={d} on={days.includes(String(i))} onClick={() => set("happy_days", (days.includes(String(i)) ? days.filter((x) => x !== String(i)) : [...days, String(i)]).sort().join(","))}>{d}</Chip>)}</div>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="hm">Stamps on happy-hour days</label><select id="hm" className="input" value={p.happy_mult} onChange={(e) => set("happy_mult", +e.target.value)}>{[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}× stamps</option>)}</select></div>
            <div><label className="label" htmlFor="rb">Referral bonus (stamps each)</label><input id="rb" type="number" min={0} max={5} className="input" value={p.referral_bonus} onChange={(e) => set("referral_bonus", +e.target.value)} /></div>
            <div><label className="label" htmlFor="ga">Gold tier from (visits)</label><input id="ga" type="number" min={2} className="input" value={p.gold_at} onChange={(e) => set("gold_at", +e.target.value)} /></div>
            <div><label className="label" htmlFor="pa">Platinum tier from (visits)</label><input id="pa" type="number" min={3} className="input" value={p.platinum_at} onChange={(e) => set("platinum_at", +e.target.value)} /></div>
          </div>
        </section>
        <div className="flex items-center gap-4">
          <button onClick={save} className="btn btn-dark" disabled={state === "saving"}>{state === "saving" ? "Saving…" : "Save changes"}</button>
          {state === "saved" && <span className="text-sm font-bold text-leaf" role="status">Saved ✓</span>}
          {state !== "idle" && state !== "saving" && state !== "saved" && <span className="text-sm font-medium text-tomato" role="alert">{state}</span>}
        </div>
      </div>
      <div className="xl:sticky xl:top-8 xl:self-start">
        <div className="rounded-[22px] border border-line bg-card p-6">
          <h2 className="text-base font-bold !font-sans">Live preview</h2>
          <div className="relative mt-4 overflow-hidden rounded-[24px] p-6 text-white shadow-[var(--shadow-soft)]" style={{ background: p.color }}>
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
            <div className="relative font-display text-xl font-bold">{p.name} Club</div>
            <div className="relative text-sm opacity-80">{p.goal} stamps → {p.reward}</div>
            <div className="dots !mt-5" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>{Array.from({ length: p.goal }, (_, i) => <div key={i} className={`dot !text-2xl ${i < Math.ceil(p.goal * 0.6) ? "on" : i === p.goal - 1 ? "gift" : ""}`}>{i < Math.ceil(p.goal * 0.6) ? p.icon : i === p.goal - 1 ? "🎁" : ""}</div>)}</div>
            <div className="prog !h-2"><i style={{ width: "60%" }} /></div>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-ink-2">
            <li>🔐 1 stamp per customer every <b>{p.cooldown_hours}h</b>, min bill <b>₹{p.min_bill}</b></li>
            <li>⚡ {days.length ? <><b>{p.happy_mult}×</b> stamps on {days.map((d) => DAYS[+d]).join(", ")}</> : "No happy-hour days set"}</li>
            <li>👥 Referral: <b>+{p.referral_bonus}</b> stamp for both friends</li>
            <li>🥇 Gold at <b>{p.gold_at}</b> visits · Platinum at <b>{p.platinum_at}</b></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
