import { AreaChart, BarChart } from "@/components/dash/charts";

const trend = [34, 41, 38, 52, 47, 58, 66, 61, 72, 69, 80, 77, 91, 86, 94, 88, 101, 97, 110, 104, 118, 112, 126, 121, 132, 128, 140, 137, 148, 152];
const week = [["Mon", 46], ["Tue", 72], ["Wed", 52], ["Thu", 58], ["Fri", 84], ["Sat", 100], ["Sun", 92]].map(([label, value]) => ({ label: label as string, value: value as number }));

export function DashPreview() {
  return (
    <div className="theme-light overflow-hidden rounded-[28px] border border-white/10 bg-[#f3eee2] text-ink shadow-[0_50px_100px_-30px_rgba(0,0,0,.6)]">
      <div className="flex items-center gap-2 border-b border-line bg-card px-5 py-3.5">
        <i className="size-3 rounded-full bg-[#ff5f57]" /><i className="size-3 rounded-full bg-[#febc2e]" /><i className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 rounded-full bg-paper px-4 py-1 text-xs text-muted">stampwala.app/dashboard</span>
        <span className="chip amber ml-auto">Sample data</span>
      </div>
      <div className="grid gap-4 p-5 md:p-7">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[["Repeat-customer rate", "41%", "▲ 9 pts"], ["Stamps issued", "1,284", "▲ 18%"], ["Rewards redeemed", "164", "78% redemption"], ["Member revenue", "₹2.9L", "63% of sales"]].map(([l, v, d]) => (
            <div key={l} className="kpi"><small className="text-xs text-muted">{l}</small><b className="mt-1 block font-display text-[30px] leading-none">{v}</b><i className="mt-2 block text-xs font-semibold not-italic text-leaf">{d}</i></div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="kpi"><h4 className="mb-2 text-sm font-bold">Visits · last 30 days</h4><AreaChart data={trend} height={190} /></div>
          <div className="kpi"><h4 className="mb-3 text-sm font-bold">By weekday</h4><BarChart data={week} height={170} highlight /></div>
        </div>
        <div className="kpi">
          <h4 className="mb-3 text-sm font-bold">⚠️ At risk of leaving</h4>
          <div className="grid gap-2 md:grid-cols-3">
            {[["Ananya S.", "24 days · 5/6 stamps"], ["Rohan M.", "22 days · 3/6 stamps"], ["Priya K.", "31 days · Gold tier"]].map(([n, d]) => (
              <div key={n} className="flex items-center justify-between rounded-xl bg-paper px-4 py-3 text-sm"><span><b>{n}</b><small className="block text-xs text-muted">{d}</small></span><span className="rounded-full bg-wa px-3 py-1 text-xs font-bold text-[#05301a]">Nudge</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
