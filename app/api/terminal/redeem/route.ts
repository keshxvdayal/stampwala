import { getStaff } from "@/lib/auth";
import { redeemVoucher } from "@/lib/loyalty";
import { bad, body, json, str } from "@/lib/http";
export async function POST(req: Request) {
  const s = await getStaff();
  if (!s) return bad("Sign in with your PIN.", 401);
  const r = await redeemVoucher({ id: s.business_id, name: s.business_name, slug: s.slug }, str((await body(req)).code, 12));
  return r.ok ? json(r) : bad(r.error);
}
