/* Hand-drawn SVG props for Santa's desk. Decorative only. */

export function Candle() {
  return (
    <svg viewBox="0 0 120 230" role="presentation">
      <defs>
        <radialGradient id="cdl-glow" cx="50%" cy="60%" r="50%">
          <stop offset="0" stopColor="#fff1b8" stopOpacity=".95" />
          <stop offset=".4" stopColor="#ffb340" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff7a00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cdl-brass" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a1c" />
          <stop offset=".5" stopColor="#e6c35f" />
          <stop offset="1" stopColor="#6f521a" />
        </linearGradient>
        <linearGradient id="cdl-wax" x1="0" x2="1">
          <stop offset="0" stopColor="#d6c493" />
          <stop offset=".45" stopColor="#f8efd3" />
          <stop offset="1" stopColor="#c7b27e" />
        </linearGradient>
      </defs>
      <g className="flame">
        <ellipse cx="60" cy="46" rx="26" ry="34" fill="url(#cdl-glow)" />
        <path d="M60 14c10 14 13 24 8 34-3 6-13 6-16 0-5-10-2-20 8-34z" fill="#ffc84d" />
        <path d="M60 30c5 7 6 12 3 17-1.5 3-4.5 3-6 0-3-5-2-10 3-17z" fill="#fff6d2" />
      </g>
      <path d="M60 66v-8" stroke="#3a2a18" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="42" y="68" width="36" height="110" rx="5" fill="url(#cdl-wax)" />
      <path d="M46 74c4 14-1 26 2 40" stroke="#efe4c2" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M72 72c-3 10 1 20-2 30" stroke="#e9dcb6" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="60" cy="68" rx="18" ry="5" fill="#f6ecd0" />
      <ellipse cx="60" cy="178" rx="20" ry="6" fill="#d9b652" />
      <rect x="47" y="176" width="26" height="22" fill="url(#cdl-brass)" />
      <ellipse cx="60" cy="204" rx="36" ry="9" fill="#b8963a" />
      <ellipse cx="60" cy="208" rx="48" ry="13" fill="url(#cdl-brass)" />
      <ellipse cx="60" cy="206" rx="48" ry="11" fill="none" stroke="#f1d78a" strokeWidth="1" opacity=".6" />
      <ellipse cx="104" cy="198" rx="11" ry="7" fill="none" stroke="url(#cdl-brass)" strokeWidth="5" />
    </svg>
  );
}

export function InkwellQuill() {
  return (
    <svg viewBox="0 0 240 220" role="presentation">
      <defs>
        <linearGradient id="ink-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#101a2e" />
          <stop offset=".35" stopColor="#2a3d63" />
          <stop offset=".6" stopColor="#15223d" />
          <stop offset="1" stopColor="#0a1122" />
        </linearGradient>
        <linearGradient id="ink-feather" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf6ea" />
          <stop offset="1" stopColor="#d9cfb6" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="200" rx="58" ry="10" fill="rgba(0,0,0,.35)" />
      <path d="M28 120q0-14 14-14h56q14 0 14 14v62q0 14-14 14H42q-14 0-14-14z" fill="url(#ink-glass)" />
      <rect x="52" y="92" width="36" height="18" rx="3" fill="#3a4b70" />
      <ellipse cx="70" cy="92" rx="18" ry="5" fill="#0b1324" />
      <ellipse cx="70" cy="92" rx="12" ry="3" fill="#1d2b4d" />
      <rect x="36" y="124" width="8" height="48" rx="4" fill="#fff" opacity=".1" />
      <rect x="44" y="150" width="52" height="20" rx="2" fill="#e8dcb8" opacity=".9" />
      <path d="M50 157h40M50 163h28" stroke="#6b5440" strokeWidth="1.5" opacity=".7" />
      <path d="M74 96C96 70 130 44 214 10" stroke="#e3d6b4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M74 96c6-8 12-14 18-20" stroke="#1a1208" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M104 72C125 40 165 18 214 10 190 28 160 52 122 86Z" fill="url(#ink-feather)" />
      <path d="M104 72c26-10 66-36 110-62-14 34-49 62-86 86z" fill="#ece2c8" />
      <path d="M120 80l14-22M134 68l12-20M150 56l10-18M166 44l8-15M182 32l6-12" stroke="#cfc3a4" strokeWidth="1" opacity=".8" />
    </svg>
  );
}

export function CocoaMug() {
  return (
    <svg viewBox="0 0 170 190" role="presentation">
      <defs>
        <linearGradient id="mug-red" x1="0" x2="1">
          <stop offset="0" stopColor="#7d1218" />
          <stop offset=".3" stopColor="#c0262d" />
          <stop offset=".75" stopColor="#a51e25" />
          <stop offset="1" stopColor="#6b0f14" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="176" rx="60" ry="10" fill="rgba(0,0,0,.35)" />
      <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round">
        <path className="steam steam-1" d="M58 44c-8-10 8-18 0-30" />
        <path className="steam steam-2" d="M80 40c-9-12 9-20 0-34" />
        <path className="steam steam-3" d="M102 44c-8-10 8-18 0-30" />
      </g>
      <path d="M126 86c30 0 34 46 0 52" fill="none" stroke="url(#mug-red)" strokeWidth="14" strokeLinecap="round" />
      <path d="M126 86c30 0 34 46 0 52" fill="none" stroke="#8a151b" strokeWidth="6" strokeLinecap="round" opacity=".6" />
      <path d="M34 62h94l-6 102q-1 10-11 10H51q-10 0-11-10z" fill="url(#mug-red)" />
      <ellipse cx="81" cy="62" rx="47" ry="12" fill="#d4383f" />
      <ellipse cx="81" cy="63" rx="40" ry="9" fill="#4a2c1a" />
      <ellipse cx="81" cy="62" rx="40" ry="8" fill="#5c3722" />
      <rect x="62" y="54" width="14" height="10" rx="3" fill="#fff8ee" />
      <rect x="80" y="52" width="14" height="10" rx="3" fill="#fff3e4" transform="rotate(12 87 57)" />
      <rect x="72" y="60" width="13" height="9" rx="3" fill="#fffaf0" transform="rotate(-18 78 64)" />
      <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".9" transform="translate(76 112)">
        <path d="M0-20v40M-17-10l34 20M-17 10l34-20" />
        <path d="M0-20l-5 6M0-20l5 6M0 20l-5-6M0 20l5-6M-17-10l1 8M-17-10l7-2M17 10l-1-8M17 10l-7 2M-17 10l7 2M-17 10l1-8M17-10l-7-2M17-10l-1 8" />
      </g>
      <rect x="40" y="70" width="8" height="80" rx="4" fill="#fff" opacity=".12" />
    </svg>
  );
}

export function Holly() {
  return (
    <svg viewBox="0 0 180 130" role="presentation">
      <defs>
        <linearGradient id="holly-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f7a4a" />
          <stop offset="1" stopColor="#1e4a2a" />
        </linearGradient>
      </defs>
      <g fill="url(#holly-leaf)" stroke="#143820" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M86 66C70 50 52 46 34 38c6 12-4 18-12 26 12 2 18 12 20 26 12-8 24-4 38 2z" />
        <path d="M92 64c16-18 34-24 54-30-6 14 4 20 12 28-12 2-18 14-20 28-12-8-26-4-40 2z" />
        <path d="M90 60c-6-16-4-30 0-48 6 12 16 14 26 16-10 8-12 20-10 32-6-4-12-2-16 0z" />
      </g>
      <g stroke="#9fd0a8" strokeWidth="1.2" fill="none" opacity=".7">
        <path d="M84 66C66 70 52 72 42 86" />
        <path d="M94 64c18 6 32 8 44 22" />
      </g>
      <circle cx="86" cy="76" r="9" fill="#c8232c" />
      <circle cx="83" cy="73" r="3" fill="#ff8a8f" opacity=".8" />
      <circle cx="102" cy="78" r="9" fill="#b51b23" />
      <circle cx="99" cy="75" r="3" fill="#ff8a8f" opacity=".8" />
      <circle cx="94" cy="92" r="9" fill="#d0262f" />
      <circle cx="91" cy="89" r="3" fill="#ff8a8f" opacity=".8" />
    </svg>
  );
}

export function Spectacles() {
  return (
    <svg viewBox="0 0 240 100" role="presentation">
      <defs>
        <linearGradient id="spec-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#8a6a1f" />
          <stop offset=".5" stopColor="#efd27a" />
          <stop offset="1" stopColor="#8a6a1f" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="90" rx="100" ry="6" fill="rgba(0,0,0,.35)" />
      <circle cx="70" cy="50" r="34" fill="rgba(220,235,255,.18)" stroke="url(#spec-gold)" strokeWidth="4" />
      <circle cx="170" cy="50" r="34" fill="rgba(220,235,255,.18)" stroke="url(#spec-gold)" strokeWidth="4" />
      <path d="M104 46q16-14 32 0" fill="none" stroke="url(#spec-gold)" strokeWidth="4" />
      <path d="M36 44q-14-4-26 6M204 44q14-4 26 6" fill="none" stroke="url(#spec-gold)" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 32q10-10 22-8M148 32q10-10 22-8" stroke="#fff" strokeWidth="2" opacity=".5" fill="none" />
    </svg>
  );
}

function Envelope({ x, y, rotate, tint }: { x: number; y: number; rotate: number; tint: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect width="150" height="96" rx="3" fill={tint} stroke="#8a6a3a" strokeWidth="1.2" />
      <path d="M0 0l75 52L150 0" fill="none" stroke="#8a6a3a" strokeWidth="1.2" />
      <path d="M0 96l58-52M150 96L92 44" stroke="#8a6a3a" strokeWidth="1" opacity=".6" />
      <circle cx="75" cy="52" r="9" fill="#9b1c22" />
      <circle cx="72" cy="49" r="3" fill="#d8484f" opacity=".8" />
      <rect x="112" y="8" width="26" height="30" fill="#c9d8e6" stroke="#5a6f88" strokeWidth="1" opacity=".9" />
      <path d="M22 62h50M22 70h38M22 78h44" stroke="#6b5440" strokeWidth="1.5" opacity=".55" />
    </g>
  );
}

export function EnvelopeStack() {
  return (
    <svg viewBox="0 0 260 190" role="presentation">
      <ellipse cx="130" cy="176" rx="110" ry="10" fill="rgba(0,0,0,.35)" />
      <Envelope x={20} y={60} rotate={-8} tint="#e8dcbe" />
      <Envelope x={60} y={44} rotate={5} tint="#f1e6cc" />
      <Envelope x={40} y={30} rotate={-3} tint="#f7eed8" />
    </svg>
  );
}
