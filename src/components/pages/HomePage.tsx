"use client";

import Footer from "@/components/Footer";
import LettersIndex from "@/components/LettersIndex";
import { LoadingLetter } from "@/components/Notice";
import SceneSwitcher from "@/components/SceneSwitcher";
import SignInCard from "@/components/SignInCard";
import TopBar, { UserMenu } from "@/components/TopBar";
import Background from "@/components/scenes/Background";
import { useAuth } from "@/lib/auth";
import { useStoredScene } from "@/lib/scene-store";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [scene, setScene] = useStoredScene();

  let body;
  if (loading) body = <LoadingLetter text="Checking the nice list…" />;
  else if (user) body = <LettersIndex user={user} scene={scene} />;
  else body = <SignInCard />;

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
      <SceneSwitcher scene={scene} onChange={setScene} />
    </>
  );
}
