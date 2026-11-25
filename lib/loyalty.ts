import { all, get, run, tx } from "./db";
import { digits, token } from "./crypto";
import { send } from "./whatsapp";
import { t, type Lang } from "./i18n";

export type Program = {
  business_id: number; goal: number; icon: string; color: string; reward: string; min_bill: number;
  cooldown_hours: number; happy_days: string; happy_mult: number; referral_bonus: number; gold_at: number; platinum_at: number;
};
export type Member = {
  id: number; business_id: number; phone: string; name: string | null; lang: Lang; birthday: string | null; token: string; ref_code: string;
  referred_by: number | null; stamps: number; total_visits: number; total_spend: number; rewards_earned: number;
  last_visit: number | null; opted_out: number; created_at: number;
};
type Biz = { id: number; name: string; slug: string };

export const getProgram = (bid: number) => get<Program>("SELECT * FROM programs WHERE business_id=?", bid)!;
export const tierOf = (m: { total_visits: number }, p: Program) =>
  m.total_visits >= p.platinum_at ? "Platinum" : m.total_visits >= p.gold_at ? "Gold" : "Silver";
export const isHappyNow = (p: Program, d = new Date()) => p.happy_days.split(",").filter(Boolean).includes(String(d.getDay()));
export const firstName = (m: { name: string | null }) => (m.name?.trim().split(" ")[0] || "there");

/** Accepts 10-digit Indian mobiles or full international digits. */
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10 && /^[6-9]/.test(d)) return "91" + d;
  if (d.length === 12 && d.startsWith("91") && /^[6-9]/.test(d[2])) return d;
  if (d.length >= 11 && d.length <= 15 && !d.startsWith("0")) return d;
  return null;
}
export const maskPhone = (p: string) => p.replace(/^(\d{2})\d+(\d{3})$/, "$1•••••$2");

const vars = (b: Biz, p: Program, m: Member, extra: Record<string, string | number> = {}) => ({
  business: b.name, icon: p.icon, goal: p.goal, reward: p.reward, name: firstName(m), left: Math.max(p.goal - m.stamps, 0), ...extra,
});

export const memberById = (id: number) => get<Member>("SELECT * FROM members WHERE id=?", id);
export const memberByToken = (bid: number, tk: string) => get<Member>("SELECT * FROM members WHERE business_id=? AND token=?", bid, tk);

export async function joinMember(biz: Biz, phone: string, opts: { name?: string; ref?: string; lang?: Lang } = {}) {
  const existing = get<Member>("SELECT * FROM members WHERE business_id=? AND phone=?", biz.id, phone);
  if (existing) {
    if (existing.opted_out) run("UPDATE members SET opted_out=0 WHERE id=?", existing.id);
    if (opts.name && !existing.name) run("UPDATE members SET name=? WHERE id=?", opts.name, existing.id);
    return { member: memberById(existing.id)!, created: false };
  }
  const refMember = opts.ref ? get<Member>("SELECT * FROM members WHERE business_id=? AND ref_code=?", biz.id, opts.ref) : undefined;
  const id = run(
    "INSERT INTO members (business_id,phone,name,lang,token,ref_code,referred_by,created_at) VALUES (?,?,?,?,?,?,?,?)",
    biz.id, phone, opts.name?.trim().slice(0, 40) || null, opts.lang ?? "en", token(16), "R" + token(3).toUpperCase(), refMember?.id ?? null, Date.now()
  ).id;
  const member = memberById(id)!;
  const p = getProgram(biz.id);
  await send(biz.id, id, "welcome", t("welcome", member.lang, vars(biz, p, member)));
  return { member, created: true };
}

const waitText = (ms: number) => {
  const m = Math.ceil(ms / 60000);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
};

export async function requestCode(biz: Biz, member: Member) {
  const p = getProgram(biz.id);
  if (member.last_visit && Date.now() - member.last_visit < p.cooldown_hours * 3600000) {
    const waitMs = p.cooldown_hours * 3600000 - (Date.now() - member.last_visit);
    return { ok: false as const, error: t("cooldown", member.lang, { wait: waitText(waitMs) }), waitMs };
  }
  run("UPDATE codes SET used=1 WHERE member_id=? AND used=0", member.id);
  let code = digits(4);
  for (let i = 0; i < 5 && get("SELECT 1 FROM codes WHERE business_id=? AND code=? AND used=0 AND expires_at>?", biz.id, code, Date.now()); i++) code = digits(4);
  const expires = Date.now() + 120000;
  run("INSERT INTO codes (business_id,member_id,code,expires_at) VALUES (?,?,?,?)", biz.id, member.id, code, expires);
  await send(biz.id, member.id, "code", t("code", member.lang, { code }));
  return { ok: true as const, code, expires };
}

/** Adds stamps, rolling over into vouchers when the card fills. Must run inside tx. */
function addStamps(member: Member, p: Program, n: number) {
  let stamps = member.stamps + n;
  const vouchers: string[] = [];
  while (stamps >= p.goal) {
    stamps -= p.goal;
    const code = "VIP-" + token(2).toUpperCase();
    run("INSERT INTO vouchers (business_id,member_id,code,reward,created_at) VALUES (?,?,?,?,?)", member.business_id, member.id, code, p.reward, Date.now());
    run("UPDATE members SET rewards_earned=rewards_earned+1 WHERE id=?", member.id);
    vouchers.push(code);
  }
  run("UPDATE members SET stamps=? WHERE id=?", stamps, member.id);
  return { stamps, vouchers };
}

export type StampResult =
  | { ok: true; member: Member; added: number; stamps: number; goal: number; vouchers: string[]; happy: boolean; tier: string }
  | { ok: false; error: string };

export async function stampWithCode(
  biz: Biz, ctx: { outletId: number | null; staffId: number | null }, rawCode: string, bill: number, method: "code" | "manual" = "code", manualMember?: Member
): Promise<StampResult> {
  const p = getProgram(biz.id);
  if (!Number.isFinite(bill) || bill < 0 || bill > 1_000_000) return { ok: false, error: "Enter a valid bill amount." };
  let member: Member | undefined = manualMember;
  let codeId: number | null = null;
  if (method === "code") {
    const row = get<{ id: number; member_id: number; expires_at: number }>(
      "SELECT id,member_id,expires_at FROM codes WHERE business_id=? AND code=? AND used=0 ORDER BY id DESC", biz.id, rawCode.trim()
    );
    if (!row) return { ok: false, error: "Wrong code. Nothing was stamped." };
    if (row.expires_at < Date.now()) return { ok: false, error: "That code expired. Ask the customer to request a new one." };
    member = memberById(row.member_id);
    codeId = row.id;
  }
  if (!member) return { ok: false, error: "Customer not found." };
  if (bill < p.min_bill) return { ok: false, error: `Bill is below the ₹${p.min_bill} minimum for a stamp.` };
  if (method === "manual" && member.last_visit && Date.now() - member.last_visit < p.cooldown_hours * 3600000)
    return { ok: false, error: `This customer was stamped ${waitText(Date.now() - member.last_visit)} ago (cooldown ${p.cooldown_hours}h).` };

  const happy = isHappyNow(p);
  const n = happy ? p.happy_mult : 1;
  const first = member.total_visits === 0;
  const referrer = first && member.referred_by ? memberById(member.referred_by) : undefined;

  const res = tx(() => {
    if (codeId) run("UPDATE codes SET used=1 WHERE id=?", codeId);
    run("INSERT INTO visits (business_id,member_id,outlet_id,staff_id,bill,stamps_added,method,at) VALUES (?,?,?,?,?,?,?,?)", biz.id, member!.id, ctx.outletId, ctx.staffId, bill, n, method, Date.now());
    run("UPDATE members SET total_visits=total_visits+1,total_spend=total_spend+?,last_visit=? WHERE id=?", bill, Date.now(), member!.id);
    const fresh = memberById(member!.id)!;
    const a = addStamps(fresh, p, n + (referrer ? p.referral_bonus : 0));
    let rv: { stamps: number; vouchers: string[] } | null = null;
    if (referrer) rv = addStamps(memberById(referrer.id)!, p, p.referral_bonus);
    return { ...a, rv };
  });

  const m2 = memberById(member.id)!;
  const lang = m2.lang;
  const left = res.stamps > 0 || !res.vouchers.length ? t("left_some", lang, { left: p.goal - res.stamps, reward: p.reward }) : t("left_none", lang);
  await send(biz.id, m2.id, "stamp", t("stamp", lang, { business: biz.name, n, s: n > 1 ? "s" : "", left }));
  for (const v of res.vouchers) await send(biz.id, m2.id, "reward", t("reward", lang, { reward: p.reward, voucher: v }));
  if (referrer) {
    await send(biz.id, referrer.id, "referral", t("referral", referrer.lang, { friend: firstName(m2), n: p.referral_bonus }));
    for (const v of res.rv?.vouchers ?? []) await send(biz.id, referrer.id, "reward", t("reward", referrer.lang, { reward: p.reward, voucher: v }));
  }
  return { ok: true, member: m2, added: n, stamps: res.stamps, goal: p.goal, vouchers: res.vouchers, happy, tier: tierOf(m2, p) };
}

export async function redeemVoucher(biz: Biz, rawCode: string) {
  const v = get<{ id: number; member_id: number; reward: string; status: string }>(
    "SELECT id,member_id,reward,status FROM vouchers WHERE business_id=? AND code=?", biz.id, rawCode.trim().toUpperCase()
  );
  if (!v) return { ok: false as const, error: "Voucher not found." };
  if (v.status !== "active") return { ok: false as const, error: "This voucher was already used." };
  run("UPDATE vouchers SET status='redeemed',redeemed_at=? WHERE id=?", Date.now(), v.id);
  const m = memberById(v.member_id)!;
  await send(biz.id, m.id, "redeemed", t("redeemed", m.lang, { reward: v.reward }));
  return { ok: true as const, reward: v.reward, member: m };
}

export function findMemberByPhone(bid: number, raw: string) {
  const ph = normalizePhone(raw);
  return ph ? get<Member>("SELECT * FROM members WHERE business_id=? AND phone=?", bid, ph) : undefined;
}

/* ---------- campaigns ---------- */
const render = (tpl: string, b: Biz, p: Program, m: Member) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String((vars(b, p, m) as Record<string, string | number>)[k] ?? ""));

export async function runCampaigns(biz: Biz, only?: number) {
  const p = getProgram(biz.id);
  const day = 86400000;
  const now = Date.now();
  const camps = all<{ id: number; type: string; trigger_days: number; message: string; bonus_stamps: number }>(
    `SELECT id,type,trigger_days,message,bonus_stamps FROM campaigns WHERE business_id=? AND enabled=1 ${only ? "AND id=" + Number(only) : ""}`, biz.id
  );
  let total = 0;
  for (const c of camps) {
    let targets: Member[] = [];
    if (c.type === "winback")
      targets = all<Member>(
        `SELECT * FROM members WHERE business_id=? AND opted_out=0 AND last_visit IS NOT NULL AND last_visit<?
         AND id NOT IN (SELECT member_id FROM campaign_sends WHERE campaign_id=? AND at>?)`,
        biz.id, now - c.trigger_days * day, c.id, now - c.trigger_days * day
      );
    else if (c.type === "birthday") {
      const d = new Date();
      const md = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      targets = all<Member>(
        `SELECT * FROM members WHERE business_id=? AND opted_out=0 AND birthday=? AND id NOT IN (SELECT member_id FROM campaign_sends WHERE campaign_id=? AND at>?)`,
        biz.id, md, c.id, now - 300 * day
      );
    } else if (c.type === "welcome")
      targets = all<Member>(
        `SELECT * FROM members WHERE business_id=? AND opted_out=0 AND total_visits=0 AND created_at<? AND created_at>?
         AND id NOT IN (SELECT member_id FROM campaign_sends WHERE campaign_id=?)`,
        biz.id, now - c.trigger_days * day, now - 30 * day, c.id
      );
    for (const m of targets) {
      let cur = m;
      if (c.bonus_stamps > 0) {
        tx(() => addStamps(m, p, c.bonus_stamps));
        cur = memberById(m.id)!;
      }
      await send(biz.id, m.id, c.type, render(c.message, biz, p, cur));
      run("INSERT INTO campaign_sends (campaign_id,member_id,at) VALUES (?,?,?)", c.id, m.id, now);
      total++;
    }
    run("UPDATE campaigns SET sent_count=sent_count+?,last_run=? WHERE id=?", targets.length, now, c.id);
  }
  return total;
}

export const atRisk = (bid: number, days = 21, limit = 8) =>
  all<Member>(
    `SELECT * FROM members WHERE business_id=? AND opted_out=0 AND total_visits>=2 AND last_visit<? ORDER BY total_visits DESC LIMIT ?`,
    bid, Date.now() - days * 86400000, limit
  );

export async function nudgeMember(biz: Biz, memberId: number) {
  const m = get<Member>("SELECT * FROM members WHERE id=? AND business_id=?", memberId, biz.id);
  if (!m || m.opted_out) return false;
  const p = getProgram(biz.id);
  const c = get<{ message: string }>("SELECT message FROM campaigns WHERE business_id=? AND type='winback'", biz.id);
  await send(biz.id, m.id, "winback", render(c?.message ?? "We miss you at {business}! 💛", biz, p, m));
  return true;
}

export async function optOut(biz: Biz, member: Member) {
  run("UPDATE members SET opted_out=1 WHERE id=?", member.id);
  await send(biz.id, member.id, "optout", t("optout", member.lang));
}
