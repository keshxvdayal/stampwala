import { getBusiness } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { runCampaigns } from "@/lib/loyalty";
import { bad, body, json, num, str } from "@/lib/http";

export async function POST(req: Request) {
  const biz = await getBusiness();
  if (!biz) return bad("Sign in", 401);
  const b = await body(req);
  const id = num(b.id);
  if (b.action !== "runAll" && !get("SELECT 1 FROM campaigns WHERE id=? AND business_id=?", id, biz.id)) return bad("Not found", 404);
  if (b.action === "toggle") run("UPDATE campaigns SET enabled=? WHERE id=?", b.enabled ? 1 : 0, id);
  else if (b.action === "save") run("UPDATE campaigns SET message=?,trigger_days=?,bonus_stamps=? WHERE id=?", str(b.message, 500), Math.max(1, num(b.trigger_days, 21)), Math.min(Math.max(num(b.bonus_stamps), 0), 5), id);
  else if (b.action === "run") return json({ ok: true, sent: await runCampaigns(biz, id) });
  else if (b.action === "runAll") return json({ ok: true, sent: await runCampaigns(biz) });
  return json({ ok: true });
}
