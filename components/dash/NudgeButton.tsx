"use client";
import { useState } from "react";
export function NudgeButton({ id, label = "Nudge" }: { id: number; label?: string }) {
  const [s, setS] = useState<"idle" | "busy" | "sent" | "err">("idle");
  return (
    <button disabled={s !== "idle"} onClick={async () => { setS("busy"); const r = await fetch("/api/customers/nudge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setS(r.ok ? "sent" : "err"); }}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${s === "sent" ? "bg-white/10 text-muted" : s === "err" ? "bg-[#fbd9ce] text-[#8a2a0c]" : "bg-wa text-[#05301a] hover:brightness-105"}`}>
      {s === "busy" ? "…" : s === "sent" ? "Sent ✓" : s === "err" ? "Failed" : label}
    </button>
  );
}
