import * as demo from "./letters-demo";
import * as cloud from "./letters-firestore";
import { isDemo } from "./mode";
import type { LettersApi } from "./types";

/** The letter back end the rest of the app talks to: Firestore, or the in-browser demo shelf. */
const impl: LettersApi = isDemo ? demo : cloud;

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
} = impl;

export type { LetterState, WishInput } from "./types";
