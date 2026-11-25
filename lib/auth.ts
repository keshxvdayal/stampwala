import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { get, run } from "./db";
import { token } from "./crypto";

export type Business = {
  id: number; slug: string; name: string; category: string; owner_name: string;
  email: string; plan: string; wa_number: string | null; created_at: number;
};
export type StaffCtx = { id: number; name: string; role: string; outlet_id: number; outlet_name: string; business_id: number; slug: string; business_name: string };

const DAY = 86400000;
const secure = process.env.NODE_ENV === "production";

export async function createSession(businessId: number) {
  const t = token();
  run("INSERT INTO sessions (token,business_id,expires_at) VALUES (?,?,?)", t, businessId, Date.now() + 14 * DAY);
  (await cookies()).set("sw_session", t, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 14 * 86400 });
}
export async function destroySession() {
  const c = await cookies();
  const t = c.get("sw_session")?.value;
  if (t) run("DELETE FROM sessions WHERE token=?", t);
  c.delete("sw_session");
}
export async function getBusiness(): Promise<Business | null> {
  const t = (await cookies()).get("sw_session")?.value;
  if (!t) return null;
  return (
    get<Business>(
      `SELECT b.id,b.slug,b.name,b.category,b.owner_name,b.email,b.plan,b.wa_number,b.created_at
       FROM sessions s JOIN businesses b ON b.id=s.business_id WHERE s.token=? AND s.expires_at>?`,
      t, Date.now()
    ) ?? null
  );
}
export async function requireBusiness(): Promise<Business> {
  const b = await getBusiness();
  if (!b) redirect("/login");
  return b;
}

/* staff (counter terminal) */
export async function createStaffSession(staffId: number) {
  const t = token();
  run("INSERT INTO staff_sessions (token,staff_id,expires_at) VALUES (?,?,?)", t, staffId, Date.now() + 12 * 3600000);
  (await cookies()).set("sw_staff", t, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 12 * 3600 });
}
export async function getStaff(): Promise<StaffCtx | null> {
  const t = (await cookies()).get("sw_staff")?.value;
  if (!t) return null;
  return (
    get<StaffCtx>(
      `SELECT st.id,st.name,st.role,st.outlet_id,o.name outlet_name,st.business_id,b.slug,b.name business_name
       FROM staff_sessions ss JOIN staff st ON st.id=ss.staff_id AND st.active=1
       JOIN outlets o ON o.id=st.outlet_id JOIN businesses b ON b.id=st.business_id
       WHERE ss.token=? AND ss.expires_at>?`,
      t, Date.now()
    ) ?? null
  );
}
export async function destroyStaffSession() {
  const c = await cookies();
  const t = c.get("sw_staff")?.value;
  if (t) run("DELETE FROM staff_sessions WHERE token=?", t);
  c.delete("sw_staff");
}

/* tiny in-memory rate limiter (swap for Redis in multi-instance deploys) */
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length <= max;
}
