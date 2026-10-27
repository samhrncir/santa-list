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
} from "firebase/firestore";
import { firestore } from "./firebase";
import { newLetterId } from "./ids";
import { addWishTo, cleanPatch, moveWishIn, removeWishFrom, text, toWish, updateWishIn } from "./letter-model";
import {
  DEFAULT_INTRO,
  LIMITS,
  isScene,
  type Letter,
  type LetterPatch,
  type LetterState,
  type Scene,
  type Unsubscribe,
  type Wish,
  type WishInput,
} from "./types";

/** The real back end: one Firestore document per letter, guarded by firestore.rules. */

const COLLECTION = "letters";
const letterRef = (id: string) => doc(firestore(), COLLECTION, id);

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

/** Guest access is decided by the security rules, so no options are needed here. */
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
  onError: (error: Error) => void,
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

export async function updateLetter(id: string, patch: LetterPatch): Promise<void> {
  await updateDoc(letterRef(id), { ...cleanPatch(patch), updatedAt: serverTimestamp() });
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

export const addWish = (id: string, input: WishInput) => mutateItems(id, (items) => addWishTo(items, input));

export const updateWish = (id: string, wishId: string, input: WishInput) =>
  mutateItems(id, (items) => updateWishIn(items, wishId, input));

export const removeWish = (id: string, wishId: string) => mutateItems(id, (items) => removeWishFrom(items, wishId));

export const moveWish = (id: string, wishId: string, delta: -1 | 1) =>
  mutateItems(id, (items) => moveWishIn(items, wishId, delta));

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
    createdAt: letter.createdAt instanceof Timestamp ? letter.createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.delete(letterRef(letter.id));
  await batch.commit();
  return newId;
}

export const deleteLetter = (id: string) => deleteDoc(letterRef(id));
