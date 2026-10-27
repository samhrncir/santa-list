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

/** The signed-in person, whichever back end produced them. */
export type AppUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

/** A point in time; Firestore's Timestamp satisfies this, and so does the demo store's stand-in. */
export type Instant = {
  toDate(): Date;
  toMillis(): number;
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
  createdAt: Instant | null;
  updatedAt: Instant | null;
};

export type LetterPatch = Partial<Pick<Letter, "childName" | "intro" | "background" | "sharing">>;

export type WishInput = { name: string; url: string; note: string };

export type LetterState =
  | { status: "loading" }
  | { status: "ready"; letter: Letter }
  | { status: "missing" }
  | { status: "denied" }
  | { status: "error"; message: string };

export type SubscribeOptions = {
  /** Treat the reader as a guest, so private letters come back as "denied". Firestore decides this by itself. */
  asGuest?: boolean;
};

export type Unsubscribe = () => void;

/** What a letter back end (Firestore or the in-browser demo shelf) has to provide. */
export interface LettersApi {
  subscribeLetter(id: string, onChange: (state: LetterState) => void, options?: SubscribeOptions): Unsubscribe;
  subscribeMyLetters(uid: string, onChange: (letters: Letter[]) => void, onError: (error: Error) => void): Unsubscribe;
  createLetter(uid: string, childName: string, background: Scene): Promise<string>;
  updateLetter(id: string, patch: LetterPatch): Promise<void>;
  setSharing(id: string, sharing: boolean): Promise<void>;
  addWish(id: string, input: WishInput): Promise<void>;
  updateWish(id: string, wishId: string, input: WishInput): Promise<void>;
  removeWish(id: string, wishId: string): Promise<void>;
  moveWish(id: string, wishId: string, delta: -1 | 1): Promise<void>;
  /** Moves the letter to a brand-new id so every copy of the old link stops working. */
  rotateLink(letter: Letter): Promise<string>;
  deleteLetter(id: string): Promise<void>;
}

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
