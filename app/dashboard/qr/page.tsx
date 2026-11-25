import type { Metadata } from "next";
import { requireBusiness } from "@/lib/auth";
import { getProgram } from "@/lib/loyalty";
import { qrSvg, siteUrl } from "@/lib/qr";
import { PageHead, Panel } from "@/components/dash/bits";
import { PrintButton } from "@/components/dash/PrintButton";

export const metadata: Metadata = { title: "QR & counter" };
export default async function QR() {
  const b = await requireBusiness();
  const p = getProgram(b.id);
  const url = `${siteUrl()}/j/${b.slug}`;
  const svg = await qrSvg(url, "#0a3828");
  return (
    <>
      <div className="print:hidden"><PageHead title="QR & counter" sub="Print this stand and place it by the till."><PrintButton /></PageHead></div>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto w-[360px] max-w-full rounded-[28px] p-8 text-center text-white shadow-[var(--shadow-pop)] print:shadow-none" style={{ background: p.color }}>
          <div className="text-5xl">{p.icon}</div>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{b.name}<br />Club</h2>
          <p className="mt-2 text-white/80">Scan to collect stamps &amp; earn a {p.reward}</p>
          <div className="mx-auto mt-6 w-56 rounded-3xl bg-white p-3" dangerouslySetInnerHTML={{ __html: svg }} />
          <p className="mt-5 text-sm font-semibold tracking-wide text-white/90">No app · No card · Just scan</p>
          <p className="mt-1 break-all font-mono text-[11px] text-white/60">{url}</p>
        </div>
        <div className="space-y-5 print:hidden">
          <Panel title="Links">
            <dl className="space-y-4 text-sm">
              <div><dt className="font-bold">Customer card</dt><dd className="mt-1 break-all font-mono text-ink-2">{url}</dd></div>
              <div><dt className="font-bold">Counter terminal (staff)</dt><dd className="mt-1 break-all font-mono text-ink-2">{siteUrl()}/t/{b.slug}</dd></div>
              <div><dt className="font-bold">Referral links</dt><dd className="mt-1 text-ink-2">Each member gets their own invite link inside their card.</dd></div>
            </dl>
          </Panel>
          <Panel title="Placement tips"><ul className="list-disc space-y-2 pl-5 text-ink-2"><li>Put the stand at the point of payment, at phone-camera height.</li><li>Have the cashier say: “Scan for a stamp on your card.”</li><li>Keep the counter terminal open on a tablet or the billing laptop.</li><li>Set <code className="rounded bg-paper-2 px-1.5">NEXT_PUBLIC_SITE_URL</code> to your real domain so the QR points to production.</li></ul></Panel>
        </div>
      </div>
    </>
  );
}
