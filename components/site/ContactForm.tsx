"use client";
import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | string>("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json();
    setState(j.ok ? "done" : j.error ?? "Something went wrong.");
  }
  if (state === "done") return <div className="card grid place-items-center p-12 text-center"><div className="text-5xl">💌</div><h3 className="h-md mt-4">Thanks — message received.</h3><p className="mt-2 text-ink-2">We&apos;ll reply within one working day.</p></div>;
  return (
    <form onSubmit={submit} className="card p-8">
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div><label className="label !mt-0" htmlFor="n">Your name</label><input id="n" name="name" className="input" required /></div>
        <div><label className="label !mt-0" htmlFor="b">Business</label><input id="b" name="business" className="input" /></div>
      </div>
      <label className="label" htmlFor="e">Email</label><input id="e" name="email" type="email" className="input" required />
      <label className="label" htmlFor="m">How can we help?</label><textarea id="m" name="message" rows={5} className="input" required />
      <button className="btn btn-dark mt-6" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
      {state !== "idle" && state !== "sending" && <p className="mt-3 text-sm font-medium text-tomato" role="alert">{state}</p>}
    </form>
  );
}
