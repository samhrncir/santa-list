import type { Timestamp } from "firebase/firestore";

export const SCENES = ["desk", "snow", "table"] as const;
export type Scene = (typeof SCENES)[number];

export function isScene(value: unknown): value is Scene {
  return typeof value === "string" && (SCENES as readonly string[]).includes(value);
}

export const SCENE_LABELS: Record<Scene, string> = {
  desk: "Santa's desk",
  snow: "Falling snow",
  table: "A child's table",
};

/** One wish on the list. Stored inline on the letter document. */
export type Wish = {
  id: string;
  name: string;
  /** Empty string when there is no link. Always http(s) when present. */
  url: string;
  /** Empty string when there is no note. */
  note: string;
  /** Epoch milliseconds, set on the client when the wish is added. */
  createdAt: number;
};

/** A letter to Santa. The document id doubles as the private-link secret. */
export type Letter = {
  id: string;
  ownerId: string;
  childName: string;
  intro: string;
  items: Wish[];
  sharing: boolean;
  background: Scene;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

/** Mirrors the limits enforced in firestore.rules. */
export const LIMITS = {
  childName: 60,
  intro: 2000,
  items: 300,
  wishName: 200,
  url: 2048,
  note: 500,
} as const;

export const DEFAULT_INTRO =
  "I have been very good this year, and I have been thinking very hard about what I would like most of all. Here is my list:";
