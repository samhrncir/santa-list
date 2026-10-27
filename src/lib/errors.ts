import { FirebaseError } from "firebase/app";

/** Turns Firebase/JS errors into a sentence a parent can act on. */
export function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return "The elves wouldn't allow that (permission denied). If you just set this up, make sure the Firestore rules are deployed.";
      case "unavailable":
        return "The North Pole is out of reach right now. Check your connection and try again.";
      case "auth/unauthorized-domain":
        return "This website isn't on the Firebase Authentication authorized-domains list yet.";
      case "auth/popup-blocked":
        return "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.";
      case "auth/operation-not-allowed":
        return "Google sign-in isn't enabled for this Firebase project yet.";
      case "auth/network-request-failed":
        return "Couldn't reach Google to sign you in. Check your connection and try again.";
      default:
        return error.message;
    }
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}
