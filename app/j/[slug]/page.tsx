import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentMember } from "@/lib/member-session";
import { whatsappConfigured } from "@/lib/whatsapp";
import { CardClient } from "@/components/customer/CardClient";

export async function generateMetadata({ params }: PageProps<"/j/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ctx = await currentMember(slug);
  return { title: ctx ? `${ctx.biz.name} Club` : "Club card", robots: { index: false } };
}

export default async function Join({ params, searchParams }: PageProps<"/j/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const ctx = await currentMember(slug);
  if (!ctx) notFound();
  const { biz, program: p, member } = ctx;
  return (
    <CardClient
      slug={biz.slug} name={biz.name}
      program={{ goal: p.goal, icon: p.icon, color: p.color, reward: p.reward, min: p.min_bill, cooldown: p.cooldown_hours }}
      joined={Boolean(member)} firstName={member?.name?.split(" ")[0] ?? null}
      refCode={typeof sp.ref === "string" ? sp.ref : ""}
      waLink={whatsappConfigured() && process.env.WHATSAPP_DISPLAY_NUMBER ? `https://wa.me/${process.env.WHATSAPP_DISPLAY_NUMBER}?text=${encodeURIComponent("JOIN " + biz.slug)}` : null}
    />
  );
}
