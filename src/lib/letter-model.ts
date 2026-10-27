import { newWishId } from "./ids";
import { LIMITS, isScene, type LetterPatch, type Wish, type WishInput } from "./types";
import { isSafeHttpUrl } from "./urls";

/** Pure helpers shared by the Firestore back end and the in-browser demo shelf. */

export const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

/** Defensive mapping of a stored wish: never trust shape blindly, even from our own writes. */
export function toWish(raw: unknown): Wish | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name = text(r.name, LIMITS.wishName).trim();
  if (typeof r.id !== "string" || !name) return null;
  const url = text(r.url, LIMITS.url);
  return {
    id: r.id,
    name,
    url: isSafeHttpUrl(url) ? url : "",
    note: text(r.note, LIMITS.note),
    createdAt: typeof r.createdAt === "number" ? r.createdAt : 0,
  };
}

export function cleanWish(input: WishInput): WishInput {
  const name = input.name.trim().replace(/\s+/g, " ").slice(0, LIMITS.wishName);
  if (!name) throw new Error("Every wish needs a name.");
  const url = input.url.trim();
  if (url && !isSafeHttpUrl(url)) throw new Error("That link doesn't look like a web address.");
  return { name, url, note: input.note.trim().slice(0, LIMITS.note) };
}

/** Trims an owner-side edit to the field limits and drops anything unexpected. */
export function cleanPatch(patch: LetterPatch): LetterPatch {
  const out: LetterPatch = {};
  if (patch.childName !== undefined) out.childName = patch.childName.slice(0, LIMITS.childName);
  if (patch.intro !== undefined) out.intro = patch.intro.slice(0, LIMITS.intro);
  if (patch.background !== undefined && isScene(patch.background)) out.background = patch.background;
  if (patch.sharing !== undefined) out.sharing = patch.sharing === true;
  return out;
}

export function addWishTo(items: Wish[], input: WishInput): Wish[] {
  if (items.length >= LIMITS.items) {
    throw new Error(`Santa's sleigh only holds ${LIMITS.items} wishes per letter.`);
  }
  return [...items, { id: newWishId(), ...cleanWish(input), createdAt: Date.now() }];
}

export function updateWishIn(items: Wish[], wishId: string, input: WishInput): Wish[] {
  return items.map((w) => (w.id === wishId ? { ...w, ...cleanWish(input) } : w));
}

export function removeWishFrom(items: Wish[], wishId: string): Wish[] {
  return items.filter((w) => w.id !== wishId);
}

export function moveWishIn(items: Wish[], wishId: string, delta: -1 | 1): Wish[] {
  const from = items.findIndex((w) => w.id === wishId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= items.length) return items;
  const next = [...items];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
