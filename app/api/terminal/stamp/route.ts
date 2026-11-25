import { getStaff } from "@/lib/auth";
import { stampWithCode, findMemberByPhone } from "@/lib/loyalty";
import { bad, body, json, num, str } from "@/lib/http";

export async function POST(req: Request) {
  const s = await getStaff();
  if (!s) return bad("Sign in with your PIN.", 401);
  const b = await body(req);
  const biz = { id: s.business_id, name: s.business_name, slug: s.slug };
  const ctx = { outletId: s.outlet_id, staffId: s.id };
  if (b.phone) {
    if (s.role !== "manager") return bad("Only managers can stamp by phone number.", 403);
    const m = findMemberByPhone(s.business_id, str(b.phone, 20));
    if (!m) return bad("No member with that number.", 404);
    const r = await stampWithCode(biz, ctx, "", num(b.bill), "manual", m);
    return r.ok ? json(r) : bad(r.error);
  }
  const r = await stampWithCode(biz, ctx, str(b.code, 6), num(b.bill));
  return r.ok ? json(r) : bad(r.error);
}
