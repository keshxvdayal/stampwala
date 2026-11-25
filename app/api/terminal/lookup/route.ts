import { getStaff } from "@/lib/auth";
import { all } from "@/lib/db";
import { json, bad } from "@/lib/http";
export async function GET() {
  const s = await getStaff();
  if (!s) return bad("Sign in with your PIN.", 401);
  const rows = all(
    `SELECT v.at,v.bill,v.stamps_added,m.name FROM visits v JOIN members m ON m.id=v.member_id WHERE v.business_id=? AND v.outlet_id=? ORDER BY v.at DESC LIMIT 6`,
    s.business_id, s.outlet_id
  );
  return json({ ok: true, recent: rows });
}
