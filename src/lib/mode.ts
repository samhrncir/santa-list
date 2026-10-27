import { firebaseConfigured } from "./firebase";

const flag = (process.env.NEXT_PUBLIC_DEMO_MODE ?? "").trim().toLowerCase();

/** Demo mode was asked for explicitly with NEXT_PUBLIC_DEMO_MODE=true. */
export const demoRequested = flag === "true" || flag === "1" || flag === "yes";

/**
 * In demo mode a pretend account replaces Google sign-in and letters live in the
 * browser instead of Firestore. It is on when requested, and whenever the app has
 * no Firebase configuration to talk to.
 */
export const isDemo = demoRequested || !firebaseConfigured;
