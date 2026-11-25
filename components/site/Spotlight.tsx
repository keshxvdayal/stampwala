"use client";
import { useEffect } from "react";

/** Sets --mx/--my on whichever .card the pointer is over, powering the hover spotlight. */
export function Spotlight() {
  useEffect(() => {
    const f = (e: PointerEvent) => {
      const c = (e.target as HTMLElement | null)?.closest?.(".card") as HTMLElement | null;
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", f, { passive: true });
    return () => document.removeEventListener("pointermove", f);
  }, []);
  return null;
}
