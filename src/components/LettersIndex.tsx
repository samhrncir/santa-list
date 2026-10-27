"use client";

import type { User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { shortDate } from "@/lib/dates";
import { friendlyError } from "@/lib/errors";
import { createLetter, deleteLetter, subscribeMyLetters } from "@/lib/letters";
import { LIMITS, type Letter, type Scene } from "@/lib/types";
import WaxSeal from "./letter/WaxSeal";
import { ErrorBanner } from "./Notice";

function EnvelopeCard({ letter, onDelete }: { letter: Letter; onDelete: (id: string) => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const count = letter.items.length;
  return (
    <div className="envelope-slot">
      <Link href={`/l/${letter.id}`} className="envelope">
        <span className="envelope-flap" aria-hidden="true" />
        {letter.sharing && <span className="envelope-ribbon">Shared</span>}
        <span className="envelope-seal-pos" aria-hidden="true">
          <WaxSeal small />
        </span>
        <span className="envelope-to">
          <span className="envelope-from">From {letter.childName || "me"}</span>
          <span className="envelope-meta">
            <span>{count === 1 ? "1 wish" : `${count} wishes`}</span>
            {letter.updatedAt && <span>· {shortDate(letter.updatedAt.toDate())}</span>}
          </span>
        </span>
      </Link>
      <div className="envelope-tools">
        {confirming ? (
          <>
            <span className="wish-confirm">Throw this letter away?</span>
            <button
              type="button"
              className="tool-btn tool-btn-danger"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onDelete(letter.id);
                setBusy(false);
                setConfirming(false);
              }}
            >
              Yes, delete
            </button>
            <button type="button" className="tool-btn" onClick={() => setConfirming(false)}>
              Keep it
            </button>
          </>
        ) : (
          <button type="button" className="tool-btn tool-btn-danger" onClick={() => setConfirming(true)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function LettersIndex({ user, scene }: { user: User; scene: Scene }) {
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(
    () => subscribeMyLetters(user.uid, setLetters, (err) => setError(friendlyError(err))),
    [user.uid],
  );

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const id = await createLetter(user.uid, name, scene);
      router.push(`/l/${id}`);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLetter(id);
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <section className="letters-index">
      <h1 className="index-title">Your letters</h1>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      <div className="envelopes">
        <form className="envelope envelope-new" onSubmit={handleCreate}>
          <p className="add-wish-title">Write a new letter</p>
          <label className="envelope-new-field">
            <span className="field-label">Who is it from?</span>
            <input
              className="ink-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={LIMITS.childName}
              placeholder="Emma"
              required
            />
          </label>
          <button type="submit" className="btn btn-wax btn-sm" disabled={busy}>
            {busy ? "Sharpening the pencil…" : "Start writing"}
          </button>
        </form>
        {letters === null ? (
          <p className="envelopes-note">Looking through the mailbag…</p>
        ) : (
          letters.map((letter) => <EnvelopeCard key={letter.id} letter={letter} onDelete={handleDelete} />)
        )}
      </div>
      {letters !== null && letters.length === 0 && (
        <p className="envelopes-note">No letters yet. Write the first one above!</p>
      )}
    </section>
  );
}
