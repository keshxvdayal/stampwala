import QRCode from "qrcode";
export const qrSvg = (text: string, dark = "#10201a") => QRCode.toString(text, { type: "svg", margin: 1, color: { dark, light: "#ffffff" }, errorCorrectionLevel: "M" });
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
