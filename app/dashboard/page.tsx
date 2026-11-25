import Link from "next/link";
import { requireBusiness } from "@/lib/auth";
import { overview, dailySeries, weekday, topMembers, recentActivity, inr } from "@/lib/stats";
import { atRisk, getProgram, tierOf } from "@/lib/loyalty";
import { AreaChart, BarChart } from "@/components/dash/charts";
import { Kpi, Panel } from "@/components/dash/bits";
import { PageHead } from "@/components/dash/bits";
import { NudgeButton } from "@/components/dash/NudgeButton";
import { ago, phoneFmt } from "@/lib/format";
import { get } from "@/lib/db";

export default async function Overview({ searchParams }: PageProps<"/dashboard">) {
  const b = await requireBusiness();
  const sp = await searchParams;
  const o = overview(b.id);
  const series = dailySeries(b.id, 30);
  const p = getProgram(b.id);
  const risk = atRisk(b.id, 21, 5);
  const top = topMembers(b.id, 5);
  const recent = recentActivity(b.id, 7);
  const staffCount = get<{ n: number }>("SELECT COUNT(*) n FROM staff WHERE business_id=? AND active=1", b.id)!.n;
  const fresh = o.members === 0;
  const steps = [
    ["Design your card", "/dashboard/program", true],
    ["Add staff PINs", "/dashboard/team", staffCount > 1],
    ["Print your QR stand", "/dashboard/qr", false],
    ["Stamp your first customer", `/t/${b.slug}`, o.visits > 0],
  ] as const;

  return (
    <>
      <PageHead title={sp.welcome ? `Welcome, ${b.owner_name.split(" ")[0]} 👋` : "Overview"} sub={`How ${b.name} is doing over the last 30 days.`}>
        <Link href={`/t/${b.slug}`} target="_blank" className="btn btn-dark btn-sm">Open counter terminal ↗</Link>
      </PageHead>

      {fresh && (
        <Panel title="Get live in four steps" className="mb-6 !border-saffron !bg-saffron-soft/50">
          <ol className="grid gap-3 md:grid-cols-4">
            {steps.map(([t, h, done], i) => <li key={t}><Link href={h} className="flex h-full items-center gap-3 rounded-2xl bg-card p-4 font-semibold transition-shadow hover:shadow-[var(--shadow-soft)]"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-wa text-[#05301a]" : "bg-paper-2"}`}>{done ? "✓" : i + 1}</span>{t}</Link></li>)}
          </ol>
        </Panel>
      )}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi icon="👣" label="Visits" value={o.visits.toLocaleString("en-IN")} delta={o.visitsDelta} spark={series.slice(-14).map((x) => x.visits)} />
        <Kpi icon="💰" label="Revenue from members" value={inr(o.revenue)} delta={o.revenueDelta} spark={series.slice(-14).map((x) => x.revenue)} />
        <Kpi icon="🔁" label="Repeat-customer rate" value={`${o.repeatRate}%`} hint={`${o.members} members · ${o.newMembers} new`} />
        <Kpi icon="🎁" label="Rewards redeemed" value={`${o.vouchersRedeemed}`} hint={`${o.redemptionRate}% of ${o.vouchersIssued} issued`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Visits per day"><AreaChart data={series.map((s) => s.visits)} labels={series.map((s) => new Date(s.t).toLocaleDateString("en-IN", { day: "numeric", month: "short" }))} height={220} /></Panel>
        <Panel title="Busiest weekdays (8 weeks)"><BarChart data={weekday(b.id)} highlight height={190} /></Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="⚠️ At risk of leaving" action={<Link href="/dashboard/campaigns" className="text-sm font-semibold text-leaf">Automate →</Link>}>
          <p className="-mt-2 mb-3 text-sm text-muted">Repeat visitors silent for 21+ days.</p>
          {risk.length ? (
            <ul className="divide-y divide-line">
              {risk.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/dashboard/customers/${m.id}`} className="min-w-0"><b className="block truncate">{m.name ?? phoneFmt(m.phone)}</b><small className="text-muted">Last visit {ago(m.last_visit)} · {m.stamps}/{p.goal} stamps · {tierOf(m, p)}</small></Link>
                  <NudgeButton id={m.id} />
                </li>
              ))}
            </ul>
          ) : <p className="py-6 text-center text-muted">Nobody at risk right now. 🎉</p>}
        </Panel>
        <Panel title="Recent stamps">
          {recent.length ? (
            <ul className="divide-y divide-line">
              {recent.map((r, i) => <li key={i} className="flex items-center justify-between py-3 text-sm"><span><b>{r.name ?? "Customer"}</b><small className="block text-muted">{ago(r.at)} · {r.outlet ?? "—"} · {r.staff ?? "—"}{r.method === "manual" ? " · manual" : ""}</small></span><span className="text-right"><b>{inr(r.bill)}</b><small className="block text-leaf">+{r.stamps_added} stamp</small></span></li>)}
            </ul>
          ) : <p className="py-6 text-center text-muted">No stamps yet. Open the counter terminal to issue the first one.</p>}
        </Panel>
      </div>

      <Panel title="Top customers by spend" className="mt-5" action={<Link href="/dashboard/customers" className="text-sm font-semibold text-leaf">All customers →</Link>}>
        {top.length ? <div className="overflow-x-auto"><table className="tbl"><thead><tr><th>Customer</th><th>Visits</th><th>Total spend</th></tr></thead><tbody>{top.map((m) => <tr key={m.id}><td><Link href={`/dashboard/customers/${m.id}`} className="font-semibold hover:text-leaf">{m.name ?? phoneFmt(m.phone)}</Link></td><td>{m.total_visits}</td><td>{inr(m.total_spend)}</td></tr>)}</tbody></table></div> : <p className="py-6 text-center text-muted">Your best customers will show up here.</p>}
      </Panel>
    </>
  );
}
