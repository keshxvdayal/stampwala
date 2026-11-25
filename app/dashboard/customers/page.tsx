import type { Metadata } from "next";
import Link from "next/link";
import { requireBusiness } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { getProgram, tierOf, type Member } from "@/lib/loyalty";
import { PageHead, Panel, TierChip } from "@/components/dash/bits";
import { ago, phoneFmt } from "@/lib/format";
import { inr } from "@/lib/stats";

export const metadata: Metadata = { title: "Customers" };
const PER = 25;

export default async function Customers({ searchParams }: PageProps<"/dashboard/customers">) {
  const b = await requireBusiness();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const f = typeof sp.f === "string" ? sp.f : "all";
  const page = Math.max(1, Number(sp.page) || 1);
  const p = getProgram(b.id);
  const where: string[] = ["business_id=?"]; const args: (string | number)[] = [b.id];
  if (q) { where.push("(name LIKE ? OR phone LIKE ?)"); args.push(`%${q}%`, `%${q.replace(/\D/g, "") || q}%`); }
  if (f === "risk") { where.push("last_visit<? AND total_visits>=2"); args.push(Date.now() - 21 * 86400000); }
  if (f === "gold") { where.push("total_visits>=? AND total_visits<?"); args.push(p.gold_at, p.platinum_at); }
  if (f === "platinum") { where.push("total_visits>=?"); args.push(p.platinum_at); }
  if (f === "new") { where.push("created_at>?"); args.push(Date.now() - 14 * 86400000); }
  const w = where.join(" AND ");
  const total = get<{ n: number }>(`SELECT COUNT(*) n FROM members WHERE ${w}`, ...args)!.n;
  const rows = all<Member>(`SELECT * FROM members WHERE ${w} ORDER BY COALESCE(last_visit,created_at) DESC LIMIT ? OFFSET ?`, ...args, PER, (page - 1) * PER);
  const pages = Math.max(1, Math.ceil(total / PER));
  const href = (o: Record<string, string | number>) => `/dashboard/customers?${new URLSearchParams({ ...(q ? { q } : {}), f, page: "1", ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)])) })}`;
  const filters = [["all", "All"], ["new", "New (14d)"], ["risk", "At risk"], ["gold", "Gold"], ["platinum", "Platinum"]];

  return (
    <>
      <PageHead title="Customers" sub={`${total.toLocaleString("en-IN")} member${total === 1 ? "" : "s"}${q ? ` matching “${q}”` : ""}`}>
        <a href="/api/export" className="btn btn-line btn-sm">⬇ Export CSV</a>
      </PageHead>
      <Panel>
        <form className="flex flex-wrap items-center gap-3">
          <input name="q" defaultValue={q} placeholder="Search name or phone…" className="input !h-11 max-w-xs" aria-label="Search customers" />
          <input type="hidden" name="f" value={f} />
          <button className="btn btn-dark btn-sm">Search</button>
          <div className="ml-auto flex flex-wrap gap-2">{filters.map(([k, l]) => <Link key={k} href={href({ f: k })} className={`rounded-full px-4 py-2 text-sm font-semibold ${f === k ? "bg-forest text-white" : "bg-paper-2 text-ink-2 hover:bg-line"}`}>{l}</Link>)}</div>
        </form>
        <div className="-mx-2 mt-5 overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>Customer</th><th>Tier</th><th>Stamps</th><th>Visits</th><th>Spend</th><th>Last visit</th><th /></tr></thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td><Link href={`/dashboard/customers/${m.id}`} className="font-semibold hover:text-leaf">{m.name ?? "—"}</Link><small className="block text-muted">{phoneFmt(m.phone)}{m.opted_out ? " · opted out" : ""}</small></td>
                  <td><TierChip tier={tierOf(m, p)} /></td>
                  <td><span className="font-semibold">{m.stamps}</span><span className="text-muted">/{p.goal}</span></td>
                  <td>{m.total_visits}</td><td>{inr(m.total_spend)}</td><td className="text-ink-2">{ago(m.last_visit)}</td>
                  <td><Link href={`/dashboard/customers/${m.id}`} className="text-sm font-bold text-leaf">View →</Link></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} className="py-12 text-center text-muted">No customers match.</td></tr>}
            </tbody>
          </table>
        </div>
        {pages > 1 && <div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted">Page {page} of {pages}</span><div className="flex gap-2">{page > 1 && <Link className="btn btn-line btn-sm" href={href({ page: page - 1 })}>← Prev</Link>}{page < pages && <Link className="btn btn-line btn-sm" href={href({ page: page + 1 })}>Next →</Link>}</div></div>}
      </Panel>
    </>
  );
}
