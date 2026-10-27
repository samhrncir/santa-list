"use client";

import type { ReactNode } from "react";
import { SCENE_LABELS, SCENES, type Scene } from "@/lib/types";

const ICONS: Record<Scene, ReactNode> = {
  desk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2c2 2.5 2.6 4.2 1.6 5.6-.8 1.1-2.4 1.1-3.2 0C9.4 6.2 10 4.5 12 2z" fill="currentColor" stroke="none" />
      <rect x="9.5" y="9" width="5" height="9" rx="1" />
      <path d="M6 21h12M8 18h8" />
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
      <path d="M12 2l-2.5 2.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5M3.3 7l3.4.9M3.3 7l.9 3.4M20.7 17l-3.4-.9M20.7 17l-.9-3.4M3.3 17l.9-3.4M3.3 17l3.4-.9M20.7 7l-.9 3.4M20.7 7l-3.4.9" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20l2.5-2.5M6.5 17.5L17 7l3-1-1 3L8.5 19.5z" />
      <path d="M15 9l1.5 1.5M4 20l4.5-.5" />
    </svg>
  ),
};

type Props = { scene: Scene; onChange: (scene: Scene) => void };

export default function SceneSwitcher({ scene, onChange }: Props) {
  return (
    <div className="scene-switcher" role="group" aria-label="Background scene">
      {SCENES.map((option) => (
        <button
          key={option}
          type="button"
          className="scene-btn"
          aria-pressed={scene === option}
          aria-label={SCENE_LABELS[option]}
          onClick={() => onChange(option)}
        >
          {ICONS[option]}
          <span className="scene-label">{SCENE_LABELS[option]}</span>
        </button>
      ))}
    </div>
  );
}
