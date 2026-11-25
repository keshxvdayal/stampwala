import type { Metadata } from "next";
import Link from "next/link";
import { Demo } from "@/components/site/Demo";
import { Arrow } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Live demo", description: "Design a loyalty card, collect stamps as a customer and verify them as a cashier — right in your browser." };

export default function DemoPage() {
  return (
    <section className="bg-forest pb-24 pt-16 text-white md:pt-24">
      <div className="wrap">
        <span className="eyebrow dark"><i />Live demo</span>
        <h1 className="h-xl mt-6 max-w-4xl">Try to <em className="pr-2 text-saffron">cheat</em> it.</h1>
        <p className="lead mt-6 max-w-2xl !text-[#bcd7c9]">Tap <b className="text-white">Scan counter QR</b> to get a code, type it into the cashier screen, and stamp. Then scan twice in a row, enter a wrong code, or use a tiny bill and watch the rules kick in.</p>
        <div className="mt-14"><Demo /></div>
        <div className="mt-16 flex flex-wrap items-center gap-4 rounded-3xl border border-white/15 bg-white/5 p-8">
          <div className="flex-1"><h3 className="h-md">Want to see the real thing?</h3><p className="mt-1 text-[#bcd7c9]">A full sample café with 60+ members, analytics and campaigns is waiting. Log in with <code className="rounded bg-white/10 px-2 py-0.5">demo@stampwala.app</code> / <code className="rounded bg-white/10 px-2 py-0.5">demo1234</code>.</p></div>
          <Link href="/login?demo=1" className="btn btn-wa">Open the sample dashboard <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}
