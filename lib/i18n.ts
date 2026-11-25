export type Lang = "en" | "hi";
export const LANGS: Record<Lang, string> = { en: "English", hi: "हिन्दी" };

type Ctx = Record<string, string | number>;
const fill = (s: string, c: Ctx) => s.replace(/\{(\w+)\}/g, (_, k) => String(c[k] ?? ""));

const M: Record<string, Record<Lang, string>> = {
  welcome: {
    en: "Welcome to the {business} club, {name}! {icon} Your card is ready — collect {goal} stamps for a {reward}.",
    hi: "{business} क्लब में स्वागत है, {name}! {icon} आपका कार्ड तैयार है — {goal} स्टैम्प पर {reward} पाइए।",
  },
  code: {
    en: "Your code is *{code}*. Show it to the cashier within 2 minutes.",
    hi: "आपका कोड *{code}* है। 2 मिनट के अंदर कैशियर को दिखाइए।",
  },
  cooldown: {
    en: "You've already been stamped recently 😊 Your next stamp opens in {wait}. It keeps things fair for everyone.",
    hi: "हाल ही में आपका स्टैम्प लग चुका है 😊 अगला स्टैम्प {wait} बाद मिलेगा।",
  },
  stamp: {
    en: "✅ +{n} stamp{s} added at {business}! {left}",
    hi: "✅ {business} में +{n} स्टैम्प जुड़ा! {left}",
  },
  left_some: { en: "{left} more for your {reward}.", hi: "{reward} के लिए {left} और।" },
  left_none: { en: "Your card is full!", hi: "आपका कार्ड भर गया!" },
  reward: {
    en: "🎉 Reward unlocked! Your {reward} voucher: *{voucher}*. Show it at the counter.",
    hi: "🎉 इनाम मिल गया! आपका {reward} वाउचर: *{voucher}*। काउंटर पर दिखाइए।",
  },
  redeemed: {
    en: "🥳 Enjoy your {reward}! Your new card is ready.",
    hi: "🥳 {reward} का आनंद लीजिए! आपका नया कार्ड तैयार है।",
  },
  referral: {
    en: "🎁 {friend} joined through your link — you both get +{n} bonus stamp.",
    hi: "🎁 {friend} आपके लिंक से जुड़े — आप दोनों को +{n} बोनस स्टैम्प मिला।",
  },
  optout: {
    en: "You're unsubscribed from messages. Reply JOIN anytime to come back.",
    hi: "आपको संदेश भेजना बंद कर दिया गया है। वापस आने के लिए JOIN लिखिए।",
  },
};

export function t(key: string, lang: Lang, ctx: Ctx = {}) {
  return fill(M[key]?.[lang] ?? M[key]?.en ?? key, ctx);
}
