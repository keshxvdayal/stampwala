# Stampwala

WhatsApp-style digital loyalty cards for cafés, salons and shops — a marketing site **and** a working platform
(Next.js 16 · React 19 · TypeScript · Tailwind v4 · built-in SQLite).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires **Node 22.13+** (uses the built-in `node:sqlite`; no native dependencies).
On first run the database `data/stampwala.db` is created and seeded with a demo café.

| What | Where |
| --- | --- |
| Demo owner login | `demo@stampwala.app` / `demo1234` → `/dashboard` |
| Counter terminal (staff PIN) | `/t/brew-co` — Asha `1234` (manager, Indiranagar), Ravi `5678`, Meghna `4321` (Koramangala) |
| Customer card (QR landing) | `/j/brew-co` |

Reset all data: stop the server and delete `data/`.

## What's inside

**Marketing site** — Home, Features, How it works, Pricing, Industries (6 pages), Compare, Live demo, Blog (4 posts), About, Contact, Privacy, Terms, Login, Signup.

**Merchant dashboard** (`/dashboard`) — Overview, Customers (+ detail), Card & rewards editor, Campaigns, Messages log, Analytics, Team & outlets, printable QR stand, Settings, CSV export.

**Customer card** (`/j/[slug]`) — join, live stamp card, one-time code, voucher, referral link, opt-out.

**Counter terminal** (`/t/[slug]`) — PIN pad, stamp by code, redeem voucher, manager phone override.

**Engine** (`lib/loyalty.ts`) — one-time 2-minute codes, per-customer cooldown, minimum bill, happy-hour multipliers, tiers, referrals, vouchers, win-back / birthday / welcome campaigns, opt-out.

## Connect real WhatsApp

Copy `.env.example` to `.env.local`, fill in the Cloud API values, set the Meta webhook to
`https://YOUR_DOMAIN/api/whatsapp/webhook` (subscribe to `messages`). Inbound commands: `JOIN <shop>`, `CODE`, `CARD`, `STOP`.
Run campaigns daily: `curl -H "Authorization: Bearer $CRON_SECRET" https://YOUR_DOMAIN/api/cron`.

## Known gaps (be honest before launch)

- **No payments.** Plans are stored and limits enforced, but there's no Razorpay/Stripe checkout.
- **Business-initiated WhatsApp sends use plain text.** Meta requires approved *templates* outside the 24-hour window — add them in `lib/whatsapp.ts`.
- **Web card doesn't verify phone ownership** (OTP). Over WhatsApp, the inbound message itself proves the number.
- **SQLite on one server.** Swap `lib/db.ts` for Postgres/Turso to scale horizontally; the rate limiter is in-memory too.
- **Only English & Hindi messages** (`lib/i18n.ts`). Other languages are marked "soon" on the site.
- Pricing, copy and legal pages are **placeholders** — have them reviewed.
- No automated test suite yet; flows were verified manually end-to-end.
