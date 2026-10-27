import type { Metadata } from "next";
import { Suspense } from "react";
import LetterEditor from "@/components/pages/LetterEditor";
import LoadingScreen from "@/components/pages/LoadingScreen";

export const metadata: Metadata = {
  title: "Your letter",
  robots: { index: false, follow: false },
};

// The letter id is only known at request time, so the client component that
// reads it suspends during prerendering; the fallback becomes the static shell.
export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LetterEditor />
    </Suspense>
  );
}
