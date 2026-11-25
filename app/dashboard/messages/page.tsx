import type { Metadata } from "next";
import Link from "next/link";
import { requireBusiness } from "@/lib/auth";
import { all } from "@/lib/db";
import { PageHead, Panel } from "@/components/dash/bits";
import { dt } from "@/lib/format";
import { whatsappConfigured } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Messages" };
export default async function Messages() {
  const b = await requireBusiness();
  const rows = all<{ id: number; member_id: number | null; name: string | null; direction: string; kind: string; body: string; status: string; at: number }>(
    `SELECT x.id,x.member_id,m.name,x.direction,x.kind,x.body,x.status,x.at FROM messages x LEFT JOIN members m ON m.id=x.member_id WHERE x.business_id=? ORDER BY x.id DESC LIMIT 100`, b.id);
  const live = whatsappConfigured();
  const col: Record<string, string> = { delivered: "", logged: "gray", failed: "red", received: "amber" };
  return (
    <>
      <PageHead title="Messages" sub="Every message sent to or received from your customers." />
      <div className={`mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${live ? "bg-mint text-forest" : "bg-saffron-soft/60 text-[#6b4300]"}`}><i className={`size-3 rounded-full ${live ? "bg-wa" : "bg-saffron"}`} />{live ? "WhatsApp Cloud API connected — messages are delivered." : <>WhatsApp is <b>not connected</b>. Messages are logged here only. <Link href="/dashboard/settings" className="underline">Connect it →</Link></>}</div>
      <Panel>
        <div className="overflow-x-auto"><table className="tbl">
          <thead><tr><th>When</th><th>To / from</th><th>Type</th><th>Message</th><th>Status</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td className="whitespace-nowrap text-ink-2">{dt(r.at)}</td>
              <td>{r.member_id ? <Link className="font-semibold hover:text-leaf" href={`/dashboard/customers/${r.member_id}`}>{r.direction === "in" ? "← " : "→ "}{r.name ?? "Customer"}</Link> : "—"}</td>
              <td><span className="chip gray capitalize">{r.kind}</span></td><td className="max-w-md text-ink-2">{r.body}</td><td><span className={`chip ${col[r.status] ?? ""}`}>{r.status}</span></td>
            </tr>))}
            {!rows.length && <tr><td colSpan={5} className="py-12 text-center text-muted">Nothing yet.</td></tr>}
          </tbody></table></div>
      </Panel>
    </>
  );
}
