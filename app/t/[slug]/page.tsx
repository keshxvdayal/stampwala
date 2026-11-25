import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { all, get } from "@/lib/db";
import { getStaff } from "@/lib/auth";
import { TerminalClient, PinLogin } from "@/components/customer/Terminal";

export const metadata: Metadata = { title: "Counter terminal", robots: { index: false } };

export default async function Terminal({ params }: PageProps<"/t/[slug]">) {
  const { slug } = await params;
  const biz = get<{ id: number; name: string }>("SELECT id,name FROM businesses WHERE slug=?", slug);
  if (!biz) notFound();
  const staff = await getStaff();
  if (!staff || staff.slug !== slug) {
    const outlets = all<{ id: number; name: string }>("SELECT id,name FROM outlets WHERE business_id=?", biz.id);
    return <PinLogin slug={slug} name={biz.name} outlets={outlets} />;
  }
  return <TerminalClient slug={slug} bizName={biz.name} staff={{ name: staff.name, role: staff.role, outlet: staff.outlet_name }} />;
}
