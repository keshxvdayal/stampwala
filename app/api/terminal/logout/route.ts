import { destroyStaffSession } from "@/lib/auth";
import { json } from "@/lib/http";
export async function POST() { await destroyStaffSession(); return json({ ok: true }); }
