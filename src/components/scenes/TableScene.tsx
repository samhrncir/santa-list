import { Cookie, Crayon, Drawing, Milk, StarSticker } from "./TableProps";

const CRAYONS = [
  { color: "#e53935", dark: "#9f1f1f", className: "prop-crayon-1" },
  { color: "#1e88e5", dark: "#0f4f8a", className: "prop-crayon-2" },
  { color: "#43a047", dark: "#1f6b24", className: "prop-crayon-3" },
  { color: "#fdd835", dark: "#b89a12", className: "prop-crayon-4" },
  { color: "#8e24aa", dark: "#5a1270", className: "prop-crayon-5" },
  { color: "#fb8c00", dark: "#a85a00", className: "prop-crayon-6" },
];

export default function TableScene() {
  return (
    <div className="scene-table">
      <div className="table-cloth" />
      <div className="table-vignette" />
      <div className="prop prop-drawing-1"><Drawing variant="tree" /></div>
      <div className="prop prop-drawing-2"><Drawing variant="snowman" /></div>
      {CRAYONS.map((c) => (
        <div key={c.className} className={`prop ${c.className}`}>
          <Crayon color={c.color} dark={c.dark} />
        </div>
      ))}
      <div className="prop prop-cookie"><Cookie /></div>
      <div className="prop prop-milk"><Milk /></div>
      <div className="prop prop-star-1"><StarSticker /></div>
      <div className="prop prop-star-2"><StarSticker /></div>
      <div className="prop prop-star-3"><StarSticker /></div>
    </div>
  );
}
