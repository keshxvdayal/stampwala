import { getBusiness } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { hash } from "@/lib/crypto";
import { bad, body, json, num, str } from "@/lib/http";

export async function POST(req: Request) {
  const biz = await getBusiness();
  if (!biz) return bad("Sign in", 401);
  const b = await body(req);
  const pin = str(b.pin, 8), name = str(b.name, 40);
  if (!name) return bad("Name is required.");
  if (!/^\d{4,6}$/.test(pin)) return bad("PIN must be 4–6 digits.");
  if (!get("SELECT 1 FROM outlets WHERE id=? AND business_id=?", num(b.outlet), biz.id)) return bad("Choose an outlet.");
  run("INSERT INTO staff (business_id,outlet_id,name,pin_hash,role) VALUES (?,?,?,?,?)", biz.id, num(b.outlet), name, hash(pin), b.role === "manager" ? "manager" : "cashier");
  return json({ ok: true });
}
export async function DELETE(req: Request) {
  const biz = await getBusiness();
  if (!biz) return bad("Sign in", 401);
  run("UPDATE staff SET active=0 WHERE id=? AND business_id=?", num((await body(req)).id), biz.id);
  return json({ ok: true });
}
