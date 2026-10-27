import SnowCanvas from "./SnowCanvas";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded so the server and client render the identical sky.
const STARS = (() => {
  const rnd = mulberry32(1225);
  return Array.from({ length: 110 }, (_, id) => ({
    id,
    x: +(rnd() * 160).toFixed(2),
    y: +(rnd() * 70).toFixed(2),
    r: +(0.25 + rnd() * 0.75).toFixed(2),
    delay: +(rnd() * 4).toFixed(2),
    duration: +(3 + rnd() * 3).toFixed(2),
  }));
})();

function Stars() {
  return (
    <svg className="stars" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" role="presentation">
      {STARS.map((s) => (
        <circle
          key={s.id}
          className="star"
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#fff"
          style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
        />
      ))}
    </svg>
  );
}

function Tree({ x, y, h, color }: { x: number; y: number; h: number; color: string }) {
  const w = h * 0.6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w * 0.08} y={-h * 0.1} width={w * 0.16} height={h * 0.14} fill="#3b2a1e" />
      <path d={`M0 ${-h}L${w / 2} ${-h * 0.55}L${-w / 2} ${-h * 0.55}Z`} fill={color} />
      <path d={`M0 ${-h * 0.8}L${w * 0.62} ${-h * 0.32}L${-w * 0.62} ${-h * 0.32}Z`} fill={color} />
      <path d={`M0 ${-h * 0.58}L${w * 0.75} ${-h * 0.08}L${-w * 0.75} ${-h * 0.08}Z`} fill={color} />
      <path d={`M0 ${-h}L${w * 0.22} ${-h * 0.78}L${-w * 0.22} ${-h * 0.78}Z`} fill="#eef4ff" opacity=".85" />
    </g>
  );
}

function Hills() {
  const far = "#16304d";
  const near = "#1d3a5c";
  return (
    <svg className="hills" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" role="presentation">
      <defs>
        <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb3d1" />
          <stop offset="1" stopColor="#7d93b5" />
        </linearGradient>
        <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d5e0f0" />
          <stop offset="1" stopColor="#b7c8e0" />
        </linearGradient>
        <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f8ff" />
          <stop offset="1" stopColor="#d9e4f3" />
        </linearGradient>
        <filter id="window-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path d="M0 230C200 170 320 200 520 180S900 120 1100 170 1350 150 1440 180V400H0Z" fill="url(#hill-far)" />
      <Tree x={90} y={212} h={58} color={far} />
      <Tree x={150} y={208} h={44} color={far} />
      <Tree x={330} y={200} h={52} color={far} />
      <Tree x={620} y={176} h={48} color={far} />
      <Tree x={690} y={170} h={62} color={far} />
      <Tree x={950} y={158} h={50} color={far} />
      <Tree x={1010} y={164} h={40} color={far} />
      <Tree x={1340} y={170} h={56} color={far} />
      <path d="M0 290C180 250 360 270 560 250S980 230 1180 262 1380 250 1440 262V400H0Z" fill="url(#hill-mid)" />
      <g transform="translate(1110 236)">
        <rect x="0" y="20" width="90" height="56" fill="#4b2f1d" />
        <rect x="66" y="-6" width="12" height="24" fill="#3b2a1e" />
        <path d="M-10 22L45-14l55 36Z" fill="#6b3f2a" />
        <path d="M-10 22L45-14l55 36" fill="none" stroke="#f4f8ff" strokeWidth="8" strokeLinejoin="round" />
        <rect x="12" y="38" width="20" height="18" fill="#ffd27a" filter="url(#window-glow)" opacity=".9" />
        <rect x="12" y="38" width="20" height="18" fill="#ffe09a" />
        <path d="M22 38v18M12 47h20" stroke="#4b2f1d" strokeWidth="2" />
        <rect x="54" y="44" width="18" height="32" fill="#2b1a0f" />
      </g>
      <Tree x={70} y={288} h={120} color={near} />
      <Tree x={190} y={276} h={84} color={near} />
      <Tree x={1270} y={272} h={116} color={near} />
      <Tree x={1395} y={278} h={90} color={near} />
      <path d="M0 340C240 300 420 330 700 312S1100 290 1440 326V400H0Z" fill="url(#hill-near)" />
    </svg>
  );
}

export default function SnowScene() {
  return (
    <div className="scene-snow">
      <Stars />
      <div className="moon" />
      <Hills />
      <SnowCanvas />
    </div>
  );
}
