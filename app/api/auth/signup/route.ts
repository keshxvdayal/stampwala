import { get, run, tx } from "@/lib/db";
import { hash } from "@/lib/crypto";
import { createSession, rateLimit } from "@/lib/auth";
import { bad, body, ip, json, str } from "@/lib/http";
import { CATEGORIES, DEFAULT_CAMPAIGNS } from "@/lib/defaults";

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "shop";

export async function POST(req: Request) {
  if (!rateLimit("signup:" + ip(req), 10, 3600000)) return bad("Too many attempts. Try again later.", 429);
  const b = await body(req);
  const name = str(b.business, 60), owner = str(b.owner, 60), email = str(b.email, 120).toLowerCase(), pw = str(b.password, 100);
  const cat = CATEGORIES[str(b.category)] ? str(b.category) : "cafe";
  if (!name || !owner) return bad("Tell us your name and your business name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return bad("Enter a valid email.");
  if (pw.length < 8) return bad("Password must be at least 8 characters.");
  if (get("SELECT 1 FROM businesses WHERE email=?", email)) return bad("An account with this email already exists.", 409);

  let slug = slugify(name), i = 2;
  while (get("SELECT 1 FROM businesses WHERE slug=?", slug)) slug = `${slugify(name)}-${i++}`;

  const id = tx(() => {
    const bid = run(
      "INSERT INTO businesses (slug,name,category,owner_name,email,password_hash,plan,created_at) VALUES (?,?,?,?,?,?,?,?)",
      slug, name, cat, owner, email, hash(pw), "growth", Date.now()
    ).id;
    run("INSERT INTO programs (business_id,icon,reward) VALUES (?,?,?)", bid, CATEGORIES[cat].icon, CATEGORIES[cat].reward);
    const oid = run("INSERT INTO outlets (business_id,name) VALUES (?,?)", bid, "Main outlet").id;
    run("INSERT INTO staff (business_id,outlet_id,name,pin_hash,role) VALUES (?,?,?,?,?)", bid, oid, owner, hash("1234"), "manager");
    for (const c of DEFAULT_CAMPAIGNS)
      run("INSERT INTO campaigns (business_id,type,name,trigger_days,message,bonus_stamps) VALUES (?,?,?,?,?,?)", bid, c.type, c.name, c.trigger_days, c.message, c.bonus_stamps);
    return bid;
  });
  await createSession(id);
  return json({ ok: true, slug });
}
