import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { Reveal } from "./Reveal";

export function Cta({ title = "Your next regular is at the counter right now.", sub = "Put a QR on the counter today. Start free and see your first member in minutes." }) {
  return (
    <section className="pb-24">
      <div className="wrap">
        <Reveal className="relative overflow-hidden rounded-[44px] bg-forest px-6 py-20 text-center text-white md:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-wa/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-[380px] rounded-full bg-saffron/20 blur-3xl" />
          <h2 className="h-lg relative mx-auto max-w-3xl">{title}</h2>
          <p className="lead relative mx-auto mt-5 max-w-xl !text-[#cfe3d8]">{sub}</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn btn-wa">Start free <Arrow /></Link>
            <Link href="/demo" className="btn btn-line light">Try the live demo</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
