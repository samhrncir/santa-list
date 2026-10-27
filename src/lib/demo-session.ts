import type { AppUser } from "./types";

const KEY = "santa:demo:signed-in";
const listeners = new Set<() => void>();
let fallback = false;

export const DEMO_USER: AppUser = {
  uid: "demo-parent",
  displayName: "Demo Parent",
  email: null,
  photoURL: null,
};

function read(): boolean {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored !== null) return stored === "1";
  } catch {
    // Storage blocked: fall through to the in-memory flag.
  }
  return fallback;
}

/** The pretend sign-in used by demo mode, shaped for useSyncExternalStore. */
export const demoSession = {
  subscribe(onChange: () => void) {
    listeners.add(onChange);
    window.addEventListener("storage", onChange);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  getSnapshot: read,
  getServerSnapshot: () => false,
  setSignedIn(value: boolean) {
    fallback = value;
    try {
      window.localStorage.setItem(KEY, value ? "1" : "0");
    } catch {
      // Keep going with the in-memory flag.
    }
    listeners.forEach((listener) => listener());
  },
};
