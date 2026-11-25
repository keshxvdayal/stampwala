import { getBusiness } from "@/lib/auth";
import { run } from "@/lib/db";
import { bad, body, json, num, str } from "@/lib/http";

export async function PUT(req: Request) {
  const biz = await getBusiness();
  if (!biz) return bad("Sign in", 401);
  const b = await body(req);
  const goal = Math.min(Math.max(Math.round(num(b.goal, 6)), 3), 15);
  const color = /^#[0-9a-fA-F]{6}$/.test(str(b.color, 7)) ? str(b.color, 7) : "#0B3B2C";
  const days = str(b.happy_days, 20).split(",").filter((d) => /^[0-6]$/.test(d)).join(",");
  if (!str(b.reward, 40)) return bad("Reward can't be empty.");
  run(
    `UPDATE programs SET goal=?,icon=?,color=?,reward=?,min_bill=?,cooldown_hours=?,happy_days=?,happy_mult=?,referral_bonus=?,gold_at=?,platinum_at=? WHERE business_id=?`,
    goal, str(b.icon, 8) || "☕", color, str(b.reward, 40), Math.max(0, num(b.min_bill, 100)), Math.min(Math.max(num(b.cooldown_hours, 4), 0), 72),
    days, Math.min(Math.max(num(b.happy_mult, 2), 2), 5), Math.min(Math.max(num(b.referral_bonus, 1), 0), 5),
    Math.max(2, num(b.gold_at, 10)), Math.max(3, num(b.platinum_at, 25)), biz.id
  );
  if (b.name && str(b.name, 60)) run("UPDATE businesses SET name=? WHERE id=?", str(b.name, 60), biz.id);
  return json({ ok: true });
}
