import { DEMO_USER } from "./demo-session";
import { DEMO_STORAGE_KEY, createDemoStore, type StorageLike } from "./demo-store";

/** The demo shelf bound to this browser's localStorage (or memory when storage is blocked). */

const memory = new Map<string, string>();
const memoryStorage: StorageLike = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value);
  },
};

function pickStorage(): StorageLike {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {
    // Private mode or blocked storage.
  }
  return memoryStorage;
}

const store = createDemoStore(pickStorage(), { seedOwner: DEMO_USER.uid });

// Other tabs (for example the shared view opened from the share dialog) update live.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === DEMO_STORAGE_KEY || event.key === null) store.notify();
  });
}

export const {
  subscribeLetter,
  subscribeMyLetters,
  createLetter,
  updateLetter,
  setSharing,
  addWish,
  updateWish,
  removeWish,
  moveWish,
  rotateLink,
  deleteLetter,
} = store;
