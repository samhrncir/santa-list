"use client";

import type { Scene } from "@/lib/types";
import DeskScene from "./DeskScene";
import SnowScene from "./SnowScene";
import TableScene from "./TableScene";

/** Full-viewport decorative backdrop. Purely visual, so it is hidden from assistive tech. */
export default function Background({ scene }: { scene: Scene }) {
  return (
    <div className="scene-root" aria-hidden="true">
      <div key={scene} className="scene-layer">
        {scene === "desk" && <DeskScene />}
        {scene === "snow" && <SnowScene />}
        {scene === "table" && <TableScene />}
      </div>
    </div>
  );
}
