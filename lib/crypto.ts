import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hash(secret: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(secret, salt, 32).toString("hex")}`;
}
export function verify(secret: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const a = Buffer.from(key, "hex");
  const b = scryptSync(secret, salt, 32);
  return a.length === b.length && timingSafeEqual(a, b);
}
export const token = (n = 24) => randomBytes(n).toString("hex");
export const digits = (n = 4) => {
  const max = 10 ** n;
  return String(Math.floor(randomBytes(4).readUInt32BE() % (max - max / 10)) + max / 10);
};
