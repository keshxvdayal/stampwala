import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/site/bits";
import { Reveal } from "@/components/site/Reveal";
import { Cta } from "@/components/site/Cta";

export const metadata: Metadata = { title: "Features", description: "Fraud-proof stamps, win-back automation, referrals, tiers, happy hours, multi-outlet and analytics — everything in Stampwala." };

const groups = [
  { id: "collect", title: "Collect", sub: "The in-store experience customers and cashiers touch every day.", items: [
    ["📷", "Scan-to-join", "A counter QR opens your branded card. One tap to join, no password, no app."],
    ["🔐", "One-time cashier codes", "A 4-digit code that expires in 2 minutes, entered with the bill. Screenshots of the QR earn nothing."],
    ["⏱️", "Per-customer cooldown", "One stamp per customer every N hours (default 4). Stops stamp-farming in a single sitting."],
    ["🧾", "Minimum bill", "Set the spend that earns a stamp. A ₹10 purchase can't be repeated ten times."],
    ["🎴", "Designable card", "Choose stamp count, icon, colour and reward. Your card, your brand."],
    ["🖥️", "Counter terminal", "A PIN-protected screen for any phone, tablet or laptop. Recent stamps, redemption and manager override."],
  ]},
  { id: "grow", title: "Grow", sub: "Automations that bring people back and bring friends in.", items: [
    ["🔁", "Automatic win-back", "Silent for 21 days (you pick the number)? A personal message with a bonus stamp goes out on its own."],
    ["🎂", "Birthday rewards", "Collect birthdays once, send a bonus every year. No spreadsheets."],
    ["👋", "Welcome nudge", "New members who haven't visited yet get a friendly reminder that their first stamp is waiting."],
    ["👥", "Referral rewards", "A personal link in every card. When a friend makes a first purchase, both get bonus stamps."],
    ["⚡", "Happy-hour multipliers", "2× to 5× stamps on the days you choose. Fill Tuesday without discounting the menu."],
    ["🥇", "Silver / Gold / Platinum", "Automatic tiers by visits so you can spot and treat your best customers."],
  ]},
  { id: "control", title: "Control", sub: "The owner view: what's working, who's slipping, who did what.", items: [
    ["📊", "Live analytics", "Repeat rate, revenue from members, visits trend, busiest weekdays and hours."],
    ["⚠️", "At-risk list", "Regulars who used to visit often and have gone quiet — with a one-tap nudge."],
    ["🏪", "Multi-outlet", "Stamp at any branch, see per-outlet performance, one shared customer base."],
    ["🧑‍🍳", "Staff PINs & audit trail", "Every stamp is tied to a person and an outlet. Manual overrides are flagged."],
    ["📤", "CSV export", "Your customer list is yours. Download it any time."],
    ["🛡️", "Consent & opt-out", "Members consent on join and can send STOP at any time. Opted-out customers are never messaged."],
  ]},
];

export default function Features() {
  return (
    <>
      <PageHero eyebrow="Features" title={<>Built around what actually <span className="marker">fills the shop.</span></>} sub="Every feature below is in the product today. Anything still on the roadmap is labelled as such." />
      <div className="wrap mt-10 flex flex-wrap gap-2">{groups.map((g) => <a key={g.id} href={`#${g.id}`} className="rounded-full border border-line bg-card px-5 py-2 text-sm font-semibold hover:border-forest">{g.title}</a>)}</div>
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="section scroll-mt-20 !pb-6">
          <div className="wrap">
            <SectionHead title={g.title} sub={g.sub} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map(([i, t, d], n) => (
                <Reveal key={t} delay={(n % 3) * 70} className="card h-full p-7">
                  <div className="grid size-12 place-items-center rounded-2xl bg-mint text-2xl">{i}</div>
                  <h3 className="h-md mt-5 !text-[1.35rem]">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="On the roadmap" title="What we're building next." sub="Not shipped yet — listed so you know where we're headed, not to pad the list." />
          <div className="mt-8 flex flex-wrap gap-3">{["Tamil, Telugu, Marathi, Bengali messages", "Google review prompt after a stamp", "POS & UPI integrations", "Spin-the-wheel bonus", "Apple / Google Wallet passes"].map((r) => <span key={r} className="chip gray !px-4 !py-2 !text-sm">{r}</span>)}</div>
        </div>
      </section>
      <Cta />
    </>
  );
}
