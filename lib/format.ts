export const ago = (t: number | null | undefined) => {
  if (!t) return "never";
  const d = Math.floor((Date.now() - t) / 86400000);
  if (d <= 0) { const h = Math.floor((Date.now() - t) / 3600000); return h <= 0 ? "just now" : `${h}h ago`; }
  return d === 1 ? "yesterday" : d < 30 ? `${d} days ago` : `${Math.floor(d / 30)} mo ago`;
};
export const dt = (t: number) => new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
export const day = (t: number) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const phoneFmt = (p: string) => (p.startsWith("91") && p.length === 12 ? `+91 ${p.slice(2, 7)} ${p.slice(7)}` : "+" + p);
