import Link from "next/link";
import { Arrow, Check } from "@/components/ui/icons";
import { ChatPhone } from "@/components/site/ChatPhone";
import { Marquee, SectionHead } from "@/components/site/bits";
import { Reveal } from "@/components/site/Reveal";
import { Demo } from "@/components/site/Demo";
import { DashPreview } from "@/components/site/DashPreview";
import { Roi } from "@/components/site/Roi";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Cta } from "@/components/site/Cta";
import { Spark } from "@/components/dash/charts";
import { QrArt } from "@/components/site/QrArt";
import { INDUSTRIES } from "@/lib/content";

const problems = [
  ["01", "Cards get lost", "Wallets, washing machines, the bin. The customer forgets their progress — and so do you."],
  ["02", "Nobody installs an app", "Asking someone in a queue to download and sign up is a conversion killer. Most simply say no."],
  ["03", "You never learn who they are", "No phone number, no way to say “we miss you”. A regular who vanishes is just gone."],
  ["04", "Stamps get gamed", "Photograph the QR, stamp a friend's card, re-scan ten times. Most tools can't tell a visit from a trick."],
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-10 pt-12 md:pt-20">
        <div className="aurora"><i /><i /><i /></div>
        <div className="grid-bg" />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow"><i />Built for Indian cafés, salons &amp; shops</span>
            <h1 className="h-xl mt-8 text-[clamp(2.9rem,6.2vw,5.5rem)]">
              Loyalty that lives in <span className="grad-text italic">WhatsApp.</span>
            </h1>
            <p className="lead mt-8 max-w-xl">A stamp card inside the app your customers already open fifty times a day. No download, no lost cards, no fake stamps — and an automatic nudge that brings regulars back when they drift.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-dark !h-14 !px-8 !text-base">Start free — no card needed <Arrow /></Link>
              <Link href="/demo" className="btn btn-line !h-14 !px-8 !text-base">▶ Try the live demo</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-[14.5px] font-medium text-ink-2">
              {["Free plan, forever", "Live in 10 minutes", "Cash, card & UPI", "No hardware"].map((t) => <li key={t} className="flex items-center gap-2"><span className="text-wa"><Check size={16} /></span>{t}</li>)}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] py-6">
            <div className="glow-ring" />
            <div className="relative z-[1] -rotate-2"><ChatPhone /></div>
            <div className="glass absolute -left-4 top-10 z-10 hidden animate-float rounded-2xl px-4 py-3 md:block" style={{ ["--r" as string]: "-3deg" }}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-2">One-time code</div>
              <div className="font-mono text-2xl font-bold tracking-[0.25em] text-wa">4821</div>
            </div>
            <div className="glass absolute -right-2 top-40 z-10 hidden animate-float rounded-2xl px-4 py-3 md:block" style={{ ["--r" as string]: "3deg", animationDelay: "-2s" }}>
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-saffron text-lg">🎉</span><div><b className="block text-sm">Reward unlocked</b><span className="text-xs text-ink-2">Ananya · free cappuccino</span></div></div>
            </div>
            <div className="glass absolute -left-10 bottom-16 z-10 hidden w-60 animate-float rounded-2xl p-4 md:block" style={{ ["--r" as string]: "2deg", animationDelay: "-4s" }}>
              <div className="flex items-center justify-between text-xs text-ink-2"><span>Repeat visits</span><span className="chip !px-2 !py-0.5 !text-[11px]">sample</span></div>
              <div className="mt-1 font-display text-3xl font-bold">+38%</div>
              <Spark data={[3, 5, 4, 7, 6, 9, 8, 12, 11, 15]} color="#25d366" />
            </div>
            <div className="glass absolute -right-6 bottom-10 z-10 hidden animate-float rounded-2xl px-4 py-3 md:block" style={{ ["--r" as string]: "-2deg", animationDelay: "-1s" }}>
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-wa/90 text-lg text-[#04210f]">🔁</span><div><b className="block text-sm">Win-back sent</b><span className="text-xs text-ink-2">12 regulars nudged</span></div></div>
            </div>
          </div>
        </div>

        <div className="wrap relative mt-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[["0", "apps to install"], ["3 sec", "scan to stamp"], ["2 min", "code lifetime"], ["₹0", "to start"]].map(([v, l]) => (
              <div key={l} className="glass rounded-2xl px-6 py-5"><div className="grad-text font-display text-4xl font-bold">{v}</div><div className="text-sm text-ink-2">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={["Cafés", "Bakeries", "Salons", "Restaurants", "Kirana stores", "Gyms", "Juice bars", "Boutiques", "Sweet shops"]} />

      {/* PROBLEM */}
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <SectionHead eyebrow="The problem" title={<>Four ways loyalty quietly <span className="marker">leaks money.</span></>} sub="Paper cards, install-an-app programs and “I'll remember you” all fail in the same moments — and you never see the sales you didn't get." />
          <div className="divide-y divide-line">
            {problems.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 70} className="grid grid-cols-[56px_1fr] gap-4 py-7 first:pt-0">
                <span className="font-display text-3xl font-bold text-saffron">{n}</span>
                <div><h3 className="h-md">{t}</h3><p className="mt-2 text-ink-2">{d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="section bg-paper-2/70">
        <div className="wrap">
          <SectionHead center eyebrow="How it works" title="Scan. Verify. Reward." sub="Three steps, no training. Your cashier already knows how to do it." />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Reveal className="card g-green flex flex-col p-8">
              <span className="chip amber w-fit">Step 1</span>
              <div className="my-8 grid place-items-center"><div className="rounded-3xl bg-white p-4 shadow-[var(--shadow-soft)]"><QrArt size={140} /></div></div>
              <h3 className="h-md">Customer scans the counter QR</h3>
              <p className="mt-3 text-ink-2">Their phone camera opens your club card. First time? One tap to join — no password, no app.</p>
            </Reveal>
            <Reveal delay={90} className="card g-amber flex flex-col p-8">
              <span className="chip amber w-fit">Step 2</span>
              <div className="my-8 grid place-items-center"><div className="w-full max-w-[220px] rounded-2xl border-2 border-dashed border-leaf/50 bg-mint/60 p-5 text-center"><div className="text-[11px] font-bold uppercase tracking-widest text-leaf">Show cashier</div><div className="font-mono text-5xl font-bold tracking-[0.2em] text-forest">4821</div><div className="mt-1 text-xs text-muted">expires in 1:48</div></div></div>
              <h3 className="h-md">One-time code, entered with the bill</h3>
              <p className="mt-3 text-ink-2">The cashier types the code and the amount. No code, no stamp — so photos of the QR are worthless.</p>
            </Reveal>
            <Reveal delay={180} className="card g-blue flex flex-col p-8">
              <span className="chip amber w-fit">Step 3</span>
              <div className="my-8 grid place-items-center"><div className="w-full max-w-[230px] rounded-2xl p-4 text-white" style={{ background: "#0B3B2C" }}><div className="font-display font-bold">Brew &amp; Co. Club</div><div className="mt-3 grid grid-cols-6 gap-1.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className={`grid aspect-square place-items-center rounded-full text-xs ${i < 5 ? "bg-white" : "border-2 border-saffron bg-saffron/30"}`}>{i < 5 ? "☕" : "🎁"}</div>)}</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25"><div className="h-full w-[83%] bg-saffron" /></div></div></div>
              <h3 className="h-md">Reward arrives. Regulars return.</h3>
              <p className="mt-3 text-ink-2">Full card → voucher on their phone. Gone quiet for three weeks → a friendly nudge, automatically.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BENTO */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="What's inside" title={<>Everything you need. <span className="text-muted">Nothing you don&apos;t.</span></>} />
          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <Reveal className="card g-green overflow-hidden p-8 lg:col-span-7">
              <span className="chip">Fraud-proof</span>
              <h3 className="h-md mt-4">Stamps that can&apos;t be faked.</h3>
              <p className="mt-2 max-w-md text-ink-2">One-time codes, cooldowns, a minimum bill and staff PINs. Every manual override is logged.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[["🔐", "One-time code", "Expires in 2 min"], ["⏱️", "Cooldown", "1 stamp / 4 hrs"], ["🧾", "Minimum bill", "₹100 default"]].map(([i, t, d]) => <div key={t} className="rounded-2xl bg-paper p-4"><div className="text-2xl">{i}</div><b className="mt-2 block text-[15px]">{t}</b><span className="text-sm text-muted">{d}</span></div>)}
              </div>
            </Reveal>
            <Reveal delay={80} className="card g-blue p-8 lg:col-span-5">
              <span className="chip">Languages</span>
              <h3 className="h-md mt-4">Speaks your customers&apos; language.</h3>
              <p className="mt-2 text-ink-2">Customers pick English or हिन्दी, and every message follows. More Indian languages are on the roadmap.</p>
              <div className="mt-7 flex flex-wrap gap-2">{["English", "हिन्दी", "தமிழ் · soon", "తెలుగు · soon", "मराठी · soon", "বাংলা · soon"].map((l, i) => <span key={l} className={`rounded-full border px-4 py-2 text-sm font-semibold ${i < 2 ? "border-wa/60 bg-wa/20 text-white" : "border-line bg-paper text-muted"}`}>{l}</span>)}</div>
            </Reveal>
            <Reveal className="card g-amber p-8 lg:col-span-4">
              <span className="chip">Win-back</span>
              <h3 className="h-md mt-4">Brings drifters back.</h3>
              <div className="mt-6 space-y-3">
                {[["Day 0", "Last visit"], ["Day 21", "Auto nudge + bonus stamp"], ["Day 24", "Back in store ✓"]].map(([d, t], i) => <div key={d} className="flex items-center gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${i === 1 ? "bg-saffron" : "bg-mint"}`}>{i + 1}</span><div><b className="text-sm">{d}</b><div className="text-sm text-muted">{t}</div></div></div>)}
              </div>
            </Reveal>
            <Reveal delay={80} className="card g-green p-8 lg:col-span-4">
              <span className="chip">Tiers & happy hours</span>
              <h3 className="h-md mt-4">Reward your best, fill your slow hours.</h3>
              <div className="mt-6 flex items-end gap-2">{[["Silver", 34, "#B9C2BD"], ["Gold", 56, "#E0A030"], ["Platinum", 80, "#0B3B2C"]].map(([n, h, c]) => <div key={n as string} className="flex-1 text-center"><div className="rounded-t-xl" style={{ height: h as number, background: c as string }} /><small className="mt-1 block text-xs font-semibold">{n}</small></div>)}</div>
              <p className="mt-4 text-sm text-ink-2">Plus 2×–5× stamp days — “Tuesdays are double”.</p>
            </Reveal>
            <Reveal delay={160} className="card g-pink p-8 lg:col-span-4">
              <span className="chip">Referrals</span>
              <h3 className="h-md mt-4">Your customers recruit for you.</h3>
              <p className="mt-2 text-ink-2">A personal link inside every card. When a friend makes a first purchase, both get a bonus stamp.</p>
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-paper p-3 text-sm"><span className="grid size-9 place-items-center rounded-full bg-wa text-lg">👥</span><b>wa.me/join/ANU-24</b></div>
            </Reveal>
            <Reveal className="card g-blue overflow-hidden p-8 lg:col-span-6">
              <span className="chip">Multi-outlet</span>
              <h3 className="h-md mt-4">One card, every branch.</h3>
              <p className="mt-2 max-w-md text-ink-2">Stamp at any outlet. Per-outlet staff PINs and reports, one shared customer base.</p>
              <div className="mt-6 flex flex-wrap gap-3">{["Indiranagar", "Koramangala", "HSR Layout"].map((o) => <span key={o} className="rounded-2xl border border-line bg-paper px-4 py-2.5 text-sm font-semibold">📍 {o}</span>)}</div>
            </Reveal>
            <Reveal delay={80} className="card g-amber p-8 lg:col-span-6">
              <span className="chip">Your data</span>
              <h3 className="h-md mt-4">Consent built in. Export anytime.</h3>
              <p className="mt-2 max-w-md text-ink-2">Customers consent on join and can send STOP. You can download your whole customer list as CSV — no lock-in.</p>
              <Link href="/privacy" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-leaf">How we handle data <Arrow size={15} /></Link>
            </Reveal>
          </div>
          <div className="mt-10 text-center"><Link href="/features" className="btn btn-line">See every feature <Arrow /></Link></div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="section border-y border-line bg-[#06180f] text-white">
        <div className="wrap">
          <SectionHead dark center eyebrow="Not a mockup — it works" title={<>Be the customer <em className="pr-1.5 text-saffron">and</em> the cashier.</>} sub="Design your card on the left, collect stamps in the middle, verify them on the right. Try to cheat it." />
          <div className="mt-14"><Demo /></div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="section bg-[#06180f] pt-0 text-white">
        <div className="wrap">
          <SectionHead dark eyebrow="Owner dashboard" title="See who's loyal, who's slipping, and what it's worth." sub="Repeat rate, revenue from members, at-risk regulars and busiest hours — one screen, updated live." />
          <Reveal className="mt-12"><DashPreview /></Reveal>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Built for" title="Whatever you sell, regulars are the business." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i, n) => (
              <Reveal key={i.slug} delay={n * 60}>
                <Link href={`/industries/${i.slug}`} className="card group block h-full p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-pop)]">
                  <div className="grid size-14 place-items-center rounded-2xl text-3xl" style={{ background: i.color + "18" }}>{i.icon}</div>
                  <h3 className="h-md mt-5">{i.name}</h3>
                  <p className="mt-2 text-[15px] text-ink-2">{i.headline}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-leaf">Learn more <Arrow size={15} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="section bg-paper-2/70">
        <div className="wrap">
          <SectionHead center eyebrow="Do the maths" title="What are a few extra visits worth?" sub="Move the sliders. We use a deliberately cautious lift — you decide what's realistic." />
          <Roi />
        </div>
      </section>

      {/* PRICING */}
      <section className="section">
        <div className="wrap text-center">
          <SectionHead center eyebrow="Pricing" title="Start free. Pay when it pays you back." sub="Simple monthly prices in rupees. No setup fee, no per-stamp charges." />
          <Pricing compact />
          <Link href="/pricing" className="mt-10 inline-flex items-center gap-2 font-bold text-leaf">Compare all plan details <Arrow size={16} /></Link>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap"><SectionHead center eyebrow="FAQ" title="Straight answers." /><Faq limit={6} /></div>
      </section>
      <Cta />
    </>
  );
}
