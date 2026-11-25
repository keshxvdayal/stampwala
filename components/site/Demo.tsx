"use client";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#0B3B2C", "#7B2D26", "#1F3A93", "#5B2A86", "#B4530B", "#111111"];
const ICONS = ["☕", "🍕", "🍰", "💈", "🛍️", "🧁"];
const COOL = 4 * 3600e3;
type M = { id: number; from: "in" | "out"; html: string; time: string; card?: number; typing?: boolean };
const T = {
  en: { code: (b: string) => `Welcome to the <b>${b} Club</b>! Show this code to the cashier. It expires in 2 minutes:`, stamp: (n: number, l: number, r: string) => `✅ <b>+${n} stamp${n > 1 ? "s" : ""}</b> added!<br>${l > 0 ? `${l} more for your <b>${r}</b>.` : "Your card is full!"}`, reward: (c: string, r: string) => `🎉 <b>Reward unlocked!</b> Your <b>${r}</b>:<span class="vouch">${c}</span>`, cool: (m: string) => `You've already been stamped today 😊 Next stamp in <b>${m}</b>. Keeps it fair for everyone.`, small: (m: number) => `That bill is under ₹${m}, so it doesn't earn a stamp this time.`, ref: `👥 Share this link with a friend: <b>wa.me/join/ANU-24</b><br>After their first purchase, you both get <b>+1 bonus stamp</b>.`, redeemed: (r: string) => `🥳 Enjoy your <b>${r}</b>! A fresh card is ready.`, hello: "Hi! 👋 Tap <b>Scan counter QR</b> below to begin.", lang: "हिन्दी" },
  hi: { code: (b: string) => `<b>${b} क्लब</b> में स्वागत है! यह कोड कैशियर को दिखाइए। 2 मिनट में बदल जाएगा:`, stamp: (n: number, l: number, r: string) => `✅ <b>+${n} स्टैम्प</b> जुड़ गया!<br>${l > 0 ? `<b>${r}</b> के लिए ${l} और चाहिए।` : "आपका कार्ड भर गया!"}`, reward: (c: string, r: string) => `🎉 <b>इनाम मिल गया!</b> आपका <b>${r}</b>:<span class="vouch">${c}</span>`, cool: (m: string) => `आज आपका स्टैम्प लग चुका है 😊 अगला स्टैम्प <b>${m}</b> बाद।`, small: (m: number) => `यह बिल ₹${m} से कम है, इसलिए इस बार स्टैम्प नहीं मिलेगा।`, ref: `👥 दोस्त को यह लिंक भेजिए: <b>wa.me/join/ANU-24</b><br>उसकी पहली खरीद पर <b>आप दोनों को +1 बोनस स्टैम्प</b>।`, redeemed: (r: string) => `🥳 <b>${r}</b> का मज़ा लीजिए! नया कार्ड तैयार है।`, hello: "नमस्ते! 👋 शुरू करने के लिए नीचे <b>Scan counter QR</b> दबाइए।", lang: "English" },
};
const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function Demo() {
  const [cfg, setCfg] = useState({ biz: "Brew & Co.", goal: 6, icon: "☕", color: COLORS[0], reward: "free cappuccino", min: 100 });
  const [stamps, setStamps] = useState(0);
  const [msgs, setMsgs] = useState<M[]>([]);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [code, setCode] = useState<{ v: string; at: number } | null>(null);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const [shift, setShift] = useState(0);
  const [happy, setHappy] = useState(false);
  const [refUsed, setRefUsed] = useState(false);
  const [inp, setInp] = useState("");
  const [bill, setBill] = useState("240");
  const [err, setErr] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const id = useRef(1);
  const chat = useRef<HTMLDivElement>(null);
  const tx = T[lang];
  const clock = () => Date.now() + shift;
  const L = (s: string) => setLog((l) => [`${now()} · ${s}`, ...l].slice(0, 12));

  useEffect(() => { chat.current?.scrollTo({ top: chat.current.scrollHeight, behavior: "smooth" }); }, [msgs]);
  useEffect(() => { reset(); /* eslint-disable-next-line */ }, [cfg.goal]);

  const push = (m: Omit<M, "id" | "time">) => { const nid = id.current++; setMsgs((x) => [...x, { ...m, id: nid, time: now() }]); };
  const bot = async (html: string, card?: number, ms = 650) => {
    const tid = id.current++;
    setMsgs((x) => [...x, { id: tid, from: "in", html: "", time: "", typing: true }]);
    await new Promise((r) => setTimeout(r, ms));
    setMsgs((x) => x.filter((m) => m.id !== tid));
    push({ from: "in", html, card });
  };
  function reset() {
    setStamps(0); setCode(null); setVoucher(null); setLast(null); setShift(0); setRefUsed(false); setErr("");
    { const nid = id.current++; setMsgs([{ id: nid, from: "in", html: T[lang].hello, time: now() }]); }
  }

  async function scan() {
    if (busy) return; setBusy(true);
    push({ from: "out", html: "📷 <i>Scanned counter QR</i>" });
    if (last && clock() - last < COOL) {
      const m = Math.ceil((COOL - (clock() - last)) / 60000);
      await bot(tx.cool(m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`)); L("🚫 Repeat scan blocked (cooldown)"); setBusy(false); return;
    }
    const c = String(Math.floor(1000 + Math.random() * 9000));
    setCode({ v: c, at: clock() }); setInp("");
    await bot(`${tx.code(cfg.biz)}<span class="code">${c}</span>`);
    L(`Customer scanned · code ${c} issued`); setBusy(false);
  }
  async function doStamp() {
    setErr("");
    if (!code) return setErr("No active code. Ask the customer to scan first.");
    if (clock() - code.at > 120000) { setCode(null); return setErr("Code expired. Ask them to scan again."); }
    if (inp.trim() !== code.v) { L("🚫 Wrong code entered"); return setErr("Wrong code. Nothing was stamped."); }
    const b = +bill || 0;
    if (b < cfg.min) { setErr(`Bill below the ₹${cfg.min} minimum.`); L(`Bill ₹${b} below minimum`); setCode(null); await bot(tx.small(cfg.min), undefined, 400); return; }
    const n = happy ? 2 : 1;
    const s = Math.min(stamps + n, cfg.goal);
    setCode(null); setInp(""); setLast(clock()); setStamps(s); L(`✅ Stamped ${n}× on a ₹${b} bill`);
    await bot(tx.stamp(n, cfg.goal - s, cfg.reward), s, 450);
    if (s >= cfg.goal) { const v = "VIP-" + Math.random().toString(36).slice(2, 6).toUpperCase(); setVoucher(v); await bot(tx.reward(v, cfg.reward), undefined, 800); L(`🎁 Voucher ${v} issued`); }
  }
  async function redeem() {
    setErr("");
    if (!voucher) return setErr("No voucher yet on this card.");
    L(`🥳 Voucher ${voucher} redeemed`); setVoucher(null); setStamps(0); setLast(null);
    await bot(tx.redeemed(cfg.reward), 0, 500);
  }
  async function refer() {
    push({ from: "out", html: "👥 Refer a friend" }); await bot(tx.ref);
    if (!refUsed && stamps < cfg.goal) { setRefUsed(true); await new Promise((r) => setTimeout(r, 900)); setStamps(stamps + 1); push({ from: "in", html: "🎁 <i>Your friend joined &amp; bought!</i> <b>+1 bonus stamp</b> for you." }); L("👥 Referral bonus +1"); }
  }

  const dots = (n: number) => Array.from({ length: cfg.goal }, (_, i) => (
    <div key={i} className={`dot ${i < n ? "on" : ""} ${i === cfg.goal - 1 && i >= n ? "gift" : ""}`}>{i < n ? cfg.icon : i === cfg.goal - 1 ? "🎁" : ""}</div>
  ));
  const cols = (cfg.goal <= 6 ? cfg.goal : Math.ceil(cfg.goal / 2));
  const Card = ({ n }: { n: number }) => (
    <div className="scard" style={{ ["--cardc" as string]: cfg.color }}>
      <div className="relative z-[1] font-display text-[15px] font-bold">{cfg.biz} Club</div>
      <div className="relative z-[1] text-[11px] opacity-85">{n} of {cfg.goal} stamps</div>
      <div className="dots" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>{dots(n)}</div>
      <div className="prog"><i style={{ width: `${Math.min((n / cfg.goal) * 100, 100)}%` }} /></div>
    </div>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px_1fr]">
      {/* designer */}
      <div className="card p-6">
        <h3 className="text-lg font-bold !font-sans">1 · Design your card</h3>
        <p className="mt-1 text-sm text-muted">The phone updates live.</p>
        <label className="label">Business name</label>
        <input className="input" value={cfg.biz} maxLength={22} onChange={(e) => setCfg({ ...cfg, biz: e.target.value || "Your Shop" })} />
        <label className="label">Stamps needed</label>
        <div className="flex flex-wrap gap-2">{[5, 6, 8, 10].map((g) => <button key={g} onClick={() => setCfg({ ...cfg, goal: g })} className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm font-semibold ${cfg.goal === g ? "border-wa/70 bg-wa/20 text-white" : "border-line bg-paper-2"}`}>{g}</button>)}</div>
        <label className="label">Stamp icon</label>
        <div className="flex flex-wrap gap-2">{ICONS.map((i) => <button key={i} onClick={() => setCfg({ ...cfg, icon: i })} className={`rounded-full border-[1.5px] px-3 py-1.5 text-lg ${cfg.icon === i ? "border-wa/70 bg-wa/20" : "border-line bg-paper-2"}`}>{i}</button>)}</div>
        <label className="label">Colour</label>
        <div className="flex gap-2">{COLORS.map((c) => <button key={c} aria-label={c} onClick={() => setCfg({ ...cfg, color: c })} className="size-9 rounded-full border-[3px] border-white transition-transform" style={{ background: c, boxShadow: cfg.color === c ? "0 0 0 2.5px #10201a" : "0 0 0 1.5px #e3d8c0", transform: cfg.color === c ? "scale(1.12)" : "none" }} />)}</div>
        <label className="label">Reward</label>
        <input className="input" value={cfg.reward} maxLength={26} onChange={(e) => setCfg({ ...cfg, reward: e.target.value || "free treat" })} />
        <label className="label">Minimum bill for a stamp (₹)</label>
        <input className="input" type="number" min={0} step={10} value={cfg.min} onChange={(e) => setCfg({ ...cfg, min: +e.target.value || 0 })} />
        <div className="mt-6"><Card n={stamps} /></div>
      </div>

      {/* phone */}
      <div>
        <div className="phone"><div className="screen">
          <div className="wa-head">
            <div className="grid size-9 place-items-center rounded-full bg-white text-lg">{cfg.icon}</div>
            <div><b className="block text-[14.5px] leading-tight">{cfg.biz} Club</b><small className="text-[11px] opacity-85">Official business account</small></div>
          </div>
          <div ref={chat} className="chat">
            {msgs.map((m) => m.typing ? <div key={m.id} className="msg in typing"><i /><i /><i /></div> : (
              <div key={m.id} className={`msg ${m.from}`}>
                {m.card !== undefined ? <><div dangerouslySetInnerHTML={{ __html: m.html }} /><div className="mt-2"><Card n={m.card} /></div></> : <div dangerouslySetInnerHTML={{ __html: m.html }} />}
                <time>{m.time}{m.from === "out" ? " ✓✓" : ""}</time>
              </div>
            ))}
          </div>
          <div className="quick">
            <button onClick={scan}>📷 Scan counter QR</button>
            <button onClick={refer}>👥 Refer a friend</button>
            <button onClick={() => push({ from: "in", html: "", card: stamps })}>🎴 My card</button>
            <button onClick={() => { const n = lang === "en" ? "hi" : "en"; setLang(n); push({ from: "out", html: n === "hi" ? "भाषा: हिन्दी" : "Language: English" }); }}>🌐 {tx.lang}</button>
          </div>
        </div></div>
        <p className="mt-4 text-center text-sm font-medium text-white/70">👆 You are the customer</p>
      </div>

      {/* cashier */}
      <div className="card p-6">
        <h3 className="text-lg font-bold !font-sans">2 · Cashier screen</h3>
        <p className="mt-1 text-sm text-muted">Any phone, tablet or laptop. No hardware.</p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/60 p-4 text-white">
          <small className="text-[11px] font-bold uppercase tracking-widest opacity-60">Customer&apos;s code</small>
          <b className="mt-1 block font-mono text-3xl tracking-[0.3em] text-wa">{code ? code.v : "· · · ·"}</b>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div><label className="label !mt-0">Enter code</label><input className="input font-mono tracking-widest" maxLength={4} inputMode="numeric" value={inp} onChange={(e) => setInp(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && doStamp()} placeholder="4 digits" /></div>
          <div><label className="label !mt-0">Bill (₹)</label><input className="input" type="number" value={bill} onChange={(e) => setBill(e.target.value)} /></div>
        </div>
        <button onClick={() => { setHappy(!happy); L(!happy ? "⚡ Happy hour ON (2×)" : "Happy hour off"); }} className="mt-4 flex items-center gap-3 text-sm font-semibold">
          <span className={`relative h-6 w-[42px] rounded-full transition-colors ${happy ? "bg-wa-dark" : "bg-[#cfc7b6]"}`}><span className={`absolute left-[3px] top-[3px] size-[18px] rounded-full bg-white transition-transform ${happy ? "translate-x-[18px]" : ""}`} /></span>
          Happy hour — 2× stamps
        </button>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="btn btn-dark btn-sm" onClick={doStamp}>Verify &amp; stamp</button>
          <button className="btn btn-line btn-sm" onClick={redeem}>Redeem voucher</button>
        </div>
        <div className="mt-2 min-h-5 text-[13px] font-medium text-tomato" role="alert">{err}</div>
        <button onClick={() => { setShift((s) => s + COOL + 1000); push({ from: "in", html: "<i>— 4 hours later —</i>" }); L("⏩ Skipped 4 hours"); }} className="mt-1 rounded-full border border-line bg-paper-2 px-3 py-1.5 text-[12.5px] font-semibold">⏩ Simulate next visit (4 hrs later)</button>
        <button onClick={reset} className="ml-2 mt-1 text-[12.5px] font-semibold text-muted underline">Reset</button>
        <div className="mt-4 max-h-36 space-y-1 overflow-auto border-t border-dashed border-line pt-3 text-[13px] text-muted">
          {log.length ? log.map((l, i) => <div key={i}>{l}</div>) : <div>Activity shows here…</div>}
        </div>
      </div>
    </div>
  );
}
