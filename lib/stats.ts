import { all, get } from "./db";

const DAY = 86400000;
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const compact = (n: number) => (n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L` : n >= 1e3 ? `₹${(n / 1e3).toFixed(1)}k` : `₹${n}`);

export function overview(bid: number, days = 30) {
  const since = Date.now() - days * DAY;
  const prev = since - days * DAY;
  const q = (a: number, b: number) =>
    get<{ v: number; s: number; r: number; c: number }>(
      "SELECT COUNT(*) v, COALESCE(SUM(bill),0) s, COALESCE(SUM(stamps_added),0) r, COUNT(DISTINCT member_id) c FROM visits WHERE business_id=? AND at>=? AND at<?", bid, a, b
    )!;
  const cur = q(since, Date.now() + 1), old = q(prev, since);
  const members = get<{ n: number }>("SELECT COUNT(*) n FROM members WHERE business_id=?", bid)!.n;
  const newMembers = get<{ n: number }>("SELECT COUNT(*) n FROM members WHERE business_id=? AND created_at>=?", bid, since)!.n;
  const repeat = get<{ n: number }>("SELECT COUNT(*) n FROM members WHERE business_id=? AND total_visits>=2", bid)!.n;
  const active = get<{ n: number }>("SELECT COUNT(*) n FROM members WHERE business_id=? AND last_visit>=?", bid, Date.now() - 30 * DAY)!.n;
  const v = get<{ a: number; b: number }>(
    "SELECT COUNT(*) a, SUM(status='redeemed') b FROM vouchers WHERE business_id=?", bid
  )!;
  const delta = (a: number, b: number) => (b === 0 ? null : Math.round(((a - b) / b) * 100));
  return {
    visits: cur.v, visitsDelta: delta(cur.v, old.v),
    revenue: cur.s, revenueDelta: delta(cur.s, old.s),
    stamps: cur.r, members, newMembers, active,
    repeatRate: members ? Math.round((repeat / members) * 100) : 0,
    vouchersIssued: v.a, vouchersRedeemed: v.b ?? 0,
    redemptionRate: v.a ? Math.round(((v.b ?? 0) / v.a) * 100) : 0,
    avgBill: cur.v ? Math.round(cur.s / cur.v) : 0,
  };
}

export function dailySeries(bid: number, days = 30) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const t0 = start.getTime() - (days - 1) * DAY;
  const rows = all<{ at: number; bill: number }>("SELECT at,bill FROM visits WHERE business_id=? AND at>=?", bid, t0);
  const out = Array.from({ length: days }, (_, i) => ({ t: t0 + i * DAY, visits: 0, revenue: 0 }));
  for (const r of rows) {
    const i = Math.floor((r.at - t0) / DAY);
    if (out[i]) { out[i].visits++; out[i].revenue += r.bill; }
  }
  return out;
}

export function weekday(bid: number) {
  const rows = all<{ at: number }>("SELECT at FROM visits WHERE business_id=? AND at>=?", bid, Date.now() - 56 * DAY);
  const a = [0, 0, 0, 0, 0, 0, 0];
  for (const r of rows) a[new Date(r.at).getDay()]++;
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return [1, 2, 3, 4, 5, 6, 0].map((d) => ({ label: names[d], value: a[d] }));
}

export function hourly(bid: number) {
  const rows = all<{ at: number }>("SELECT at FROM visits WHERE business_id=? AND at>=?", bid, Date.now() - 56 * DAY);
  const a = Array(24).fill(0);
  for (const r of rows) a[new Date(r.at).getHours()]++;
  return a as number[];
}

export function tierSplit(bid: number, gold: number, plat: number) {
  const r = get<{ s: number; g: number; p: number }>(
    "SELECT SUM(total_visits<?) s, SUM(total_visits>=? AND total_visits<?) g, SUM(total_visits>=?) p FROM members WHERE business_id=?",
    gold, gold, plat, plat, bid
  )!;
  return [
    { label: "Silver", value: r.s ?? 0, color: "#B9C2BD" },
    { label: "Gold", value: r.g ?? 0, color: "#E0A030" },
    { label: "Platinum", value: r.p ?? 0, color: "#25d366" },
  ];
}

export function cohorts(bid: number) {
  // visits-per-member distribution
  const r = all<{ b: string; n: number }>(
    `SELECT CASE WHEN total_visits=0 THEN '0' WHEN total_visits=1 THEN '1' WHEN total_visits<=3 THEN '2–3' WHEN total_visits<=6 THEN '4–6' WHEN total_visits<=12 THEN '7–12' ELSE '13+' END b, COUNT(*) n
     FROM members WHERE business_id=? GROUP BY b`, bid
  );
  const order = ["0", "1", "2–3", "4–6", "7–12", "13+"];
  return order.map((k) => ({ label: k, value: r.find((x) => x.b === k)?.n ?? 0 }));
}

export function outletBreakdown(bid: number) {
  return all<{ name: string; visits: number; revenue: number }>(
    `SELECT o.name, COUNT(v.id) visits, COALESCE(SUM(v.bill),0) revenue FROM outlets o
     LEFT JOIN visits v ON v.outlet_id=o.id AND v.at>=? WHERE o.business_id=? GROUP BY o.id ORDER BY visits DESC`, Date.now() - 30 * DAY, bid
  );
}

export function topMembers(bid: number, limit = 5) {
  return all<{ id: number; name: string | null; phone: string; total_visits: number; total_spend: number }>(
    "SELECT id,name,phone,total_visits,total_spend FROM members WHERE business_id=? ORDER BY total_spend DESC LIMIT ?", bid, limit
  );
}

export function recentActivity(bid: number, limit = 8) {
  return all<{ at: number; bill: number; stamps_added: number; name: string | null; staff: string | null; outlet: string | null; method: string }>(
    `SELECT v.at,v.bill,v.stamps_added,v.method,m.name,s.name staff,o.name outlet FROM visits v JOIN members m ON m.id=v.member_id
     LEFT JOIN staff s ON s.id=v.staff_id LEFT JOIN outlets o ON o.id=v.outlet_id WHERE v.business_id=? ORDER BY v.at DESC LIMIT ?`, bid, limit
  );
}
