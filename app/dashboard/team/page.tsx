import type { Metadata } from "next";
import Link from "next/link";
import { requireBusiness } from "@/lib/auth";
import { all } from "@/lib/db";
import { PageHead, Panel } from "@/components/dash/bits";
import { AddOutlet, AddStaff, RemoveStaff } from "@/components/dash/TeamForms";
import { inr, outletBreakdown } from "@/lib/stats";

export const metadata: Metadata = { title: "Team & outlets" };
export default async function Team() {
  const b = await requireBusiness();
  const outlets = all<{ id: number; name: string; city: string | null }>("SELECT id,name,city FROM outlets WHERE business_id=?", b.id);
  const staff = all<{ id: number; name: string; role: string; outlet: string; stamps: number }>(
    `SELECT s.id,s.name,s.role,o.name outlet,(SELECT COUNT(*) FROM visits v WHERE v.staff_id=s.id AND v.at>?) stamps FROM staff s JOIN outlets o ON o.id=s.outlet_id WHERE s.business_id=? AND s.active=1 ORDER BY o.id,s.id`, Date.now() - 30 * 86400000, b.id);
  const perf = outletBreakdown(b.id);
  return (
    <>
      <PageHead title="Team & outlets" sub="Every stamp is tied to a person and an outlet." />
      <div className="grid gap-5">
        <Panel title="Outlets">
          <div className="grid gap-3 md:grid-cols-3">{outlets.map((o) => { const p = perf.find((x) => x.name === o.name); return <div key={o.id} className="rounded-2xl bg-paper p-5"><b>📍 {o.name}</b><small className="block text-muted">{o.city ?? "—"}</small><div className="mt-3 text-sm text-ink-2">{p?.visits ?? 0} stamps · {inr(p?.revenue ?? 0)} <span className="text-muted">(30d)</span></div></div>; })}</div>
          <AddOutlet />
          <p className="mt-3 text-xs text-muted">Growth includes 1 outlet, Pro up to 3. Current plan: <b className="capitalize">{b.plan}</b>.</p>
        </Panel>
        <Panel title="Staff PINs">
          <div className="overflow-x-auto"><table className="tbl"><thead><tr><th>Name</th><th>Role</th><th>Outlet</th><th>Stamps (30d)</th><th /></tr></thead>
            <tbody>{staff.map((s) => <tr key={s.id}><td className="font-semibold">{s.name}</td><td><span className={`chip ${s.role === "manager" ? "amber" : "gray"}`}>{s.role}</span></td><td>{s.outlet}</td><td>{s.stamps}</td><td className="text-right"><RemoveStaff id={s.id} /></td></tr>)}</tbody></table></div>
          <AddStaff outlets={outlets} />
          <p className="mt-4 text-sm text-ink-2">Staff sign in at <Link href={`/t/${b.slug}`} target="_blank" className="font-bold text-leaf">/t/{b.slug}</Link> with their PIN. PINs are stored hashed and can&apos;t be recovered — add a new one if forgotten.</p>
        </Panel>
      </div>
    </>
  );
}
