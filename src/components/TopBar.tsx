"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export default function TopBar({ children }: { children?: ReactNode }) {
  const { demo } = useAuth();
  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          Letters to Santa
        </Link>
        <nav className="topbar-nav" aria-label="Account">
          {children}
        </nav>
      </header>
      {demo && (
        <p className="demo-banner">Demo mode: no Google sign-in and no database. Letters live only in this browser.</p>
      )}
    </>
  );
}

export function UserMenu() {
  const { user, demo, signOut } = useAuth();
  if (!user) return null;
  return (
    <>
      <Link href="/">My letters</Link>
      {demo ? (
        <span className="topbar-name">{user.displayName}</span>
      ) : (
        user.photoURL && (
          // eslint-disable-next-line @next/next/no-img-element -- Google-hosted avatar
          <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
        )
      )}
      <button type="button" className="link-btn" onClick={() => void signOut()}>
        Sign out
      </button>
    </>
  );
}
