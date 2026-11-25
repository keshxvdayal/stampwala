import type { Metadata } from "next";
import { requireBusiness } from "@/lib/auth";
import { Spotlight } from "@/components/site/Spotlight";
import { Sidebar } from "@/components/dash/Sidebar";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Stampwala" }, robots: { index: false } };

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const b = await requireBusiness();
  return (
    <div className="theme-dark dash-bg min-h-screen lg:flex">
      <Spotlight />
      <Sidebar name={b.name} slug={b.slug} plan={b.plan} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mx-auto max-w-[1180px]">{children}</div></main>
    </div>
  );
}
