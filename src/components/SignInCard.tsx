"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/errors";
import LetterSheet from "./letter/LetterSheet";
import WaxSeal from "./letter/WaxSeal";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

const CANCELLED = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request"]);

const REAL_MESSAGE =
  "Before the reindeer are fed and the sleigh is packed, every good wish ought to be written down. Sign in to write a letter, add wishes with links so the elves get them exactly right, and share it with family by a private link.";

const DEMO_MESSAGE =
  "This is the demo: there is no Google account to sign in with and no database behind it. Letters you write live only in this browser, which is plenty to try everything out: write a letter, add wishes with links, share it, and change the scenery.";

type Props = { title?: string; message?: string };

export default function SignInCard({ title = "Dear Santa,", message }: Props) {
  const { signIn, demo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (!CANCELLED.has(code)) setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <LetterSheet dateText="The North Pole, in the season of giving">
      <h1 className="salutation">{title}</h1>
      <div className="letter-body">
        <p className="letter-text">{message ?? (demo ? DEMO_MESSAGE : REAL_MESSAGE)}</p>
        <ul className="features">
          <li>Write and edit a letter for each child</li>
          <li>Add a link and a note to every wish</li>
          <li>Share it with family through a private link, no account needed to read</li>
        </ul>
        <div className="signin-actions">
          {demo ? (
            <button type="button" className="btn btn-wax" onClick={handleSignIn} disabled={busy}>
              Enter as the Demo Parent
            </button>
          ) : (
            <button type="button" className="btn btn-wax btn-google" onClick={handleSignIn} disabled={busy}>
              <GoogleMark />
              {busy ? "Opening Google…" : "Sign in with Google"}
            </button>
          )}
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <p className="closing">
          <span>Yours hopefully,</span>
          <span className="signature">Everyone who has been good</span>
        </p>
      </div>
      <WaxSeal />
    </LetterSheet>
  );
}
