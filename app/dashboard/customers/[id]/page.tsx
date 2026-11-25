import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireBusiness } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { getProgram, tierOf, type Member } from "@/lib/loyalty";
import { PageHead, Panel, TierChip } from "@/components/dash/bits";
import { NudgeButton } from "@/components/dash/NudgeButton";
import { ago, day, dt, phoneFmt } from "@/lib/format";
import { inr } from "@/lib/stats";

export const metadata: Metadata = { title: "Customer" };

export default async function CustomerPage({ params }: PageProps<"/dashboard/customers/[id]">) {
  const b = await requireBusiness();
  const { id } = await params;
  const m = get<Member>("SELECT * FROM members WHERE id=? AND business_id=?", Number(id), b.id);
  if (!m) notFound();
  const p = getProgram(b.id);
  const visits = all<{ at: number; bill: number; stamps_added: number; method: string; outlet: string | null; staff: string | null }>(
    `SELECT v.at,v.bill,v.stamps_added,v.method,o.name outlet,s.name staff FROM visits v LEFT JOIN outlets o ON o.id=v.outlet_id LEFT JOIN staff s ON s.id=v.staff_id WHERE v.member_id=? ORDER BY v.at DESC LIMIT 15`, m.id);
  const vouchers = all<{ code: string; status: string; created_at: number; redeemed_at: number | null }>("SELECT code,status,created_at,redeemed_at FROM vouchers WHERE member_id=? ORDER BY id DESC LIMIT 8", m.id);
  const msgs = all<{ direction: string; kind: string; body: string; at: number; status: string }>("SELECT direction,kind,body,at,status FROM messages WHERE member_id=? ORDER BY id DESC LIMIT 8", m.id);
  const avg = m.total_visits ? Math.round(m.total_spend / m.total_visits) : 0;

  return (
    <>
      <Link href="/dashboard/customers" className="text-sm font-semibold text-muted hover:text-ink">← Customers</Link>
      <PageHead title={m.name ?? phoneFmt(m.phone)} sub={`${phoneFmt(m.phone)} · joined ${day(m.created_at)} · prefers ${m.lang === "hi" ? "हिन्दी" : "English"}`}>
        {!m.opted_out ? <NudgeButton id={m.id} label="Send win-back message" /> : <span className="chip red">Opted out of messages</span>}
      </PageHead>
      <div className="grid gap-4 md:grid-cols-4">
        {[["Tier", <TierChip key="t" tier={tierOf(m, p)} />], ["Stamps", `${m.stamps} / ${p.goal}`], ["Lifetime spend", `${inr(m.total_spend)}`], ["Avg. bill", inr(avg)]].map(([l, v]) => (
          <div key={String(l)} className="kpi"><small className="text-[13px] text-muted">{l}</small><div className="mt-1 font-display text-3xl font-bold">{v}</div></div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title={`Visit history · last visit ${ago(m.last_visit)}`}>
          <ul className="divide-y divide-line text-sm">
            {visits.map((v, i) => <li key={i} className="flex items-center justify-between py-3"><span><b>{dt(v.at)}</b><small className="block text-muted">{v.outlet ?? "—"} · {v.staff ?? "—"}{v.method === "manual" ? " · manual" : ""}</small></span><span className="text-right"><b>{inr(v.bill)}</b><small className="block text-leaf">+{v.stamps_added}</small></span></li>)}
            {!visits.length && <li className="py-6 text-center text-muted">No visits yet.</li>}
          </ul>
        </Panel>
        <div className="space-y-5">
          <Panel title="Rewards">
            {vouchers.length ? <ul className="divide-y divide-line text-sm">{vouchers.map((v) => <li key={v.code} className="flex items-center justify-between py-3"><span><b className="font-mono">{v.code}</b><small className="block text-muted">Issued {day(v.created_at)}</small></span><span className={`chip ${v.status === "active" ? "amber" : ""}`}>{v.status}</span></li>)}</ul> : <p className="py-4 text-muted">No rewards earned yet.</p>}
          </Panel>
          <Panel title="Message history">
            <ul className="space-y-3 text-sm">
              {msgs.map((x, i) => <li key={i} className={`rounded-2xl p-3 ${x.direction === "in" ? "bg-paper-2" : "bg-mint/60"}`}><div className="mb-1 flex justify-between text-xs text-muted"><span className="font-bold uppercase">{x.kind}</span><span>{dt(x.at)} · {x.status}</span></div>{x.body}</li>)}
              {!msgs.length && <li className="py-4 text-muted">No messages yet.</li>}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
