"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/ui/icons";

async function post(url: string, data: unknown = {}) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return r.json();
}

export function PinLogin({ slug, name, outlets }: { slug: string; name: string; outlets: { id: number; name: string }[] }) {
  const router = useRouter();
  const [outlet, setOutlet] = useState(outlets[0]?.id ?? 0);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  async function enter(p: string) {
    const j = await post("/api/terminal/login", { slug, outlet, pin: p });
    if (j.ok) router.refresh(); else { setErr(j.error); setPin(""); }
  }
  const press = (d: string) => { if (pin.length < 6) { const n = pin + d; setPin(n); setErr(""); } };
  return (
    <div className="grid min-h-screen place-items-center bg-forest px-5 text-white">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center"><Logo light /></div>
        <h1 className="mt-8 font-display text-3xl font-bold">{name}</h1>
        <p className="text-[#bcd7c9]">Counter terminal</p>
        {outlets.length > 1 && <select value={outlet} onChange={(e) => setOutlet(+e.target.value)} className="input mt-6 !bg-white/10 !text-white [&>option]:text-ink">{outlets.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>}
        <div className="my-7 flex justify-center gap-3" aria-label="PIN entered">{Array.from({ length: 6 }, (_, i) => <i key={i} className={`size-4 rounded-full border-2 ${i < pin.length ? "border-wa bg-wa" : "border-white/40"}`} />)}</div>
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "→"].map((k) => (
            <button key={k} onClick={() => (k === "⌫" ? setPin(pin.slice(0, -1)) : k === "→" ? pin.length >= 4 && enter(pin) : press(k))} className="h-16 rounded-2xl bg-white/10 text-2xl font-semibold transition-colors active:bg-white/25">{k}</button>
          ))}
        </div>
        <p className="mt-5 min-h-6 text-sm font-medium text-[#ffb4a0]" role="alert">{err}</p>
        <p className="mt-6 text-xs text-[#8fb5a2]">Demo PINs: Asha 1234 (manager) · Ravi 5678 — Indiranagar</p>
      </div>
    </div>
  );
}

type Recent = { at: number; bill: number; stamps_added: number; name: string | null };
export function TerminalClient({ slug, bizName, staff }: { slug: string; bizName: string; staff: { name: string; role: string; outlet: string } }) {
  const router = useRouter();
  const [code, setCode] = useState(""); const [bill, setBill] = useState("");
  const [phone, setPhone] = useState(""); const [mode, setMode] = useState<"code" | "phone" | "voucher">("code");
  const [voucher, setVoucher] = useState("");
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const r = await fetch("/api/terminal/lookup", { cache: "no-store" }); if (r.ok) setRecent((await r.json()).recent); }, []);
  useEffect(() => { load(); }, [load]);

  async function submit() {
    setBusy(true); setRes(null);
    let j;
    if (mode === "voucher") {
      j = await post("/api/terminal/redeem", { code: voucher });
      setRes(j.ok ? { ok: true, msg: `Redeemed: ${j.reward} for ${j.member.name ?? "customer"}.` } : { ok: false, msg: j.error });
      if (j.ok) setVoucher("");
    } else {
      j = await post("/api/terminal/stamp", mode === "code" ? { code, bill: +bill } : { phone, bill: +bill });
      if (j.ok) {
        setRes({ ok: true, msg: `+${j.added} stamp${j.added > 1 ? "s" : ""} for ${j.member.name ?? "customer"} (${j.stamps}/${j.goal})${j.vouchers.length ? ` — 🎉 reward ${j.vouchers[0]} issued` : ""}${j.happy ? " · happy hour" : ""}` });
        setCode(""); setBill(""); setPhone("");
      } else setRes({ ok: false, msg: j.error });
    }
    setBusy(false); load();
  }
  const ready = mode === "voucher" ? voucher.length >= 4 : (mode === "code" ? code.length === 4 : phone.length >= 10) && bill !== "";
  const tabs: [typeof mode, string][] = [["code", "Stamp by code"], ["voucher", "Redeem voucher"], ...(staff.role === "manager" ? [["phone", "By phone (manager)"] as [typeof mode, string]] : [])];
  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between bg-forest px-5 py-4 text-white">
        <div><b className="font-display text-xl">{bizName}</b><div className="text-xs text-[#bcd7c9]">{staff.outlet} · {staff.name} ({staff.role})</div></div>
        <button className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold" onClick={async () => { await post("/api/terminal/logout"); router.refresh(); }}>Sign out</button>
      </header>
      <div className="mx-auto grid max-w-4xl gap-6 p-5 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div className="card p-7">
          <div className="flex flex-wrap gap-2">{tabs.map(([k, l]) => <button key={k} onClick={() => { setMode(k); setRes(null); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === k ? "bg-forest text-white" : "bg-paper-2"}`}>{l}</button>)}</div>
          {mode === "voucher" ? (
            <><label className="label" htmlFor="v">Voucher code</label><input id="v" className="input !h-16 text-center font-mono !text-3xl uppercase tracking-widest" value={voucher} onChange={(e) => setVoucher(e.target.value.toUpperCase())} placeholder="VIP-XXXX" /></>
          ) : (
            <>
              {mode === "code" ? <><label className="label" htmlFor="c">Customer&apos;s 4-digit code</label><input id="c" autoFocus className="input !h-20 text-center font-mono !text-5xl tracking-[0.35em]" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="····" /></>
                : <><label className="label" htmlFor="p">Customer mobile number</label><input id="p" className="input !h-14 !text-xl" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" /><p className="mt-2 text-xs text-muted">Manual stamps are flagged in the audit trail.</p></>}
              <label className="label" htmlFor="bl">Bill amount (₹)</label><input id="bl" className="input !h-14 !text-xl" inputMode="numeric" value={bill} onChange={(e) => setBill(e.target.value.replace(/\D/g, ""))} placeholder="240" />
            </>
          )}
          <button onClick={submit} disabled={!ready || busy} className="btn btn-dark mt-6 w-full !h-14 !text-lg">{busy ? "…" : mode === "voucher" ? "Redeem" : "Verify & stamp"}</button>
          {res && <div role="status" className={`mt-4 rounded-2xl p-4 text-[15px] font-semibold ${res.ok ? "bg-mint text-forest" : "bg-[#fbd9ce] text-[#8a2a0c]"}`}>{res.ok ? "✅ " : "⚠️ "}{res.msg}</div>}
        </div>
        <div className="card p-7">
          <h2 className="text-base font-bold !font-sans">Recent at this outlet</h2>
          <ul className="mt-4 divide-y divide-line">
            {recent.length ? recent.map((r, i) => <li key={i} className="flex items-center justify-between py-3 text-sm"><span><b>{r.name ?? "Customer"}</b><small className="block text-muted">{new Date(r.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ₹{r.bill}</small></span><span className="chip">+{r.stamps_added}</span></li>) : <li className="py-3 text-sm text-muted">No stamps yet today.</li>}
          </ul>
          <p className="mt-5 text-xs text-muted">Terminal URL: <code>/t/{slug}</code> — bookmark it on the counter tablet.</p>
        </div>
      </div>
    </div>
  );
}
