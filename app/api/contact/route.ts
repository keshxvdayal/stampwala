import { run } from "@/lib/db";
import { rateLimit } from "@/lib/auth";
import { bad, body, ip, json, str } from "@/lib/http";
export async function POST(req: Request) {
  if (!rateLimit("contact:" + ip(req), 5, 3600000)) return bad("Too many messages. Try later.", 429);
  const b = await body(req);
  const email = str(b.email, 120);
  if (!/^\S+@\S+\.\S+$/.test(email) || !str(b.message, 2000)) return bad("Please add a valid email and a message.");
  run("INSERT INTO leads (name,email,business,message,at) VALUES (?,?,?,?,?)", str(b.name, 80), email, str(b.business, 80), str(b.message, 2000), Date.now());
  return json({ ok: true });
}
