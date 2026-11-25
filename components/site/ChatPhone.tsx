"use client";
import { useEffect, useRef } from "react";

const dots = (n: number, goal: number, icon: string) =>
  Array.from({ length: goal }, (_, i) => `<div class="dot ${i < n ? "on" : ""} ${i === goal - 1 && i >= n ? "gift" : ""}">${i < n ? icon : i === goal - 1 ? "🎁" : ""}</div>`).join("");
const card = (n: number) =>
  `<div class="scard"><div style="font-family:var(--font-display);font-weight:700;font-size:15px;position:relative;z-index:1">Brew &amp; Co. Club</div><div style="font-size:11px;opacity:.85;position:relative;z-index:1">${n} of 6 stamps</div><div class="dots" style="grid-template-columns:repeat(6,1fr)">${dots(n, 6, "☕")}</div><div class="prog"><i style="width:${(n / 6) * 100}%"></i></div></div>`;

export function ChatPhone() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let dead = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const time = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const add = (html: string, from: "in" | "out" = "in") => {
      const d = document.createElement("div");
      d.className = `msg ${from}`;
      d.innerHTML = `${html}<time>${time()}${from === "out" ? " ✓✓" : ""}</time>`;
      el.appendChild(d); el.scrollTop = el.scrollHeight;
    };
    const bot = async (html: string, ms = 800) => {
      const t = document.createElement("div"); t.className = "msg in typing"; t.innerHTML = "<i></i><i></i><i></i>";
      el.appendChild(t); el.scrollTop = el.scrollHeight; await sleep(ms); t.remove(); add(html);
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      do {
        el.innerHTML = "";
        add("📷 <i>Scanned the counter QR</i>", "out"); await sleep(600); if (dead) return;
        await bot(`Welcome back, Ananya! ☕ Show this code to the cashier:<span class="code">4821</span>`, 900); await sleep(1500); if (dead) return;
        await bot("✅ <b>+1 stamp</b> added at Brew &amp; Co.! 1 more for your <b>free cappuccino</b>."); add(card(5)); await sleep(2600); if (dead) return;
        add("<i>— a week later —</i>"); await sleep(1000);
        add("📷 <i>Scanned the counter QR</i>", "out"); await sleep(600);
        await bot(`🎉 <b>Card complete!</b> Your free cappuccino:<span class="vouch">VIP-7KQ2</span>`, 900); add(card(6)); await sleep(5200);
      } while (!dead && !reduce);
    })();
    return () => { dead = true; };
  }, []);
  return (
    <div className="phone">
      <div className="screen">
        <div className="wa-head">
          <div className="grid size-9 place-items-center rounded-full bg-white text-lg">☕</div>
          <div><b className="block text-[14.5px] leading-tight">Brew &amp; Co. Club <span className="ml-1 inline-block size-3.5 rounded-full bg-[#34B7F1] align-[-2px] text-center text-[9px] leading-[14px]">✓</span></b><small className="text-[11px] opacity-85">Official business account</small></div>
        </div>
        <div ref={ref} className="chat" />
      </div>
    </div>
  );
}
