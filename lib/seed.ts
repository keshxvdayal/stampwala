import type { DatabaseSync } from "node:sqlite";
import { hash, token } from "./crypto";
import { DEFAULT_CAMPAIGNS } from "./defaults";

// Deterministic PRNG so the demo data is stable between runs.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const FIRST = ["Ananya","Rohan","Priya","Arjun","Meera","Karan","Sneha","Vikram","Isha","Aditya","Kavya","Rahul","Neha","Siddharth","Pooja","Aman","Divya","Nikhil","Riya","Harsh","Tanvi","Yash","Shreya","Dev","Aarav","Ira","Kabir","Naina","Rehan","Zoya"];
const LAST = ["Sharma","Mehta","Iyer","Kapoor","Nair","Singh","Reddy","Gupta","Joshi","Desai","Bose","Khan","Patel","Verma","Menon"];

export function seedIfEmpty(d: DatabaseSync) {
  const n = d.prepare("SELECT COUNT(*) c FROM businesses").get() as { c: number };
  if (n.c > 0) return;
  const r = rng(42);
  const DAY = 86400000;
  const now = Date.now();

  const biz = d
    .prepare(
      "INSERT INTO businesses (slug,name,category,owner_name,email,password_hash,plan,wa_number,created_at) VALUES (?,?,?,?,?,?,?,?,?)"
    )
    .run("brew-co", "Brew & Co.", "cafe", "Demo Owner", "demo@stampwala.app", hash("demo1234"), "pro", "919000000000", now - 90 * DAY);
  const bid = Number(biz.lastInsertRowid);

  d.prepare("INSERT INTO programs (business_id,goal,icon,color,reward,min_bill,cooldown_hours,happy_days,happy_mult) VALUES (?,?,?,?,?,?,?,?,?)").run(
    bid, 6, "☕", "#0B3B2C", "free cappuccino", 100, 4, "2", 2
  );

  const o1 = Number(d.prepare("INSERT INTO outlets (business_id,name,city) VALUES (?,?,?)").run(bid, "Indiranagar", "Bengaluru").lastInsertRowid);
  const o2 = Number(d.prepare("INSERT INTO outlets (business_id,name,city) VALUES (?,?,?)").run(bid, "Koramangala", "Bengaluru").lastInsertRowid);
  const staffIns = d.prepare("INSERT INTO staff (business_id,outlet_id,name,pin_hash,role) VALUES (?,?,?,?,?)");
  const s1 = Number(staffIns.run(bid, o1, "Asha", hash("1234"), "manager").lastInsertRowid);
  const s2 = Number(staffIns.run(bid, o1, "Ravi", hash("5678"), "cashier").lastInsertRowid);
  const s3 = Number(staffIns.run(bid, o2, "Meghna", hash("4321"), "cashier").lastInsertRowid);
  const staffPool = [
    [s1, o1],
    [s2, o1],
    [s3, o2],
  ];

  for (const c of DEFAULT_CAMPAIGNS)
    d.prepare("INSERT INTO campaigns (business_id,type,name,trigger_days,message,bonus_stamps,enabled,sent_count,last_run) VALUES (?,?,?,?,?,?,?,?,?)").run(
      bid, c.type, c.name, c.trigger_days, c.message, c.bonus_stamps, 1, Math.floor(r() * 40) + 8, now - 2 * DAY
    );

  const goal = 6;
  const memIns = d.prepare(
    "INSERT INTO members (business_id,phone,name,lang,birthday,token,ref_code,stamps,total_visits,total_spend,rewards_earned,last_visit,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
  );
  const visIns = d.prepare("INSERT INTO visits (business_id,member_id,outlet_id,staff_id,bill,stamps_added,method,at) VALUES (?,?,?,?,?,?,?,?)");
  const vouIns = d.prepare("INSERT INTO vouchers (business_id,member_id,code,reward,status,created_at,redeemed_at) VALUES (?,?,?,?,?,?,?)");

  d.exec("BEGIN");
  for (let i = 0; i < 64; i++) {
    const name = `${FIRST[i % FIRST.length]} ${LAST[Math.floor(r() * LAST.length)]}`;
    const phone = `9198${String(10000000 + Math.floor(r() * 89999999))}`;
    const joined = now - Math.floor(r() * 85 + 3) * DAY;
    const lifespan = (now - joined) / DAY;
    // behaviour archetypes: loyal / casual / lapsed
    const kind = r();
    const gap = kind < 0.3 ? 3 + r() * 3 : kind < 0.7 ? 8 + r() * 8 : 14 + r() * 10;
    const lapsed = kind > 0.82;
    const endAt = lapsed ? now - (22 + r() * 18) * DAY : now - r() * 4 * DAY;

    let t = joined + r() * DAY;
    let stamps = 0, visits = 0, spend = 0, rewards = 0, last: number | null = null;
    const memId = Number(
      memIns.run(bid, phone, name, r() > 0.8 ? "hi" : "en",
        r() > 0.7 ? `${String(Math.floor(r() * 12) + 1).padStart(2, "0")}-${String(Math.floor(r() * 28) + 1).padStart(2, "0")}` : null,
        token(8), "R" + token(3).toUpperCase(), 0, 0, 0, 0, null, joined).lastInsertRowid
    );
    const vouchers: [string, number][] = [];
    while (t < endAt && lifespan > 1) {
      const bill = Math.round((120 + r() * 380) / 10) * 10;
      const [sid, oid] = staffPool[Math.floor(r() * 3)];
      const day = new Date(t).getDay();
      const add = day === 2 ? 2 : 1;
      visIns.run(bid, memId, oid, sid, bill, add, "code", Math.floor(t));
      stamps += add; visits++; spend += bill; last = Math.floor(t);
      if (stamps >= goal) { stamps -= goal; rewards++; vouchers.push(["VIP-" + token(2).toUpperCase(), Math.floor(t)]); }
      t += (gap + r() * 3 - 1.5) * DAY;
    }
    vouchers.forEach(([code, at], idx) => {
      const redeemed = idx < vouchers.length - (r() > 0.6 ? 1 : 0);
      vouIns.run(bid, memId, code, "free cappuccino", redeemed ? "redeemed" : "active", at, redeemed ? at + 3 * DAY : null);
    });
    d.prepare("UPDATE members SET stamps=?,total_visits=?,total_spend=?,rewards_earned=?,last_visit=? WHERE id=?").run(stamps, visits, spend, rewards, last, memId);
  }
  d.exec("COMMIT");

  const msg = d.prepare("INSERT INTO messages (business_id,member_id,direction,kind,body,status,at) VALUES (?,?,?,?,?,?,?)");
  const samples = [
    ["winback", "Hi Ananya! It's been a while 💛 Come in this week and we'll add a bonus stamp to your Brew & Co. card."],
    ["stamp", "✅ +1 stamp added! 2 more for your free cappuccino."],
    ["reward", "🎉 Reward unlocked! Your free cappuccino voucher: VIP-7KQ2"],
    ["birthday", "Happy birthday Rohan! 🎂 We've added 2 bonus stamps to your card."],
  ];
  samples.forEach(([k, b], i) => msg.run(bid, i + 1, "out", k, b, "delivered", now - (i + 1) * 3600000 * 5));
}
