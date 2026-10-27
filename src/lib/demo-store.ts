import { newLetterId, newWishId } from "./ids";
import { addWishTo, cleanPatch, moveWishIn, removeWishFrom, text, toWish, updateWishIn } from "./letter-model";
import {
  DEFAULT_INTRO,
  LIMITS,
  isScene,
  type Letter,
  type LettersApi,
  type Scene,
  type Unsubscribe,
  type Wish,
} from "./types";

/**
 * The demo back end: a shelf of letters kept in a key/value storage (localStorage in
 * the browser). Same behaviour as Firestore from the app's point of view, minus the
 * network, so the whole app can be tried without Google sign-in or a database.
 */

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export const DEMO_STORAGE_KEY = "santa:demo:letters";

type StoredLetter = {
  id: string;
  ownerId: string;
  childName: string;
  intro: string;
  items: Wish[];
  sharing: boolean;
  background: Scene;
  createdAt: number;
  updatedAt: number;
};

type Shelf = Record<string, StoredLetter>;

const instant = (ms: number) => ({ toDate: () => new Date(ms), toMillis: () => ms });

function toStored(id: string, raw: unknown): StoredLetter | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.ownerId !== "string") return null;
  const items = Array.isArray(r.items) ? r.items.map(toWish).filter((w): w is Wish => w !== null) : [];
  return {
    id,
    ownerId: r.ownerId,
    childName: text(r.childName, LIMITS.childName),
    intro: text(r.intro, LIMITS.intro),
    items,
    sharing: r.sharing === true,
    background: isScene(r.background) ? r.background : "snow",
    createdAt: typeof r.createdAt === "number" ? r.createdAt : Date.now(),
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : Date.now(),
  };
}

function toLetter(s: StoredLetter): Letter {
  return {
    id: s.id,
    ownerId: s.ownerId,
    childName: s.childName,
    intro: s.intro,
    items: s.items,
    sharing: s.sharing,
    background: s.background,
    createdAt: instant(s.createdAt),
    updatedAt: instant(s.updatedAt),
  };
}

/** The letter a fresh demo starts with, so there is something to look at. */
function exampleLetter(ownerId: string): StoredLetter {
  const now = Date.now();
  const wish = (name: string, url: string, note: string, minutesAgo: number): Wish => ({
    id: newWishId(),
    name,
    url,
    note,
    createdAt: now - minutesAgo * 60_000,
  });
  return {
    id: newLetterId(),
    ownerId,
    childName: "Emma",
    intro: DEFAULT_INTRO,
    items: [
      wish("A red bicycle with a bell", "https://www.amazon.com/s?k=kids+bicycle+16+inch", "16-inch, with streamers if the elves have them", 90),
      wish("The big castle building set", "https://www.lego.com/", "the one with the dragon", 60),
      wish("A snow globe with a tiny village inside", "", "", 30),
    ],
    sharing: true,
    background: "snow",
    createdAt: now - 2 * 86_400_000,
    updatedAt: now - 30 * 60_000,
  };
}

export function createDemoStore(storage: StorageLike, options: { seedOwner?: string } = {}): LettersApi & { notify(): void } {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  const read = (): Shelf | null => {
    let raw: string | null;
    try {
      raw = storage.getItem(DEMO_STORAGE_KEY);
    } catch {
      return {};
    }
    if (raw === null) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      const shelf: Shelf = {};
      for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
        const stored = toStored(id, value);
        if (stored) shelf[id] = stored;
      }
      return shelf;
    } catch {
      return {};
    }
  };

  const write = (shelf: Shelf) => {
    try {
      storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(shelf));
    } catch {
      // Storage full or blocked; the app keeps working with what it can read.
    }
    notify();
  };

  const load = (): Shelf => {
    const existing = read();
    if (existing) return existing;
    const seeded: Shelf = {};
    if (options.seedOwner) {
      const letter = exampleLetter(options.seedOwner);
      seeded[letter.id] = letter;
    }
    write(seeded);
    return seeded;
  };

  const must = (shelf: Shelf, id: string): StoredLetter => {
    const stored = shelf[id];
    if (!stored) throw new Error("This letter no longer exists.");
    return stored;
  };

  const mutate = async (id: string, change: (letter: StoredLetter) => void): Promise<void> => {
    const shelf = load();
    const stored = must(shelf, id);
    change(stored);
    stored.updatedAt = Date.now();
    write(shelf);
  };

  return {
    notify,

    subscribeLetter(id, onChange, opts): Unsubscribe {
      const emit = () => {
        const stored = load()[id];
        if (!stored) onChange({ status: "missing" });
        else if (opts?.asGuest && !stored.sharing) onChange({ status: "denied" });
        else onChange({ status: "ready", letter: toLetter(stored) });
      };
      emit();
      listeners.add(emit);
      return () => {
        listeners.delete(emit);
      };
    },

    subscribeMyLetters(uid, onChange): Unsubscribe {
      const emit = () =>
        onChange(
          Object.values(load())
            .filter((stored) => stored.ownerId === uid)
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map(toLetter),
        );
      emit();
      listeners.add(emit);
      return () => {
        listeners.delete(emit);
      };
    },

    async createLetter(uid, childName, background) {
      const shelf = load();
      const now = Date.now();
      const id = newLetterId();
      shelf[id] = {
        id,
        ownerId: uid,
        childName: childName.trim().slice(0, LIMITS.childName) || "Me",
        intro: DEFAULT_INTRO,
        items: [],
        sharing: false,
        background,
        createdAt: now,
        updatedAt: now,
      };
      write(shelf);
      return id;
    },

    updateLetter: (id, patch) => mutate(id, (stored) => Object.assign(stored, cleanPatch(patch))),
    setSharing: (id, sharing) =>
      mutate(id, (stored) => {
        stored.sharing = sharing;
      }),
    addWish: (id, input) =>
      mutate(id, (stored) => {
        stored.items = addWishTo(stored.items, input);
      }),
    updateWish: (id, wishId, input) =>
      mutate(id, (stored) => {
        stored.items = updateWishIn(stored.items, wishId, input);
      }),
    removeWish: (id, wishId) =>
      mutate(id, (stored) => {
        stored.items = removeWishFrom(stored.items, wishId);
      }),
    moveWish: (id, wishId, delta) =>
      mutate(id, (stored) => {
        stored.items = moveWishIn(stored.items, wishId, delta);
      }),

    async rotateLink(letter) {
      const shelf = load();
      const old = must(shelf, letter.id);
      const id = newLetterId();
      shelf[id] = { ...old, id, updatedAt: Date.now() };
      delete shelf[letter.id];
      write(shelf);
      return id;
    },

    async deleteLetter(id) {
      const shelf = load();
      delete shelf[id];
      write(shelf);
    },
  };
}
