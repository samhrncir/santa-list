"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LetterContent from "@/components/letter/LetterContent";
import LetterSheet from "@/components/letter/LetterSheet";
import Notice, { ConfigNotice, LoadingLetter } from "@/components/Notice";
import SceneSwitcher from "@/components/SceneSwitcher";
import TopBar, { UserMenu } from "@/components/TopBar";
import Background from "@/components/scenes/Background";
import { useAuth } from "@/lib/auth";
import { letterDate } from "@/lib/dates";
import { subscribeLetter, type LetterState } from "@/lib/letters";
import type { Scene } from "@/lib/types";

type Snapshot = { id: string; state: LetterState };
const LOADING: LetterState = { status: "loading" };

/** Read-only view for anyone who holds the private link. No sign-in required. */
export default function SharedLetter() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, configured } = useAuth();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [sceneOverride, setSceneOverride] = useState<Scene | null>(null);

  useEffect(() => {
    if (!configured || loading) return;
    return subscribeLetter(id, (state) => setSnapshot({ id, state }));
  }, [id, configured, loading]);

  const state = snapshot?.id === id ? snapshot.state : LOADING;
  const letter = state.status === "ready" ? state.letter : null;
  const isOwner = letter !== null && user !== null && letter.ownerId === user.uid;
  const scene: Scene = sceneOverride ?? letter?.background ?? "snow";

  const childName = letter?.childName;
  useEffect(() => {
    if (childName) document.title = `${childName}'s letter to Santa`;
  }, [childName]);

  const writeYourOwn = (
    <Link href="/" className="btn btn-paper">
      Write your own letter
    </Link>
  );

  let body;
  if (!configured) body = <ConfigNotice />;
  else if (loading || state.status === "loading") body = <LoadingLetter text="Unfolding the letter…" />;
  else if (state.status === "missing") {
    body = (
      <Notice title="No letter here" action={writeYourOwn}>
        <p>This link doesn&apos;t lead anywhere. Perhaps the elves misplaced it, or a new link was made.</p>
      </Notice>
    );
  } else if (state.status === "denied") {
    body = (
      <Notice title="This letter is private" action={writeYourOwn}>
        <p>Whoever wrote it hasn&apos;t shared it, or has turned sharing off. Ask them for a fresh link.</p>
      </Notice>
    );
  } else if (state.status === "error") {
    body = (
      <Notice title="Something went wrong" action={writeYourOwn}>
        <p>{state.message}</p>
      </Notice>
    );
  } else if (letter) {
    const dateText = letter.createdAt
      ? `Written on ${letterDate(letter.createdAt.toDate())}`
      : "Written at the kitchen table";
    body = (
      <>
        {isOwner && (
          <p className="owner-hint">
            <span>This is how guests see the letter.</span>
            <Link href={`/l/${letter.id}`}>Back to editing</Link>
          </p>
        )}
        <LetterSheet dateText={dateText}>
          <LetterContent letter={letter} editable={false} />
        </LetterSheet>
      </>
    );
  }

  return (
    <>
      <Background scene={scene} />
      <div className="page">
        <TopBar>{user ? <UserMenu /> : <Link href="/">Write your own letter</Link>}</TopBar>
        <main className="page-main">
          {body}
          <Footer />
        </main>
      </div>
      <SceneSwitcher scene={scene} onChange={setSceneOverride} />
    </>
  );
}
