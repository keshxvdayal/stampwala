import { cookies } from "next/headers";
import { get } from "@/lib/db";
import { joinMember, normalizePhone } from "@/lib/loyalty";
import { rateLimit } from "@/lib/auth";
import { bad, body, ip, json, str } from "@/lib/http";

export async function POST(req: Request) {
  if (!rateLimit("join:" + ip(req), 20, 600000)) return bad("Slow down a little.", 429);
  const b = await body(req);
  const biz = get<{ id: number; name: string; slug: string }>("SELECT id,name,slug FROM businesses WHERE slug=?", str(b.slug, 40));
  if (!biz) return bad("Business not found.", 404);
  const phone = normalizePhone(str(b.phone, 20));
  if (!phone) return bad("Enter a valid mobile number.");
  const { member, created } = await joinMember(biz, phone, { name: str(b.name, 40), ref: str(b.ref, 12), lang: b.lang === "hi" ? "hi" : "en" });
  // The cookie identifies the device. In production the WhatsApp chat itself proves phone ownership.
  (await cookies()).set(`sw_m_${biz.slug}`, member.token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 365 * 86400 });
  return json({ ok: true, created });
}
