"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo, Menu, Close, Arrow } from "@/components/ui/icons";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-paper/85 backdrop-blur-xl border-b border-line" : "border-b border-transparent"}`}>
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="Stampwala home"><Logo /></Link>
        <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 lg:flex" aria-label="Main">
          {LINKS.map((l) => <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">{l.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="px-3 text-[15px] font-semibold text-ink-2 hover:text-ink">Log in</Link>
          <Link href="/signup" className="btn btn-dark btn-sm">Start free <Arrow size={16} /></Link>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <Close /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="wrap flex flex-col gap-1 py-4">
            {LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-paper-2">{l.label}</Link>)}
            <div className="mt-3 flex gap-3">
              <Link href="/login" className="btn btn-line flex-1" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/signup" className="btn btn-dark flex-1" onClick={() => setOpen(false)}>Start free</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
