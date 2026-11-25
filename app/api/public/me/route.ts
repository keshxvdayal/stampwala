import { get } from "@/lib/db";
import { currentMember } from "@/lib/member-session";
import { tierOf } from "@/lib/loyalty";
import { bad, json } from "@/lib/http";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  const ctx = await currentMember(slug);
  if (!ctx?.member) return bad("Not joined", 401);
  const m = ctx.member, p = ctx.program;
  const vouchers = get<{ n: number }>("SELECT COUNT(*) n FROM vouchers WHERE member_id=? AND status='active'", m.id)!.n;
  const active = get<{ code: string; expires_at: number }>("SELECT code,expires_at FROM codes WHERE member_id=? AND used=0 AND expires_at>? ORDER BY id DESC", m.id, Date.now());
  const voucher = get<{ code: string }>("SELECT code FROM vouchers WHERE member_id=? AND status='active' ORDER BY id DESC", m.id);
  return json({ ok: true, stamps: m.stamps, goal: p.goal, visits: m.total_visits, tier: tierOf(m, p), vouchers, voucher: voucher?.code ?? null, code: active ?? null, refCode: m.ref_code });
}
