import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Stampwala — WhatsApp loyalty cards for cafés, salons & shops", template: "%s · Stampwala" },
  description: "Digital stamp cards inside WhatsApp. No app to install, one-time cashier codes stop fake stamps, and automatic win-back messages bring regulars back. Free plan available.",
  openGraph: { type: "website", siteName: "Stampwala", title: "Stampwala — loyalty that lives in WhatsApp", description: "No app. No lost cards. No fake stamps." },
};
export const viewport: Viewport = { themeColor: "#f7f1e5", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dm.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
