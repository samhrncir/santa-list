"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export default function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        Letters to Santa
      </Link>
      <nav className="topbar-nav" aria-label="Account">
        {children}
      </nav>
    </header>
  );
}

export function UserMenu() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <>
      <Link href="/">My letters</Link>
      {user.photoURL && (
        // eslint-disable-next-line @next/next/no-img-element -- Google-hosted avatar
        <img className="avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      )}
      <button type="button" className="link-btn" onClick={() => void signOut()}>
        Sign out
      </button>
    </>
  );
}
