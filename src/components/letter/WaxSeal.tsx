export default function WaxSeal({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "seal seal-sm" : "seal"} aria-hidden="true">
      <span className="seal-glyph">S</span>
    </span>
  );
}
