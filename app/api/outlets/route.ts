import { getBusiness } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { bad, body, json, str } from "@/lib/http";

const LIMITS: Record<string, number> = { starter: 1, growth: 1, pro: 3, chain: 999 };
export async function POST(req: Request) {
  const biz = await getBusiness();
  if (!biz) return bad("Sign in", 401);
  const b = await body(req);
  if (!str(b.name, 40)) return bad("Outlet name is required.");
  const n = get<{ n: number }>("SELECT COUNT(*) n FROM outlets WHERE business_id=?", biz.id)!.n;
  if (n >= (LIMITS[biz.plan] ?? 1)) return bad(`Your ${biz.plan} plan allows ${LIMITS[biz.plan]} outlet(s). Upgrade to add more.`, 402);
  run("INSERT INTO outlets (business_id,name,city) VALUES (?,?,?)", biz.id, str(b.name, 40), str(b.city, 40) || null);
  return json({ ok: true });
}
