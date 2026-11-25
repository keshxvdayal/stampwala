import type { Metadata } from "next";
import { requireBusiness } from "@/lib/auth";
import { getProgram } from "@/lib/loyalty";
import { PageHead } from "@/components/dash/bits";
import { ProgramEditor } from "@/components/dash/ProgramEditor";

export const metadata: Metadata = { title: "Card & rewards" };
export default async function Program() {
  const b = await requireBusiness();
  const p = getProgram(b.id);
  return (<><PageHead title="Card & rewards" sub="Design the card and set the rules. Changes apply to new stamps immediately." /><ProgramEditor initial={{ name: b.name, goal: p.goal, icon: p.icon, color: p.color, reward: p.reward, min_bill: p.min_bill, cooldown_hours: p.cooldown_hours, happy_days: p.happy_days, happy_mult: p.happy_mult, referral_bonus: p.referral_bonus, gold_at: p.gold_at, platinum_at: p.platinum_at }} /></>);
}
