import type { Metadata } from "next";
import { requireBusiness } from "@/lib/auth";
import { PageHead, Panel } from "@/components/dash/bits";
import { whatsappConfigured } from "@/lib/whatsapp";
import { siteUrl } from "@/lib/qr";
import { PLANS } from "@/lib/content";

export const metadata: Metadata = { title: "Settings" };
export default async function Settings() {
  const b = await requireBusiness();
  const live = whatsappConfigured();
  const plan = PLANS.find((p) => p.id === b.plan);
  const Code = ({ children }: { children: React.ReactNode }) => <pre className="overflow-x-auto rounded-2xl bg-black/60 p-4 text-[13px] leading-relaxed text-[#d6e6dd]">{children}</pre>;
  return (
    <>
      <PageHead title="Settings" />
      <div className="grid gap-5">
        <Panel title="Account">
          <dl className="grid gap-4 text-sm sm:grid-cols-3"><div><dt className="text-muted">Business</dt><dd className="font-semibold">{b.name}</dd></div><div><dt className="text-muted">Owner</dt><dd className="font-semibold">{b.owner_name}</dd></div><div><dt className="text-muted">Email</dt><dd className="font-semibold">{b.email}</dd></div></dl>
        </Panel>
        <Panel title="Plan & billing">
          <div className="flex flex-wrap items-center gap-4"><span className="chip amber capitalize">{plan?.name ?? b.plan}</span><span className="text-ink-2">{plan?.blurb}</span></div>
          <p className="mt-3 text-sm text-muted">Payment collection (Razorpay / Stripe) is not wired up in this build — plan limits are enforced, but upgrades are manual for now.</p>
        </Panel>
        <Panel title="WhatsApp connection" action={<span className={`chip ${live ? "" : "amber"}`}>{live ? "Connected" : "Not connected"}</span>}>
          <p className="text-ink-2">Until connected, every message is recorded in your Messages log but not delivered. To go live with the WhatsApp Cloud API:</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-2"><li>Create a Meta developer app with the WhatsApp product and add a phone number.</li><li>Put these in <code className="rounded bg-paper-2 px-1.5">.env.local</code> and restart:</li></ol>
          <Code>{`WHATSAPP_TOKEN=<permanent access token>
WHATSAPP_PHONE_ID=<phone number id>
WHATSAPP_VERIFY_TOKEN=<any secret string>
WHATSAPP_APP_SECRET=<app secret, to verify webhook signatures>
WHATSAPP_DISPLAY_NUMBER=91XXXXXXXXXX   # shown as a "Continue on WhatsApp" button
NEXT_PUBLIC_SITE_URL=https://your-domain.com`}</Code>
          <ol start={3} className="mt-4 list-decimal space-y-2 pl-5 text-ink-2"><li>In Meta&apos;s webhook settings, set the callback URL to <code className="rounded bg-paper-2 px-1.5">{siteUrl()}/api/whatsapp/webhook</code> with your verify token, and subscribe to <b>messages</b>.</li><li>Create approved message templates for win-back and birthday sends (Meta requires templates for business-initiated messages).</li></ol>
        </Panel>
        <Panel title="Daily automation">
          <p className="text-ink-2">Run campaigns automatically by calling the cron endpoint once a day from any scheduler:</p>
          <Code>{`curl -H "Authorization: Bearer $CRON_SECRET" ${siteUrl()}/api/cron`}</Code>
        </Panel>
        <Panel title="Your data"><p className="text-ink-2">Your customer list is yours. Download everything any time.</p><a href="/api/export" className="btn btn-line btn-sm mt-4">⬇ Export customers (CSV)</a></Panel>
      </div>
    </>
  );
}
