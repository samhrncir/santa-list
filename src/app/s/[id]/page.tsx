import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingScreen from "@/components/pages/LoadingScreen";
import SharedLetter from "@/components/pages/SharedLetter";

export const metadata: Metadata = {
  title: "A letter to Santa",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SharedLetter />
    </Suspense>
  );
}
