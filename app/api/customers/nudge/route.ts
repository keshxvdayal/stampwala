import { getBusiness } from "@/lib/auth";
import { nudgeMember } from "@/lib/loyalty";
import { bad, body, json, num } from "@/lib/http";
export async function POST(req: Request) {
  const biz = await getBusiness();
  if (!biz) return bad("Sign in", 401);
  const ok = await nudgeMember(biz, num((await body(req)).id));
  return ok ? json({ ok: true }) : bad("Couldn't message this customer (opted out?).");
}
