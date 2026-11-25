import { currentMember } from "@/lib/member-session";
import { requestCode } from "@/lib/loyalty";
import { rateLimit } from "@/lib/auth";
import { bad, body, json, str } from "@/lib/http";

export async function POST(req: Request) {
  const b = await body(req);
  const ctx = await currentMember(str(b.slug, 40));
  if (!ctx?.member) return bad("Join first.", 401);
  if (!rateLimit("code:" + ctx.member.id, 6, 600000)) return bad("Too many code requests. Wait a few minutes.", 429);
  const r = await requestCode(ctx.biz, ctx.member);
  return r.ok ? json(r) : json(r, 200);
}
