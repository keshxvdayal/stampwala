import Link from "next/link";
import { Logo } from "@/components/ui/icons";

export function AuthShell({ title, sub, children, foot }: { title: string; sub: string; children: React.ReactNode; foot: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-forest p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-wa/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-0 size-[360px] rounded-full bg-saffron/20 blur-3xl" />
        <Link href="/" className="relative"><Logo light /></Link>
        <div className="relative">
          <h2 className="h-lg max-w-md">Your regulars deserve to be remembered.</h2>
          <ul className="mt-10 space-y-4 text-[17px] text-[#cfe3d8]">
            {["Free plan — no card needed", "Set up in about ten minutes", "One-time codes stop fake stamps", "Win-back messages run on autopilot"].map((t) => <li key={t} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-wa text-xs font-bold text-[#05301a]">✓</span>{t}</li>)}
          </ul>
        </div>
        <div className="relative w-64 -rotate-3 rounded-2xl bg-saffron p-5 text-ink shadow-[var(--shadow-pop)]"><div className="text-xs font-bold uppercase tracking-wider opacity-70">Brew &amp; Co. Club</div><div className="mt-2 text-3xl tracking-[0.2em]">☕☕☕☕☕🎁</div><div className="mt-1 text-sm font-semibold">1 more for a free coffee</div></div>
      </div>
      <div className="flex flex-col justify-center px-6 py-14 sm:px-14">
        <Link href="/" className="mb-10 lg:hidden"><Logo /></Link>
        <div className="mx-auto w-full max-w-md">
          <h1 className="h-lg !text-[2.5rem]">{title}</h1>
          <p className="mt-2 text-ink-2">{sub}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-[15px] text-ink-2">{foot}</p>
        </div>
      </div>
    </div>
  );
}
