import { currentMember } from "@/lib/member-session";
import { optOut } from "@/lib/loyalty";
import { bad, body, json, str } from "@/lib/http";
export async function POST(req: Request) {
  const ctx = await currentMember(str((await body(req)).slug, 40));
  if (!ctx?.member) return bad("Not joined", 401);
  await optOut(ctx.biz, ctx.member);
  return json({ ok: true });
}
