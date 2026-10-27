/** A rubber-stamp postmark: two rings, text on arcs, and wavy cancellation lines. */
export default function Postmark() {
  const caps = { fontFamily: "var(--font-caps)" } as const;
  return (
    <svg className="postmark" viewBox="0 0 180 120" role="presentation">
      <defs>
        <path id="pm-top" d="M14 60A46 46 0 0 1 106 60" />
        <path id="pm-bottom" d="M10 60A50 50 0 0 0 110 60" />
        <filter id="pm-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
        </filter>
      </defs>
      <g filter="url(#pm-rough)" fill="currentColor">
        <g fill="none" stroke="currentColor">
          <circle cx="60" cy="60" r="55" strokeWidth="2.6" />
          <circle cx="60" cy="60" r="38" strokeWidth="1.3" />
        </g>
        <text fontSize="11.5" letterSpacing="1.6" style={caps}>
          <textPath href="#pm-top" startOffset="50%" textAnchor="middle">NORTH POLE</textPath>
        </text>
        <text fontSize="10" letterSpacing="1.4" style={caps}>
          <textPath href="#pm-bottom" startOffset="50%" textAnchor="middle">POST OFFICE</textPath>
        </text>
        <text x="60" y="57" textAnchor="middle" fontSize="12.5" letterSpacing="1" style={caps}>DEC 24</text>
        <text x="60" y="73" textAnchor="middle" fontSize="9.5" letterSpacing="1" style={caps}>MIDNIGHT</text>
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M122 40q9-6 18 0t18 0 18 0" />
          <path d="M122 54q9-6 18 0t18 0 18 0" />
          <path d="M122 68q9-6 18 0t18 0 18 0" />
          <path d="M122 82q9-6 18 0t18 0 18 0" />
        </g>
      </g>
    </svg>
  );
}
