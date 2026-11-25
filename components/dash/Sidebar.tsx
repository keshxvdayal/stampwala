"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo, Menu, Close } from "@/components/ui/icons";

const NAV = [
  ["/dashboard", "Overview", "◧"], ["/dashboard/customers", "Customers", "👥"], ["/dashboard/program", "Card & rewards", "🎴"],
  ["/dashboard/campaigns", "Campaigns", "📣"], ["/dashboard/messages", "Messages", "💬"], ["/dashboard/analytics", "Analytics", "📈"],
  ["/dashboard/team", "Team & outlets", "🏪"], ["/dashboard/qr", "QR & counter", "▦"], ["/dashboard/settings", "Settings", "⚙️"],
] as const;

export function Sidebar({ name, slug, plan }: { name: string; slug: string; plan: string }) {
  const path = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const body = (
    <>
      <Link href="/" className="px-3"><Logo light /></Link>
      <div className="mx-3 mt-7 rounded-2xl bg-white/[0.07] p-4"><div className="text-[11px] font-bold uppercase tracking-widest text-[#8fb5a2]">Business</div><div className="mt-1 font-semibold">{name}</div><span className="chip amber mt-2 capitalize">{plan} plan</span></div>
      <nav className="mt-6 flex-1 space-y-1" aria-label="Dashboard">
        {NAV.map(([href, label, icon]) => {
          const on = href === "/dashboard" ? path === href : path.startsWith(href);
          return <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={on ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors ${on ? "bg-wa/15 text-[#7dffb0] shadow-[inset_0_0_0_1px_rgba(37,211,102,.35)]" : "text-[#cfe3d8] hover:bg-white/10"}`}><span className="w-5 text-center">{icon}</span>{label}</Link>;
        })}
      </nav>
      <div className="space-y-2 px-1">
        <Link href={`/t/${slug}`} target="_blank" className="btn btn-wa btn-sm w-full">Open counter terminal ↗</Link>
        <Link href={`/j/${slug}`} target="_blank" className="btn btn-line light btn-sm w-full">Customer card ↗</Link>
        <button className="w-full py-2 text-sm font-semibold text-[#8fb5a2] hover:text-white" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }}>Log out</button>
      </div>
    </>
  );
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 flex-col border-r border-white/10 bg-[#061a12] p-4 text-white lg:flex">{body}</aside>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-forest px-4 py-3 text-white lg:hidden"><Logo light /><button onClick={() => setOpen(!open)} aria-label="Menu">{open ? <Close /> : <Menu />}</button></div>
      {open && <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-forest p-4 pt-20 text-white lg:hidden">{body}</div>}
    </>
  );
}
