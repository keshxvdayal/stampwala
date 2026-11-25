/* Pure-SVG charts: no client JS, render on the server. */
export function AreaChart({ data, color = "#1e7a56", height = 180, labels }: { data: number[]; color?: string; height?: number; labels?: string[] }) {
  const w = 600, h = height, pad = 6;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => [pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1), h - 22 - (v / max) * (h - 40)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - 22} L${pts[0][0]},${h - 22} Z`;
  const id = `g${color.replace("#", "")}${data.length}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Trend chart" preserveAspectRatio="none" style={{ height }}>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((p) => <line key={p} x1={pad} x2={w - pad} y1={h - 22 - p * (h - 40)} y2={h - 22 - p * (h - 40)} stroke="rgba(128,128,128,.25)" strokeDasharray="3 5" />)}
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {labels && labels.map((l, i) => (i % Math.ceil(labels.length / 6) === 0 ? <text key={i} x={pts[i][0]} y={h - 4} fontSize="11" fill="#6c7b73" textAnchor="middle">{l}</text> : null))}
    </svg>
  );
}

export function BarChart({ data, color = "#1e7a56", height = 170, highlight }: { data: { label: string; value: number }[]; color?: string; height?: number; highlight?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const top = data.reduce((a, d) => (d.value > a.value ? d : a), data[0]);
  return (
    <div className="flex items-end gap-2.5" style={{ height }} role="img" aria-label="Bar chart">
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5 text-[11.5px] text-muted">
          <span className="text-[11px] font-semibold text-ink-2">{d.value}</span>
          <div className="w-full rounded-t-lg rounded-b-sm" style={{ height: `${Math.max((d.value / max) * 100 - 14, 2)}%`, background: highlight && d === top ? "#ffae1a" : color, opacity: highlight && d !== top ? 0.85 : 1 }} />
          {d.label}
        </div>
      ))}
    </div>
  );
}

export function Donut({ data, size = 150 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = 54, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Distribution">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(128,128,128,.18)" strokeWidth="18" />
        {data.map((d) => { const len = (d.value / total) * c; const el = <circle key={d.label} cx="70" cy="70" r={r} fill="none" stroke={d.color} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} transform="rotate(-90 70 70)" />; off += len; return el; })}
        <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor" fontFamily="var(--font-fraunces)">{total}</text>
        <text x="70" y="86" textAnchor="middle" fontSize="10" fill="#6c7b73">members</text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => <li key={d.label} className="flex items-center gap-2"><i className="size-3 rounded-full" style={{ background: d.color }} /><span className="text-ink-2">{d.label}</span><b className="ml-auto pl-3">{d.value}</b></li>)}
      </ul>
    </div>
  );
}

export function Heat({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);
  return (
    <div>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-16" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
        {hours.map((h) => (
          <div key={h} title={`${h}:00 — ${data[h]} visits`} className="aspect-square rounded-md" style={{ background: `rgba(30,122,86,${0.08 + (data[h] / max) * 0.92})` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted"><span>7am</span><span>1pm</span><span>10pm</span></div>
    </div>
  );
}

export function Spark({ data, color = "#1e7a56" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(" ");
  return <svg viewBox="0 0 100 30" className="h-8 w-24" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
