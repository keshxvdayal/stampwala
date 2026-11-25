import { createHmac, timingSafeEqual } from "node:crypto";
import { get } from "@/lib/db";
import { joinMember, requestCode, optOut, normalizePhone, getProgram } from "@/lib/loyalty";
import { logInbound, send } from "@/lib/whatsapp";

/**
 * Meta WhatsApp Cloud API webhook.
 * GET  → verification handshake (WHATSAPP_VERIFY_TOKEN)
 * POST → inbound messages. Commands: JOIN <shop>, CODE, CARD, STOP, HINDI, ENGLISH
 * Single-number setups route by the shop slug in the first JOIN message; later
 * messages go to the member's most recent shop.
 */
export async function GET(req: Request) {
  const u = new URL(req.url);
  if (u.searchParams.get("hub.mode") === "subscribe" && u.searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN)
    return new Response(u.searchParams.get("hub.challenge") ?? "", { status: 200 });
  return new Response("Forbidden", { status: 403 });
}

type Msg = { from: string; text?: { body: string } };

export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (secret) {
    const sig = req.headers.get("x-hub-signature-256") ?? "";
    const exp = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
    if (sig.length !== exp.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return new Response("Bad signature", { status: 401 });
  }
  let payload: { entry?: { changes?: { value?: { messages?: Msg[] } }[] }[] } = {};
  try { payload = JSON.parse(raw); } catch { return new Response("ok"); }

  for (const e of payload.entry ?? [])
    for (const c of e.changes ?? [])
      for (const m of c.value?.messages ?? []) {
        const phone = normalizePhone(m.from);
        const text = (m.text?.body ?? "").trim();
        if (!phone || !text) continue;
        const words = text.split(/\s+/);
        const cmd = words[0].toUpperCase();
        let biz = cmd === "JOIN" ? get<{ id: number; name: string; slug: string }>("SELECT id,name,slug FROM businesses WHERE slug=?", (words[1] ?? "").toLowerCase()) : undefined;
        if (!biz) {
          biz = get<{ id: number; name: string; slug: string }>(
            "SELECT b.id,b.name,b.slug FROM members m JOIN businesses b ON b.id=m.business_id WHERE m.phone=? ORDER BY m.last_visit DESC, m.created_at DESC", phone
          );
        }
        if (!biz) continue;
        const { member } = await joinMember(biz, phone);
        logInbound(biz.id, member.id, text);
        if (cmd === "CODE" || cmd === "STAMP") { const r = await requestCode(biz, member); if (!r.ok) await send(biz.id, member.id, "cooldown", r.error); }
        else if (cmd === "STOP") await optOut(biz, member);
        else if (cmd === "CARD") { const p = getProgram(biz.id); await send(biz.id, member.id, "card", `${p.icon} ${biz.name}: ${member.stamps}/${p.goal} stamps. ${p.goal - member.stamps} to go for your ${p.reward}.`); }
      }
  return new Response("ok");
}
