import { getBusiness } from "@/lib/auth";
import { all } from "@/lib/db";
import { tierOf, getProgram, type Member } from "@/lib/loyalty";

const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
export async function GET() {
  const biz = await getBusiness();
  if (!biz) return new Response("Unauthorized", { status: 401 });
  const p = getProgram(biz.id);
  const rows = all<Member>("SELECT * FROM members WHERE business_id=? ORDER BY total_spend DESC", biz.id);
  const head = "name,phone,tier,stamps,visits,total_spend_inr,rewards_earned,last_visit,joined,whatsapp_opt_in";
  const lines = rows.map((m) =>
    [m.name, "+" + m.phone, tierOf(m, p), m.stamps, m.total_visits, m.total_spend, m.rewards_earned, m.last_visit ? new Date(m.last_visit).toISOString() : "", new Date(m.created_at).toISOString(), m.opted_out ? "no" : "yes"].map(q).join(",")
  );
  return new Response([head, ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="${biz.slug}-customers.csv"` },
  });
}
