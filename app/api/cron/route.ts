import { all } from "@/lib/db";
import { runCampaigns } from "@/lib/loyalty";
import { bad, json } from "@/lib/http";

/** Hit daily from a scheduler: curl -H "Authorization: Bearer $CRON_SECRET" https://host/api/cron */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return bad("Unauthorized", 401);
  let sent = 0;
  for (const b of all<{ id: number; name: string; slug: string }>("SELECT id,name,slug FROM businesses")) sent += await runCampaigns(b);
  return json({ ok: true, sent });
}
