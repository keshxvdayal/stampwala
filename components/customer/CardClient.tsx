"use client";
import { useCallback, useEffect, useState } from "react";

type Program = { goal: number; icon: string; color: string; reward: string; min: number; cooldown: number };
type Me = { stamps: number; goal: number; visits: number; tier: string; vouchers: number; voucher: string | null; code: { code: string; expires_at: number } | null; refCode: string };

export function CardClient({ slug, name, program: p, joined, firstName, refCode, waLink }: { slug: string; name: string; program: Program; joined: boolean; firstName: string | null; refCode: string; waLink: string | null }) {
  const [isIn, setIn] = useState(joined);
  const [me, setMe] = useState<Me | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [left, setLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [gone, setGone] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch(`/api/public/me?slug=${slug}`, { cache: "no-store" });
    if (r.ok) setMe(await r.json()); else if (r.status === 401) setIn(false);
  }, [slug]);
  useEffect(() => { if (isIn) { load(); const t = setInterval(load, 3000); return () => clearInterval(t); } }, [isIn, load]);
  useEffect(() => {
    if (!me?.code) return setLeft(0);
    const tick = () => setLeft(Math.max(0, Math.round((me.code!.expires_at - Date.now()) / 1000)));
    tick(); const t = setInterval(tick, 500); return () => clearInterval(t);
  }, [me?.code]);

  async function join(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/public/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, ...form, ref: refCode }) });
    const j = await r.json();
    if (j.ok) setIn(true); else setErr(j.error ?? "Couldn't join.");
    setBusy(false);
  }
  async function getCode() {
    setBusy(true); setNote("");
    const r = await fetch("/api/public/code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    const j = await r.json();
    if (j.ok === false) setNote(j.error ?? "");
    await load(); setBusy(false);
  }
  async function stop() {
    if (!confirm("Stop receiving messages from this business?")) return;
    await fetch("/api/public/optout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    setGone(true);
  }

  const stamps = me?.stamps ?? 0;
  const cols = (p.goal <= 6 ? p.goal : Math.ceil(p.goal / 2));
  const share = typeof window !== "undefined" && me ? `${location.origin}/j/${slug}?ref=${me.refCode}` : "";

  return (
    <div className="min-h-screen bg-paper pb-16">
      <div className="mx-auto max-w-md px-5 pt-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted">Member club</p>
        <h1 className="mt-1 text-center font-display text-3xl font-bold">{name}</h1>

        <div className="relative mt-6 overflow-hidden rounded-[28px] p-6 text-white shadow-[var(--shadow-pop)]" style={{ background: p.color }}>
          <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between">
            <div><div className="font-display text-xl font-bold">{isIn ? `Hi${firstName ? ", " + firstName : ""}!` : "Your loyalty card"}</div><div className="mt-0.5 text-sm opacity-80">{p.goal} stamps → {p.reward}</div></div>
            {me && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{me.tier}</span>}
          </div>
          <div className="dots !mt-6" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
            {Array.from({ length: p.goal }, (_, i) => <div key={i} className={`dot !text-2xl ${i < stamps ? "on" : i === p.goal - 1 ? "gift" : ""}`}>{i < stamps ? p.icon : i === p.goal - 1 ? "🎁" : ""}</div>)}
          </div>
          <div className="prog !h-2"><i style={{ width: `${Math.min((stamps / p.goal) * 100, 100)}%` }} /></div>
          <div className="relative mt-3 flex justify-between text-sm"><span>{stamps} of {p.goal}</span><span className="opacity-80">{me ? `${me.visits} visits` : ""}</span></div>
        </div>

        {gone ? (
          <div className="card mt-6 p-6 text-center"><b>You&apos;re unsubscribed.</b><p className="mt-1 text-sm text-ink-2">We won&apos;t message you again. You can rejoin any time.</p></div>
        ) : !isIn ? (
          <form onSubmit={join} className="card mt-6 p-6">
            <h2 className="h-md !text-xl">Join in 10 seconds</h2>
            <p className="mt-1 text-sm text-ink-2">No app, no password. Collect a stamp with every visit — {p.reward} after {p.goal}.</p>
            <label className="label" htmlFor="jn">Your name</label><input id="jn" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            <label className="label" htmlFor="jp">Mobile number</label><input id="jp" className="input" inputMode="tel" required placeholder="98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            {err && <p className="mt-3 text-sm font-medium text-tomato" role="alert">{err}</p>}
            <button className="btn btn-dark mt-5 w-full" disabled={busy}>{busy ? "Joining…" : "Join & get my card"}</button>
            <p className="mt-3 text-xs text-muted">By joining you agree to receive stamp updates and offers from {name} on WhatsApp. Reply STOP anytime.</p>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            {me?.voucher && (
              <div className="rounded-3xl border-2 border-dashed border-saffron bg-saffron-soft p-5 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-[#6b4300]">🎉 Reward ready</div>
                <div className="mt-1 font-mono text-3xl font-bold tracking-wider text-[#6b4300]">{me.voucher}</div>
                <p className="mt-1 text-sm text-[#6b4300]">Show this at the counter for your {p.reward}.</p>
              </div>
            )}
            <div className="card p-6 text-center">
              {me?.code && left > 0 ? (
                <>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted">Show this to the cashier</div>
                  <div className="my-3 rounded-2xl border-2 border-dashed border-leaf/50 bg-mint/60 py-4 font-mono text-5xl font-bold tracking-[0.3em] text-forest" aria-live="polite">{me.code.code}</div>
                  <div className="text-sm text-muted">Expires in {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</div>
                </>
              ) : (
                <>
                  <h2 className="h-md !text-xl">At the counter?</h2>
                  <p className="mt-1 text-sm text-ink-2">Tap below, then show the code to the cashier with your bill.</p>
                  <button onClick={getCode} className="btn btn-wa mt-5 w-full" disabled={busy}>{busy ? "…" : "Get my stamp code"}</button>
                  {note && <p className="mt-3 text-sm font-medium text-ink-2" role="status">{note}</p>}
                </>
              )}
            </div>
            <div className="card p-6">
              <h3 className="text-base font-bold !font-sans">Invite a friend</h3>
              <p className="mt-1 text-sm text-ink-2">When they make their first purchase, you both get a bonus stamp.</p>
              <button className="btn btn-line btn-sm mt-4" onClick={async () => { await navigator.clipboard?.writeText(share); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? "Copied ✓" : "Copy my invite link"}</button>
            </div>
            {waLink && <a href={waLink} className="btn btn-wa w-full">💬 Continue on WhatsApp</a>}
            <button onClick={stop} className="mx-auto block text-xs font-semibold text-muted underline">Stop messages from {name}</button>
          </div>
        )}
        <p className="mt-10 text-center text-xs text-muted">Powered by Stampwala · min. bill ₹{p.min} · one stamp every {p.cooldown}h</p>
      </div>
    </div>
  );
}
