/** A perforated postage stamp with a little tree on it. */
export default function Stamp() {
  return (
    <div className="stamp" aria-hidden="true">
      <div className="stamp-inner">
        <svg viewBox="0 0 60 60" className="stamp-art" role="presentation">
          <rect x="2" y="2" width="56" height="56" fill="none" stroke="#3f5f87" strokeWidth="1" />
          <path d="M30 10L18 30h6L14 44h32L36 30h6z" fill="#2f6b45" />
          <rect x="27" y="44" width="6" height="6" fill="#6b4a2b" />
          <polygon points="30,4 32,9 37,9 33,12 34,17 30,14 26,17 27,12 23,9 28,9" fill="#e0b23b" />
          <circle cx="24" cy="28" r="1.6" fill="#d13b3b" />
          <circle cx="34" cy="36" r="1.6" fill="#d13b3b" />
          <circle cx="28" cy="40" r="1.6" fill="#f0c33c" />
        </svg>
        <span className="stamp-text">NORTH POLE</span>
        <span className="stamp-value">1¢</span>
      </div>
    </div>
  );
}
