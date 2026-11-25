import { get, run } from "./db";

/**
 * WhatsApp delivery layer.
 *  - Always writes to the `messages` table (visible in the dashboard inbox).
 *  - If WHATSAPP_TOKEN + WHATSAPP_PHONE_ID are set, also sends through the
 *    WhatsApp Cloud API. Note: free-form text only reaches a customer inside
 *    Meta's 24-hour service window; business-initiated sends (win-back,
 *    birthday) need an approved template. Wire that in `sendTemplate` below.
 */
export async function send(
  businessId: number,
  memberId: number | null,
  kind: string,
  body: string
): Promise<"delivered" | "logged" | "failed"> {
  let status: "delivered" | "logged" | "failed" = "logged";
  const tok = process.env.WHATSAPP_TOKEN;
  const pid = process.env.WHATSAPP_PHONE_ID;
  if (tok && pid && memberId) {
    const m = get<{ phone: string; opted_out: number }>("SELECT phone,opted_out FROM members WHERE id=?", memberId);
    if (m && !m.opted_out) {
      try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${pid}/messages`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
          body: JSON.stringify({ messaging_product: "whatsapp", to: m.phone, type: "text", text: { body } }),
        });
        status = res.ok ? "delivered" : "failed";
      } catch {
        status = "failed";
      }
    }
  }
  run("INSERT INTO messages (business_id,member_id,direction,kind,body,status,at) VALUES (?,?,?,?,?,?,?)", businessId, memberId, "out", kind, body, status, Date.now());
  return status;
}

export function logInbound(businessId: number, memberId: number | null, body: string) {
  run("INSERT INTO messages (business_id,member_id,direction,kind,body,status,at) VALUES (?,?,?,?,?,?,?)", businessId, memberId, "in", "inbound", body, "received", Date.now());
}

export const whatsappConfigured = () => Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID);
