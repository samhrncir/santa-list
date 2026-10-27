import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { newLetterId, newWishId } from "./ids";
import { DEFAULT_INTRO, LIMITS, isScene, type Letter, type Scene, type Wish } from "./types";
import { isSafeHttpUrl } from "./urls";

const COLLECTION = "letters";
const letterRef = (id: string) => doc(firestore(), COLLECTION, id);

export type LetterState =
  | { status: "loading" }
  | { status: "ready"; letter: Letter }
  | { status: "missing" }
  | { status: "denied" }
  | { status: "error"; message: string };

export type WishInput = { name: string; url: string; note: string };

const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

function toWish(raw: unknown): Wish | null {
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

/** Defensive mapping: never trust document shape blindly, even from our own writes. */
function toLetter(snap: DocumentSnapshot<DocumentData>): Letter {
  const d = snap.data({ serverTimestamps: "estimate" }) ?? {};
  const items = Array.isArray(d.items)
    ? d.items.map(toWish).filter((w): w is Wish => w !== null)
    : [];
  return {
    id: snap.id,
    ownerId: typeof d.ownerId === "string" ? d.ownerId : "",
    childName: text(d.childName, LIMITS.childName),
    intro: text(d.intro, LIMITS.intro),
    items,
    sharing: d.sharing === true,
    background: isScene(d.background) ? d.background : "snow",
    createdAt: d.createdAt instanceof Timestamp ? d.createdAt : null,
    updatedAt: d.updatedAt instanceof Timestamp ? d.updatedAt : null,
  };
}

function cleanWish(input: WishInput): WishInput {
  const name = input.name.trim().replace(/\s+/g, " ").slice(0, LIMITS.wishName);
  if (!name) throw new Error("Every wish needs a name.");
  const url = input.url.trim();
  if (url && !isSafeHttpUrl(url)) throw new Error("That link doesn't look like a web address.");
  return { name, url, note: input.note.trim().slice(0, LIMITS.note) };
}

export function subscribeLetter(id: string, onChange: (state: LetterState) => void): Unsubscribe {
  return onSnapshot(
    letterRef(id),
    (snap) => {
      onChange(snap.exists() ? { status: "ready", letter: toLetter(snap) } : { status: "missing" });
    },
    (error: FirestoreError) => {
      onChange(
        error.code === "permission-denied" ? { status: "denied" } : { status: "error", message: error.message },
      );
    },
  );
}

export function subscribeMyLetters(
  uid: string,
  onChange: (letters: Letter[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe {
  const q = query(collection(firestore(), COLLECTION), where("ownerId", "==", uid));
  return onSnapshot(
    q,
    (snap) => {
      const letters = snap.docs
        .map(toLetter)
        .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0));
      onChange(letters);
    },
    onError,
  );
}

export async function createLetter(uid: string, childName: string, background: Scene): Promise<string> {
  const id = newLetterId();
  await setDoc(letterRef(id), {
    ownerId: uid,
    childName: childName.trim().slice(0, LIMITS.childName) || "Me",
    intro: DEFAULT_INTRO,
    items: [],
    sharing: false,
    background,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updateLetter(
  id: string,
  patch: Partial<Pick<Letter, "childName" | "intro" | "background" | "sharing">>,
): Promise<void> {
  await updateDoc(letterRef(id), { ...patch, updatedAt: serverTimestamp() });
}

export const setSharing = (id: string, sharing: boolean) => updateLetter(id, { sharing });

/** Read-modify-write the items array inside a transaction so two devices can't clobber each other. */
async function mutateItems(id: string, mutate: (items: Wish[]) => Wish[]): Promise<void> {
  await runTransaction(firestore(), async (tx) => {
    const snap = await tx.get(letterRef(id));
    if (!snap.exists()) throw new Error("This letter no longer exists.");
    tx.update(letterRef(id), { items: mutate(toLetter(snap).items), updatedAt: serverTimestamp() });
  });
}

export const addWish = (id: string, input: WishInput) =>
  mutateItems(id, (items) => {
    if (items.length >= LIMITS.items) {
      throw new Error(`Santa's sleigh only holds ${LIMITS.items} wishes per letter.`);
    }
    return [...items, { id: newWishId(), ...cleanWish(input), createdAt: Date.now() }];
  });

export const updateWish = (id: string, wishId: string, input: WishInput) =>
  mutateItems(id, (items) => items.map((w) => (w.id === wishId ? { ...w, ...cleanWish(input) } : w)));

export const removeWish = (id: string, wishId: string) =>
  mutateItems(id, (items) => items.filter((w) => w.id !== wishId));

export const moveWish = (id: string, wishId: string, delta: -1 | 1) =>
  mutateItems(id, (items) => {
    const from = items.findIndex((w) => w.id === wishId);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= items.length) return items;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  });

/** Moves the letter to a brand-new id so every copy of the old link stops working. */
export async function rotateLink(letter: Letter): Promise<string> {
  const newId = newLetterId();
  const batch = writeBatch(firestore());
  batch.set(letterRef(newId), {
    ownerId: letter.ownerId,
    childName: letter.childName,
    intro: letter.intro,
    items: letter.items,
    sharing: letter.sharing,
    background: letter.background,
    createdAt: letter.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.delete(letterRef(letter.id));
  await batch.commit();
  return newId;
}

export const deleteLetter = (id: string) => deleteDoc(letterRef(id));
