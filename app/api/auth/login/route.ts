import { get } from "@/lib/db";
import { verify } from "@/lib/crypto";
import { createSession, rateLimit } from "@/lib/auth";
import { bad, body, ip, json, str } from "@/lib/http";

export async function POST(req: Request) {
  if (!rateLimit("login:" + ip(req), 10, 600000)) return bad("Too many attempts. Try again in a few minutes.", 429);
  const b = await body(req);
  const row = get<{ id: number; password_hash: string }>("SELECT id,password_hash FROM businesses WHERE email=?", str(b.email, 120).toLowerCase());
  if (!row || !verify(str(b.password, 100), row.password_hash)) return bad("Wrong email or password.", 401);
  await createSession(row.id);
  return json({ ok: true });
}
