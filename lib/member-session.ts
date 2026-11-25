import { cookies } from "next/headers";
import { get } from "./db";
import { memberByToken, getProgram } from "./loyalty";

export async function currentMember(slug: string) {
  const biz = get<{ id: number; name: string; slug: string; category: string }>("SELECT id,name,slug,category FROM businesses WHERE slug=?", slug);
  if (!biz) return null;
  const tk = (await cookies()).get(`sw_m_${slug}`)?.value;
  const member = tk ? memberByToken(biz.id, tk) : undefined;
  return { biz, program: getProgram(biz.id), member: member ?? null };
}
