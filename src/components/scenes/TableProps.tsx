/* Hand-drawn SVG props for the child's table. Decorative only. */

export function Crayon({ color, dark }: { color: string; dark: string }) {
  return (
    <svg viewBox="0 0 220 44" role="presentation">
      <ellipse cx="112" cy="40" rx="100" ry="4" fill="rgba(0,0,0,.22)" />
      <polygon points="34,8 6,22 34,36" fill={dark} />
      <polygon points="34,8 6,22 34,22" fill={color} />
      <rect x="34" y="8" width="180" height="28" rx="3" fill={color} />
      <rect x="34" y="8" width="180" height="11" rx="3" fill="#fff" opacity=".16" />
      <rect x="52" y="6" width="150" height="32" rx="2" fill={dark} />
      <rect x="52" y="10" width="150" height="2" fill="#fff" opacity=".5" />
      <rect x="52" y="32" width="150" height="2" fill="#fff" opacity=".5" />
      <rect x="60" y="17" width="40" height="10" rx="2" fill="#fff" opacity=".85" />
    </svg>
  );
}

export function Cookie() {
  return (
    <svg viewBox="0 0 150 140" role="presentation">
      <defs>
        <mask id="cookie-bite">
          <rect width="150" height="140" fill="#fff" />
          <circle cx="122" cy="38" r="28" fill="#000" />
        </mask>
        <radialGradient id="cookie-fill" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#e6b57c" />
          <stop offset="1" stopColor="#b97a3f" />
        </radialGradient>
      </defs>
      <ellipse cx="72" cy="128" rx="56" ry="7" fill="rgba(0,0,0,.22)" />
      <g mask="url(#cookie-bite)">
        <circle cx="72" cy="70" r="54" fill="url(#cookie-fill)" stroke="#9a6132" strokeWidth="2" />
        <g fill="#4a2a17">
          <ellipse cx="50" cy="52" rx="6" ry="4.5" transform="rotate(-20 50 52)" />
          <ellipse cx="80" cy="44" rx="5.5" ry="4" transform="rotate(15 80 44)" />
          <ellipse cx="42" cy="84" rx="6" ry="4.5" transform="rotate(30 42 84)" />
          <ellipse cx="70" cy="96" rx="5.5" ry="4" transform="rotate(-10 70 96)" />
          <ellipse cx="96" cy="78" rx="6" ry="4.5" transform="rotate(40 96 78)" />
          <ellipse cx="68" cy="68" rx="5" ry="3.5" transform="rotate(-35 68 68)" />
        </g>
      </g>
      <g fill="#c99252">
        <circle cx="128" cy="76" r="2.5" />
        <circle cx="136" cy="66" r="1.8" />
        <circle cx="118" cy="92" r="2" />
        <circle cx="140" cy="88" r="1.5" />
      </g>
    </svg>
  );
}

export function Milk() {
  return (
    <svg viewBox="0 0 120 170" role="presentation">
      <ellipse cx="60" cy="160" rx="44" ry="7" fill="rgba(0,0,0,.22)" />
      <path d="M26 44h68l-7 104q-1 6-7 6H40q-6 0-7-6z" fill="#fffdf6" />
      <ellipse cx="60" cy="44" rx="34" ry="6" fill="#fff" />
      <path d="M22 14h76l-10 136q-1 8-9 8H41q-8 0-9-8z" fill="rgba(225,240,255,.45)" stroke="rgba(120,150,180,.75)" strokeWidth="2" />
      <ellipse cx="60" cy="14" rx="38" ry="6" fill="rgba(235,245,255,.6)" stroke="rgba(120,150,180,.75)" strokeWidth="2" />
      <path d="M33 26l3 114" stroke="#fff" strokeWidth="6" opacity=".7" strokeLinecap="round" />
    </svg>
  );
}

export function StarSticker() {
  return (
    <svg viewBox="0 0 60 60" role="presentation">
      <polygon
        points="30,3 37,22 57,22 41,34 47,54 30,42 13,54 19,34 3,22 23,22"
        fill="#f8c93a"
        stroke="#d9a51c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon points="30,12 34,24 46,24 36,31 40,43 30,36 20,43 24,31 14,24 26,24" fill="#ffe27a" opacity=".7" />
    </svg>
  );
}

export function Drawing({ variant }: { variant: "tree" | "snowman" }) {
  if (variant === "tree") {
    return (
      <svg viewBox="0 0 260 200" role="presentation">
        <rect x="2" y="2" width="256" height="196" fill="#fbf3c6" stroke="#e3d89c" strokeWidth="2" />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".92">
          <path d="M130 40l-30 50 16-2-30 46 20-2-32 44h112l-32-44 20 2-30-46 16 2z" stroke="#2e8b3d" strokeWidth="7" />
          <path d="M122 176v16M138 176v16" stroke="#8d5a2b" strokeWidth="7" />
          <polyline points="130,22 134,34 146,34 137,41 140,53 130,46 120,53 123,41 114,34 126,34 130,22" stroke="#f5c400" strokeWidth="5" fill="#ffd93d" />
        </g>
        <g opacity=".9">
          <circle cx="112" cy="110" r="6" fill="#e53935" />
          <circle cx="150" cy="120" r="6" fill="#1e88e5" />
          <circle cx="130" cy="150" r="6" fill="#e53935" />
          <circle cx="100" cy="160" r="6" fill="#fdd835" />
          <circle cx="162" cy="158" r="6" fill="#1e88e5" />
        </g>
        <path d="M28 40q10-12 20 0t20 0 20 0" stroke="#e53935" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".85" />
        <path d="M200 160q8 14 16 0t16 0" stroke="#1e88e5" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".85" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 200" role="presentation">
      <rect x="2" y="2" width="236" height="196" fill="#d6e8fa" stroke="#b5cfe9" strokeWidth="2" />
      <g fill="#fff" stroke="#6b7a8c" strokeWidth="5" opacity=".95">
        <circle cx="120" cy="150" r="36" />
        <circle cx="120" cy="98" r="27" />
        <circle cx="120" cy="56" r="20" />
      </g>
      <path d="M94 96l-30-18M64 78l-8-10M146 96l30-18M176 78l8-10" stroke="#8d5a2b" strokeWidth="5" strokeLinecap="round" />
      <rect x="100" y="26" width="40" height="8" fill="#222" />
      <rect x="108" y="6" width="24" height="22" fill="#222" />
      <circle cx="113" cy="52" r="2.5" fill="#222" />
      <circle cx="127" cy="52" r="2.5" fill="#222" />
      <polygon points="120,58 140,62 120,66" fill="#f5831f" />
      <path d="M110 68q10 8 20 0" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M100 76q20 10 40 0l6 14q-26-6-52 0z" fill="#e53935" />
      <circle cx="120" cy="92" r="2.5" fill="#222" />
      <circle cx="120" cy="104" r="2.5" fill="#222" />
      <circle cx="120" cy="140" r="2.5" fill="#222" />
      <circle cx="120" cy="156" r="2.5" fill="#222" />
      <g fill="#fff" stroke="#9fb3c8" strokeWidth="1">
        <circle cx="30" cy="30" r="4" />
        <circle cx="60" cy="150" r="3" />
        <circle cx="200" cy="40" r="4" />
        <circle cx="210" cy="120" r="3" />
        <circle cx="40" cy="90" r="3" />
      </g>
    </svg>
  );
}
