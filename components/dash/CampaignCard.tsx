"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type C = { id: number; type: string; name: string; trigger_days: number; message: string; bonus_stamps: number; enabled: number; sent_count: number; last_run: number | null };
const HELP: Record<string, string> = { winback: "Sent to repeat customers who haven't visited for the number of days below.", birthday: "Sent on a member's birthday (once a year).", welcome: "Sent to new members who haven't made a first visit yet." };
const ICON: Record<string, string> = { winback: "🔁", birthday: "🎂", welcome: "👋" };

async function call(data: unknown) { const r = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); return r.json(); }

export function CampaignCard({ c }: { c: C }) {
  const router = useRouter();
  const [on, setOn] = useState(!!c.enabled);
  const [msg, setMsg] = useState(c.message);
  const [days, setDays] = useState(c.trigger_days);
  const [bonus, setBonus] = useState(c.bonus_stamps);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const preview = msg.replace("{name}", "Ananya").replace("{business}", "Brew & Co.").replace("{left}", "2").replace("{reward}", "free cappuccino");
  async function save() { setBusy(true); await call({ action: "save", id: c.id, message: msg, trigger_days: days, bonus_stamps: bonus }); setNote("Saved ✓"); setBusy(false); router.refresh(); }
  async function run() { setBusy(true); const j = await call({ action: "run", id: c.id }); setNote(j.ok ? `Sent to ${j.sent} customer${j.sent === 1 ? "" : "s"}.` : j.error); setBusy(false); router.refresh(); }
  return (
    <section className="rounded-[22px] border border-line bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mint text-2xl">{ICON[c.type] ?? "📣"}</div>
        <div className="min-w-0 flex-1"><h2 className="text-lg font-bold !font-sans">{c.name}</h2><p className="text-sm text-muted">{HELP[c.type]}</p><p className="mt-1 text-xs text-muted">{c.sent_count} sent in total{c.last_run ? "" : ""}</p></div>
        <button role="switch" aria-checked={on} aria-label={`${c.name} enabled`} onClick={async () => { setOn(!on); await call({ action: "toggle", id: c.id, enabled: !on }); router.refresh(); }} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-wa-dark" : "bg-[#cfc7b6]"}`}><span className={`absolute left-[3px] top-[3px] size-[22px] rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} /></button>
      </div>
      <div className="mt-5 grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <label className="label !mt-0" htmlFor={`m${c.id}`}>Message</label>
          <textarea id={`m${c.id}`} rows={4} className="input" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <p className="mt-1 text-xs text-muted">Variables: {"{name} {business} {left} {reward}"}</p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            {c.type !== "birthday" && <div><label className="label !mt-0" htmlFor={`d${c.id}`}>{c.type === "winback" ? "After days quiet" : "Days after joining"}</label><input id={`d${c.id}`} type="number" min={1} className="input" value={days} onChange={(e) => setDays(+e.target.value)} /></div>}
            <div><label className="label !mt-0" htmlFor={`b${c.id}`}>Bonus stamps</label><input id={`b${c.id}`} type="number" min={0} max={5} className="input" value={bonus} onChange={(e) => setBonus(+e.target.value)} /></div>
          </div>
        </div>
        <div className="rounded-2xl bg-[#0b141a] p-4"><div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">Preview</div><div className="msg in !max-w-full">{preview}<time>now</time></div></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button className="btn btn-dark btn-sm" onClick={save} disabled={busy}>Save</button>
        <button className="btn btn-line btn-sm" onClick={run} disabled={busy || !on}>Run now</button>
        <span className="text-sm font-semibold text-leaf" role="status">{note}</span>
      </div>
    </section>
  );
}
