"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/defaults";
import { Arrow } from "@/components/ui/icons";

async function post(url: string, data: unknown) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return (await r.json()) as { ok: boolean; error?: string };
}

export function LoginForm() {
  const sp = useSearchParams(); const router = useRouter();
  const demo = sp.get("demo");
  const [email, setEmail] = useState(demo ? "demo@stampwala.app" : "");
  const [password, setPassword] = useState(demo ? "demo1234" : "");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await post("/api/auth/login", { email, password });
    if (r.ok) { router.push("/dashboard"); router.refresh(); } else { setErr(r.error ?? "Couldn't sign in."); setBusy(false); }
  }
  return (
    <form onSubmit={go}>
      <label className="label !mt-0" htmlFor="em">Email</label>
      <input id="em" className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="label" htmlFor="pw">Password</label>
      <input id="pw" className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <p className="mt-3 text-sm font-medium text-tomato" role="alert">{err}</p>}
      <button className="btn btn-dark mt-6 w-full" disabled={busy}>{busy ? "Signing in…" : "Log in"} <Arrow size={16} /></button>
      <button type="button" className="mt-3 w-full rounded-full border border-dashed border-line py-3 text-sm font-semibold text-ink-2 hover:bg-paper-2" onClick={() => { setEmail("demo@stampwala.app"); setPassword("demo1234"); }}>Fill demo account (Brew &amp; Co.)</button>
    </form>
  );
}

export function SignupForm() {
  const sp = useSearchParams(); const router = useRouter();
  const [f, setF] = useState({ business: "", owner: "", email: "", password: "", category: CATEGORIES[sp.get("category") ?? ""] ? sp.get("category")! : "cafe" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await post("/api/auth/signup", f);
    if (r.ok) { router.push("/dashboard?welcome=1"); router.refresh(); } else { setErr(r.error ?? "Couldn't create account."); setBusy(false); }
  }
  return (
    <form onSubmit={go}>
      <label className="label !mt-0" htmlFor="bz">Business name</label>
      <input id="bz" className="input" required value={f.business} onChange={set("business")} placeholder="Brew & Co." />
      <label className="label" htmlFor="cat">What kind of business?</label>
      <select id="cat" className="input" value={f.category} onChange={set("category")}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}</select>
      <label className="label" htmlFor="ow">Your name</label>
      <input id="ow" className="input" required value={f.owner} onChange={set("owner")} autoComplete="name" />
      <label className="label" htmlFor="em2">Email</label>
      <input id="em2" className="input" type="email" required value={f.email} onChange={set("email")} autoComplete="email" />
      <label className="label" htmlFor="pw2">Password</label>
      <input id="pw2" className="input" type="password" required minLength={8} value={f.password} onChange={set("password")} autoComplete="new-password" placeholder="At least 8 characters" />
      {err && <p className="mt-3 text-sm font-medium text-tomato" role="alert">{err}</p>}
      <button className="btn btn-dark mt-6 w-full" disabled={busy}>{busy ? "Creating…" : "Create free account"} <Arrow size={16} /></button>
      <p className="mt-3 text-center text-xs text-muted">By signing up you agree to our Terms and Privacy Policy.</p>
    </form>
  );
}
