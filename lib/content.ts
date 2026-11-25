export const PLANS = [
  {
    id: "starter", name: "Starter", blurb: "Try it at one counter. Free for good.", monthly: 0, annual: 0, cta: "Start free",
    features: ["1 outlet · up to 100 members", "Branded stamp card + QR stand file", "One-time cashier codes", "25 business-initiated messages / month", "Stamp & reward replies always free"],
    missing: ["Win-back & birthday automation", "Analytics & CSV export"],
  },
  {
    id: "growth", name: "Growth", blurb: "For a café, salon or shop with real regulars.", monthly: 599, annual: 499, cta: "Start 14-day trial", popular: true,
    features: ["1 outlet · up to 1,000 members", "500 business-initiated messages / month", "Automatic win-back + birthday rewards", "Referral rewards", "Hindi + English", "Analytics dashboard + CSV export"],
    missing: [],
  },
  {
    id: "pro", name: "Pro", blurb: "For busy outlets and small chains.", monthly: 1499, annual: 1249, cta: "Start 14-day trial",
    features: ["Up to 3 outlets · 5,000 members", "2,500 business-initiated messages / month", "VIP tiers & happy-hour multipliers", "Staff PINs, roles & audit trail", "Outlet-level reports", "Happy-hour 2×–5× stamp days", "Priority support"],
    missing: [],
  },
  {
    id: "chain", name: "Chain", blurb: "10+ outlets, franchise or custom needs.", monthly: null, annual: null, cta: "Talk to us",
    features: ["Unlimited outlets & members", "Your own WhatsApp number & branding", "API & POS integrations (scoped with you)", "Dedicated success manager", "DPDP data-processing agreement"],
    missing: [],
  },
] as const;

export const FAQS = [
  ["Does the customer need to download anything?", "No. They scan your counter QR with their phone camera, a branded card page (or WhatsApp chat, once you connect your number) opens, and they tap Join. No app, no password."],
  ["How do you stop people faking stamps?", "A QR code alone never grants a stamp. The customer requests a one-time 4-digit code that expires in two minutes, and the cashier types it in along with the bill. On top of that: a per-customer cooldown (default 4 hours), a minimum bill value, staff PINs so you can see who stamped what, and every manual override is flagged in your audit trail."],
  ["What if a customer doesn't use WhatsApp?", "Then they can't use the WhatsApp card — honestly. In India that's a small minority. The web card page works in any browser, and a manager can stamp by phone number for anyone who can't scan."],
  ["Do I need a POS, scanner or special hardware?", "No. The counter screen runs in any browser on a phone, tablet or laptop you already own. If you have a POS and want stamps issued automatically on billing, Chain plans include integration work scoped with you."],
  ["What do WhatsApp messages cost?", "Replies inside a customer's conversation — codes, stamp confirmations, reward vouchers — are unlimited on every plan. Business-initiated messages (win-back, birthday) use your monthly allowance. Extra packs are ₹0.75 per message and never expire."],
  ["Is customer data safe, and is this legal in India?", "Customers consent on first join and can send STOP any time. You can export every record as CSV, and Chain plans include a DPDP data-processing agreement. We never sell or share your customer list."],
  ["How long does setup take?", "About ten minutes: add your business name, choose a card design, set the reward, print the QR stand. If you'd rather not, our ₹999 setup service does it all for you."],
  ["Can I cancel anytime?", "Yes, in two clicks. Pay for a plan and change your mind within 30 days — you get a full refund. Your data export stays available."],
] as const;

export const INDUSTRIES = [
  {
    slug: "cafes", name: "Cafés & coffee shops", icon: "☕", color: "#0B3B2C", reward: "free cappuccino", goal: 6,
    headline: "Turn the morning rush into a loyalty habit.",
    pitch: "Coffee is a daily ritual — which makes it the best loyalty product there is. Stampwala rewards the 8 a.m. regular without slowing the queue.",
    pains: ["Paper cards vanish into wallets and washing machines", "Queue time doubles when you ask people to install an app", "Slow afternoons stay slow"],
    wins: ["3-second scan, one-time code, done", "2× stamp happy hours for the 3–5 p.m. dip", "Win-back message after 21 quiet days"],
    ideas: ["Buy 6, get the 7th free", "Double stamps on rainy days", "Free upsize on your birthday"],
  },
  {
    slug: "salons", name: "Salons & spas", icon: "💈", color: "#5B2A86", reward: "free add-on service", goal: 5,
    headline: "Keep clients rebooking before they wander off.",
    pitch: "Salon visits are monthly, not daily — so the gap between visits is where you lose clients. Automated recall messages close that gap.",
    pains: ["Clients drift to the new salon down the road", "No-shows and long gaps between appointments", "Referrals are the best growth channel but impossible to track"],
    wins: ["Recall nudges timed to your typical visit gap", "Referral bonus for both friends", "Birthday treat voucher every year"],
    ideas: ["5 visits → free head massage", "Refer a friend, both get a bonus stamp", "Gold tier gets priority slots"],
  },
  {
    slug: "restaurants", name: "Restaurants", icon: "🍽️", color: "#7B2D26", reward: "free dessert", goal: 6,
    headline: "Fill weeknight tables with people who already love you.",
    pitch: "Aggregators take 25–30% on every order. A WhatsApp club lets you reach your regulars directly — for free after the first message.",
    pains: ["Dependence on delivery aggregators", "Zero data on who your regulars are", "Weekday dinners are quiet"],
    wins: ["Own your customer list", "Tuesday 2× stamps to move demand", "Reward the whole table with group codes"],
    ideas: ["6 dinners → free dessert", "Tuesday double stamps", "Anniversary dessert on the house"],
  },
  {
    slug: "bakeries", name: "Bakeries & sweet shops", icon: "🧁", color: "#B4530B", reward: "free pastry", goal: 8,
    headline: "Festival season, every week of the year.",
    pitch: "Sweet shops live and die by Diwali. A loyalty club keeps the relationship warm the other eleven months.",
    pains: ["Seasonal spikes then silence", "Walk-in traffic with no phone numbers", "Gift-box customers you can't re-engage"],
    wins: ["Broadcast festival offers to members", "Birthday cake coupons", "Win-back before the next occasion"],
    ideas: ["8 purchases → free pastry", "Festival 3× stamp weekends", "Bring a friend, get a free cookie"],
  },
  {
    slug: "retail", name: "Retail & kirana", icon: "🛍️", color: "#1F3A93", reward: "₹100 off", goal: 10,
    headline: "Neighbourhood trust, upgraded for 2026.",
    pitch: "You already know your regulars by name. Stampwala remembers it for you — and makes sure they come to you, not the quick-commerce app.",
    pains: ["Quick-commerce apps steal your regular baskets", "No way to tell who bought what, when", "Credit-book style relationships don't scale"],
    wins: ["Spend-based stamps (every ₹500)", "Message regulars when stock arrives", "Reward the top 10% with Platinum perks"],
    ideas: ["Every ₹500 = 1 stamp, 10 stamps = ₹100 off", "Platinum customers get free home delivery", "Festive stock alerts on WhatsApp"],
  },
  {
    slug: "gyms", name: "Gyms & studios", icon: "🏋️", color: "#111111", reward: "free PT session", goal: 12,
    headline: "Reward the people who show up.",
    pitch: "Attendance is the strongest predictor of renewal. Turn check-ins into streaks, and spot members slipping before they cancel.",
    pains: ["Membership drop-off after week three", "No early-warning signal before cancellation", "Referrals happen by accident"],
    wins: ["Check-in stamps with visit streaks", "At-risk list for members who went quiet", "Referral rewards that pay for themselves"],
    ideas: ["12 sessions → free PT session", "Streak bonuses", "Refer a friend, both get a free week"],
  },
] as const;

export const BLOG = [
  {
    slug: "paper-vs-digital-loyalty-cards", title: "Paper vs digital loyalty cards: what actually pays off", date: "2026-10-12", read: "5 min", tag: "Strategy",
    excerpt: "A practical look at what each approach costs, what it earns, and where each one quietly fails.",
    body: [
      ["p", "Paper punch cards feel free. They aren't. Between printing, the ones that get lost, and the staff time spent stamping, the real cost is higher than it looks — and the bigger loss is invisible: you never learn who your regulars are."],
      ["h", "Where paper still wins"],
      ["p", "It needs no phone, no signal, and no explanation. For a tiny shop with ten daily regulars who all know each other, a paper card is perfectly fine."],
      ["h", "Where it breaks"],
      ["p", "The moment you want to do anything with the relationship — send a reminder, run a promotion, measure repeat rate — paper gives you nothing. There's no phone number, no purchase history and no way to tell a one-off visitor from a weekly regular."],
      ["h", "The app trap"],
      ["p", "Standalone loyalty apps solve the data problem and create a conversion problem. Asking someone in a queue to install an app and sign up is the fastest way to lose them. WhatsApp removes the install step entirely because it's already on the phone."],
      ["h", "What to measure"],
      ["p", "Whatever you pick, track three numbers for 60 days: share of visits from members, repeat rate, and average days between visits. If those don't move, change the reward — not the tool."],
    ],
  },
  {
    slug: "how-to-stop-fake-loyalty-stamps", title: "How to stop fake stamps (without making honest customers jump through hoops)", date: "2026-09-28", read: "4 min", tag: "Security",
    excerpt: "Static QR codes get photographed and shared. Here's the layered approach that keeps loyalty programs honest.",
    body: [
      ["p", "If scanning a QR code is all it takes to earn a stamp, someone will photograph the QR and scan it from home. It happens in every digital loyalty program that relies on a static code."],
      ["h", "Layer 1: a one-time code"],
      ["p", "After scanning, the customer receives a 4-digit code that expires in two minutes. The cashier enters it with the bill. A screenshot of the QR is now useless."],
      ["h", "Layer 2: cooldowns"],
      ["p", "One stamp per customer every few hours stops stamp-farming in a single sitting without affecting a normal visit."],
      ["h", "Layer 3: minimum bill"],
      ["p", "A ₹100 minimum stops people buying a ₹10 item ten times."],
      ["h", "Layer 4: accountability"],
      ["p", "Staff PINs mean every stamp is tied to a person and an outlet. Staff-issued stamps with unusual patterns stand out in the audit trail."],
    ],
  },
  {
    slug: "win-back-messages-that-work", title: "Win-back messages that actually bring people back", date: "2026-09-10", read: "4 min", tag: "Messaging",
    excerpt: "Four templates, the timing that works, and why the offer matters less than the personal touch.",
    body: [
      ["p", "Most lapsed customers didn't leave on purpose — they just got busy. A well-timed, human message is often all it takes."],
      ["h", "Timing"],
      ["p", "Wait for roughly three times the customer's normal gap. A weekly regular silent for three weeks is a signal. A monthly customer silent for three weeks is just normal."],
      ["h", "Keep it short and personal"],
      ["p", "Use their first name, mention their progress ('you're one stamp away'), and give a single clear action. Avoid long coupons and capital letters."],
      ["h", "Make the offer small"],
      ["p", "A bonus stamp works because it costs you almost nothing and gives the customer a reason to complete the card they've already started."],
      ["h", "Respect opt-outs"],
      ["p", "Every message should be sent only to people who agreed, and STOP must always work. It protects your sender reputation and your brand."],
    ],
  },
  {
    slug: "whatsapp-business-api-for-small-shops", title: "WhatsApp Business API for small shops: what you actually need to know", date: "2026-08-22", read: "6 min", tag: "Guides",
    excerpt: "The 24-hour window, templates, and what costs money — explained without the jargon.",
    body: [
      ["p", "The WhatsApp Business app on your phone and the WhatsApp Business Platform (API) are different products. Automation, like loyalty cards and campaigns, runs on the API."],
      ["h", "The 24-hour window"],
      ["p", "When a customer messages you, you can reply freely for 24 hours. Replies in that window are the cheapest and most flexible kind — perfect for codes, stamps and vouchers."],
      ["h", "Templates"],
      ["p", "To message someone first, outside the window, you need a pre-approved template. Win-back and birthday messages are templates, and Meta charges per message for them."],
      ["h", "What it means for loyalty"],
      ["p", "Design your program so most value flows through replies (customer scans, bot responds) and keep business-initiated messages for moments that earn their cost — a win-back or a birthday."],
    ],
  },
] as const;

export const COMPARE = [
  ["Customer installs an app", "No", "No", "Yes", "Sometimes"],
  ["Can't be lost or forgotten", "Yes", "No", "Yes", "Yes"],
  ["Blocks fake / duplicate stamps", "One-time codes + cooldowns", "Easy to forge", "Varies", "Varies"],
  ["Message customers directly", "WhatsApp", "Impossible", "Push (often muted)", "SMS only"],
  ["Automatic win-back", "Built in", "No", "Paid tier", "Rare"],
  ["Referrals, tiers, happy hours", "Included", "No", "Some", "Rare"],
  ["Multi-outlet, one card", "Yes (Pro)", "No", "Some", "Same POS only"],
  ["Needs new hardware", "No", "No", "No", "Yes"],
  ["Where it's weaker", "Customer must use WhatsApp", "Reprint costs", "Low sign-up rates", "Locked to one POS"],
] as const;
