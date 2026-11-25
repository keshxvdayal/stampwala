import { all, get } from "@/lib/db";
import { verify } from "@/lib/crypto";
import { createStaffSession, rateLimit } from "@/lib/auth";
import { bad, body, ip, json, num, str } from "@/lib/http";

export async function POST(req: Request) {
  const b = await body(req);
  const biz = get<{ id: number }>("SELECT id FROM businesses WHERE slug=?", str(b.slug, 40));
  if (!biz) return bad("Business not found.", 404);
  if (!rateLimit(`pin:${ip(req)}:${biz.id}`, 8, 600000)) return bad("Too many PIN attempts. Wait 10 minutes.", 429);
  const staff = all<{ id: number; pin_hash: string }>("SELECT id,pin_hash FROM staff WHERE business_id=? AND outlet_id=? AND active=1", biz.id, num(b.outlet));
  const pin = str(b.pin, 8);
  const hit = staff.find((s) => verify(pin, s.pin_hash));
  if (!hit) return bad("Wrong PIN.", 401);
  await createStaffSession(hit.id);
  return json({ ok: true });
}
