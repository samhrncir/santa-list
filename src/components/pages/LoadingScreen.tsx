"use client";

import { LoadingLetter } from "@/components/Notice";
import TopBar from "@/components/TopBar";
import Background from "@/components/scenes/Background";
import { useStoredScene } from "@/lib/scene-store";

/** Suspense fallback for the dynamic letter routes while the id resolves. */
export default function LoadingScreen() {
  const [scene] = useStoredScene();
  return (
    <>
      <Background scene={scene} />
      <div className="page">
        <TopBar />
        <main className="page-main">
          <LoadingLetter />
        </main>
      </div>
    </>
  );
}
