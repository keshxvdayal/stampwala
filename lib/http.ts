import { NextResponse } from "next/server";
export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try { return (await req.json()) as T; } catch { return {} as T; }
}
export const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const num = (v: unknown, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
export const ip = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
