import type { Metadata } from "next";
import { requireBusiness } from "@/lib/auth";
import { cohorts, dailySeries, hourly, inr, outletBreakdown, overview, tierSplit, weekday } from "@/lib/stats";
import { getProgram } from "@/lib/loyalty";
import { PageHead, Panel, Kpi } from "@/components/dash/bits";
import { AreaChart, BarChart, Donut, Heat } from "@/components/dash/charts";

export const metadata: Metadata = { title: "Analytics" };
export default async function Analytics() {
  const b = await requireBusiness();
  const p = getProgram(b.id);
  const o = overview(b.id, 30);
  const s = dailySeries(b.id, 30);
  const lbl = s.map((x) => new Date(x.t).toLocaleDateString("en-IN", { day: "numeric", month: "short" }));
  const outlets = outletBreakdown(b.id);
  const rev = s.reduce((a, x) => a + x.revenue, 0);
  return (
    <>
      <PageHead title="Analytics" sub="What's working, when your customers come, and who they are." />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label="Active members (30d)" value={String(o.active)} hint={`of ${o.members} total`} />
        <Kpi label="Avg. bill" value={inr(o.avgBill)} />
        <Kpi label="Redemption rate" value={`${o.redemptionRate}%`} hint={`${o.vouchersRedeemed} of ${o.vouchersIssued}`} />
        <Kpi label="30-day member revenue" value={inr(rev)} delta={o.revenueDelta} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Revenue per day"><AreaChart data={s.map((x) => x.revenue)} labels={lbl} color="#e0a030" height={210} /></Panel>
        <Panel title="Visits per day"><AreaChart data={s.map((x) => x.visits)} labels={lbl} height={210} /></Panel>
        <Panel title="Busiest weekdays"><BarChart data={weekday(b.id)} highlight /></Panel>
        <Panel title="Busiest hours (8 weeks)"><Heat data={hourly(b.id)} /><p className="mt-4 text-sm text-ink-2">Darker = more visits. Consider scheduling happy hours over the lightest blocks.</p></Panel>
        <Panel title="Members by tier"><Donut data={tierSplit(b.id, p.gold_at, p.platinum_at)} /></Panel>
        <Panel title="Visits per member"><BarChart data={cohorts(b.id)} color="#1e9e5f" /></Panel>
      </div>
      <Panel title="Outlets (30 days)" className="mt-5">
        <div className="overflow-x-auto"><table className="tbl"><thead><tr><th>Outlet</th><th>Stamps</th><th>Revenue</th></tr></thead><tbody>{outlets.map((x) => <tr key={x.name}><td className="font-semibold">{x.name}</td><td>{x.visits}</td><td>{inr(x.revenue)}</td></tr>)}</tbody></table></div>
      </Panel>
    </>
  );
}
