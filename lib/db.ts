import type { DatabaseSync, SQLInputValue } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { seedIfEmpty } from "./seed";

/**
 * Embedded SQLite (Node's built-in node:sqlite) — zero native deps.
 * Loaded through process.getBuiltinModule so the bundler never touches it.
 * Swap this file for Postgres/Turso in production; every caller goes through
 * the tiny all/get/run helpers below.
 */
const g = globalThis as unknown as { __sw_db?: DatabaseSync };

const SCHEMA = `
CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'cafe',
  owner_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'growth',
  wa_number TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS programs (
  business_id INTEGER PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  goal INTEGER NOT NULL DEFAULT 6,
  icon TEXT NOT NULL DEFAULT '☕',
  color TEXT NOT NULL DEFAULT '#0B3B2C',
  reward TEXT NOT NULL DEFAULT 'free cappuccino',
  min_bill INTEGER NOT NULL DEFAULT 100,
  cooldown_hours INTEGER NOT NULL DEFAULT 4,
  happy_days TEXT NOT NULL DEFAULT '',
  happy_mult INTEGER NOT NULL DEFAULT 2,
  referral_bonus INTEGER NOT NULL DEFAULT 1,
  gold_at INTEGER NOT NULL DEFAULT 10,
  platinum_at INTEGER NOT NULL DEFAULT 25
);
CREATE TABLE IF NOT EXISTS outlets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT
);
CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  outlet_id INTEGER NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'cashier',
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS staff_sessions (
  token TEXT PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  lang TEXT NOT NULL DEFAULT 'en',
  birthday TEXT,
  token TEXT NOT NULL,
  ref_code TEXT NOT NULL,
  referred_by INTEGER,
  stamps INTEGER NOT NULL DEFAULT 0,
  total_visits INTEGER NOT NULL DEFAULT 0,
  total_spend INTEGER NOT NULL DEFAULT 0,
  rewards_earned INTEGER NOT NULL DEFAULT 0,
  last_visit INTEGER,
  opted_out INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  UNIQUE (business_id, phone)
);
CREATE INDEX IF NOT EXISTS idx_members_biz ON members(business_id, last_visit);
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  outlet_id INTEGER,
  staff_id INTEGER,
  bill INTEGER NOT NULL,
  stamps_added INTEGER NOT NULL,
  method TEXT NOT NULL DEFAULT 'code',
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_visits_biz ON visits(business_id, at);
CREATE TABLE IF NOT EXISTS codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_codes ON codes(business_id, code, used);
CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  reward TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  redeemed_at INTEGER
);
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  trigger_days INTEGER NOT NULL DEFAULT 21,
  message TEXT NOT NULL,
  bonus_stamps INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  sent_count INTEGER NOT NULL DEFAULT 0,
  last_run INTEGER
);
CREATE TABLE IF NOT EXISTS campaign_sends (
  campaign_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cs ON campaign_sends(campaign_id, member_id, at);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  member_id INTEGER,
  direction TEXT NOT NULL,
  kind TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'logged',
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_msg ON messages(business_id, at);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, email TEXT, business TEXT, message TEXT, at INTEGER NOT NULL
);
`;

export function db(): DatabaseSync {
  if (!g.__sw_db) {
    const { DatabaseSync: DB } = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    const d = new DB(path.join(dir, "stampwala.db"));
    d.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
    d.exec(SCHEMA);
    g.__sw_db = d;
    seedIfEmpty(d);
  }
  return g.__sw_db;
}

type P = SQLInputValue[];
export function all<T = Record<string, unknown>>(sql: string, ...p: P): T[] {
  // node:sqlite rows have a null prototype; React can't pass those to client components.
  return db().prepare(sql).all(...p).map((r) => ({ ...r })) as T[];
}
export function get<T = Record<string, unknown>>(sql: string, ...p: P): T | undefined {
  const r = db().prepare(sql).get(...p);
  return r ? ({ ...r } as T) : undefined;
}
export function run(sql: string, ...p: P) {
  const r = db().prepare(sql).run(...p);
  return { changes: Number(r.changes), id: Number(r.lastInsertRowid) };
}
export function tx<T>(fn: () => T): T {
  const d = db();
  d.exec("BEGIN");
  try {
    const r = fn();
    d.exec("COMMIT");
    return r;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}
