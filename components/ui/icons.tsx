const base = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;
export const Arrow = ({ size = 18 }: { size?: number }) => (<svg width={size} height={size} {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const Check = ({ size = 18 }: { size?: number }) => (<svg width={size} height={size} {...base} strokeWidth={2.6}><path d="M20 6 9 17l-5-5" /></svg>);
export const Plus = ({ size = 20 }: { size?: number }) => (<svg width={size} height={size} {...base}><path d="M12 5v14M5 12h14" /></svg>);
export const Menu = ({ size = 22 }: { size?: number }) => (<svg width={size} height={size} {...base}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const Close = ({ size = 22 }: { size?: number }) => (<svg width={size} height={size} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const Chat = ({ size = 20 }: { size?: number }) => (<svg width={size} height={size} {...base}><path d="M21 11.5a8.4 8.4 0 0 1-12.2 7.500L3 21l2-5.600A8.500 8.500 0 1 1 21 11.500Z" /></svg>);

export const Logo = ({ light = false }: { light?: boolean }) => (
  <span className="inline-flex items-center gap-2.5 font-display text-[23px] font-bold tracking-tight">
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#FFAE1A" />
      <circle cx="20" cy="20" r="18" fill="none" stroke="#10201A" strokeWidth="1.600" strokeDasharray="3 3.200" opacity=".5" />
      <path d="M12.500 20.500l5.500 5.500 10-12" stroke="#0A3828" strokeWidth="3.600" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
    <span className={light ? "text-white" : "text-ink"}>Stampwala</span>
  </span>
);
