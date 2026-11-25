import type { Metadata } from "next";
import { requireBusiness } from "@/lib/auth";
import { all } from "@/lib/db";
import { PageHead } from "@/components/dash/bits";
import { CampaignCard } from "@/components/dash/CampaignCard";

export const metadata: Metadata = { title: "Campaigns" };
export default async function Campaigns() {
  const b = await requireBusiness();
  const rows = all<{ id: number; type: string; name: string; trigger_days: number; message: string; bonus_stamps: number; enabled: number; sent_count: number; last_run: number | null }>("SELECT * FROM campaigns WHERE business_id=? ORDER BY id", b.id);
  return (
    <>
      <PageHead title="Campaigns" sub="Automatic messages that run without you. Opted-out customers are never contacted." />
      <div className="mb-6 rounded-2xl border border-saffron/50 bg-saffron-soft/50 p-4 text-sm text-[#6b4300]"><b>How sending works:</b> campaigns run when you press <i>Run now</i>, or daily if a scheduler calls <code className="rounded bg-white/60 px-1.5">/api/cron</code> (see Settings). Without WhatsApp credentials, messages are recorded in the Messages log instead of being delivered.</div>
      <div className="space-y-5">{rows.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
    </>
  );
}
