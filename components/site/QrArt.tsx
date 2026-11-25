export function QrArt({ size = 150, seed = 7 }: { size?: number; seed?: number }) {
  const n = 21;
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const cells: [number, number][] = [];
  const finder = (x: number, y: number) => x < 8 && y < 8 || x > n - 9 && y < 8 || x < 8 && y > n - 9;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) cells.push([x, y]);
  const F = ({ x, y }: { x: number; y: number }) => (<g transform={`translate(${x} ${y})`}><rect width="7" height="7" rx="1.2" fill="#10201a" /><rect x="1" y="1" width="5" height="5" rx=".8" fill="#fff" /><rect x="2" y="2" width="3" height="3" rx=".6" fill="#10201a" /></g>);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} role="img" aria-label="Counter QR code" shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#fff" />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#10201a" />)}
      <F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} />
    </svg>
  );
}
