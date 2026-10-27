"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LetterContent, { type LetterHandlers } from "@/components/letter/LetterContent";
import LetterSheet from "@/components/letter/LetterSheet";
import Notice, { ConfigNotice, ErrorBanner, LoadingLetter } from "@/components/Notice";
import SceneSwitcher from "@/components/SceneSwitcher";
import ShareDialog from "@/components/ShareDialog";
import SignInCard from "@/components/SignInCard";
import TopBar, { UserMenu } from "@/components/TopBar";
import Background from "@/components/scenes/Background";
import { useAuth } from "@/lib/auth";
import { letterDate } from "@/lib/dates";
import { friendlyError } from "@/lib/errors";
import {
  addWish,
  moveWish,
  removeWish,
  rotateLink,
  setSharing,
  subscribeLetter,
  updateLetter,
  updateWish,
  type LetterState,
} from "@/lib/letters";
import { useStoredScene } from "@/lib/scene-store";
import type { Scene } from "@/lib/types";

type Snapshot = { id: string; state: LetterState };
const LOADING: LetterState = { status: "loading" };

export default function LetterEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading, configured } = useAuth();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [movingFrom, setMovingFrom] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storedScene] = useStoredScene();

  useEffect(() => {
    if (!configured || loading || !user) return;
    return subscribeLetter(id, (state) => setSnapshot({ id, state }));
  }, [id, configured, loading, user]);

  // Snapshots are keyed by id so a stale subscription can never show the wrong letter.
  const state = snapshot?.id === id ? snapshot.state : LOADING;
  const letter = state.status === "ready" ? state.letter : null;
  const isOwner = letter !== null && user !== null && letter.ownerId === user.uid;
  const moving = movingFrom === id;

  useEffect(() => {
    if (letter && user && !isOwner) router.replace(`/s/${letter.id}`);
  }, [letter, user, isOwner, router]);

  const childName = letter?.childName;
  useEffect(() => {
    if (childName) document.title = `${childName}'s letter · Letters to Santa`;
  }, [childName]);

  const run = useCallback(async (action: () => Promise<unknown>): Promise<boolean> => {
    setError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setError(friendlyError(err));
      return false;
    }
  }, []);

  const scene: Scene = letter?.background ?? storedScene;

  const handlers: LetterHandlers | null = letter
    ? {
        onSaveIntro: (value) => run(() => updateLetter(letter.id, { intro: value })),
        onSaveName: (value) => run(() => updateLetter(letter.id, { childName: value })),
        onAdd: (input) => run(() => addWish(letter.id, input)),
        onUpdate: (wishId, input) => run(() => updateWish(letter.id, wishId, input)),
        onRemove: (wishId) => run(() => removeWish(letter.id, wishId)),
        onMove: (wishId, delta) => run(() => moveWish(letter.id, wishId, delta)),
      }
    : null;

  const backHome = (
    <Link href="/" className="btn btn-paper">
      Back to my letters
    </Link>
  );

  let body;
  if (!configured) body = <ConfigNotice />;
  else if (loading) body = <LoadingLetter />;
  else if (!user) {
    body = (
      <SignInCard
        title="Dear friend,"
        message="This letter lives in someone's account. Sign in to open it, or ask them for the shared link instead."
      />
    );
  } else if (moving) body = <LoadingLetter text="Sealing a brand-new envelope…" />;
  else if (state.status === "loading") body = <LoadingLetter />;
  else if (state.status === "missing") {
    body = (
      <Notice title="No letter here" action={backHome}>
        <p>This link doesn&apos;t lead to a letter any more. It may have been deleted, or given a new link.</p>
      </Notice>
    );
  } else if (state.status === "denied") {
    body = (
      <Notice title="Not your letter" action={backHome}>
        <p>This letter belongs to someone else&apos;s account. If they shared it with you, use the link they sent.</p>
      </Notice>
    );
  } else if (state.status === "error") {
    body = (
      <Notice title="Something went wrong" action={backHome}>
        <p>{state.message}</p>
      </Notice>
    );
  } else if (letter && handlers && isOwner) {
    const dateText = letter.createdAt
      ? `Written on ${letterDate(letter.createdAt.toDate())}`
      : "Written at the kitchen table";
    body = (
      <>
        <div className="letter-toolbar">
          <Link href="/" className="btn btn-ghost btn-sm">
            ← My letters
          </Link>
          <button type="button" className="btn btn-wax" onClick={() => setShareOpen(true)}>
            {letter.sharing ? "Shared · manage link" : "Share by private link"}
          </button>
        </div>
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
        <LetterSheet dateText={dateText}>
          <LetterContent letter={letter} editable handlers={handlers} />
        </LetterSheet>
      </>
    );
  } else {
    // A signed-in visitor who is not the owner is being redirected to the shared view.
    body = <LoadingLetter />;
  }

  return (
    <>
      <Background scene={scene} />
      <div className="page">
        <TopBar>{user && <UserMenu />}</TopBar>
        <main className="page-main">
          {body}
          <Footer />
        </main>
      </div>
      {letter && isOwner && (
        <>
          <SceneSwitcher scene={scene} onChange={(next) => void run(() => updateLetter(letter.id, { background: next }))} />
          <ShareDialog
            open={shareOpen}
            letter={letter}
            onClose={() => setShareOpen(false)}
            onToggle={(sharing) => run(() => setSharing(letter.id, sharing))}
            onRotate={async () => {
              setMovingFrom(letter.id);
              const ok = await run(async () => {
                const newId = await rotateLink(letter);
                router.replace(`/l/${newId}`);
              });
              if (!ok) setMovingFrom(null);
            }}
          />
        </>
      )}
    </>
  );
}
