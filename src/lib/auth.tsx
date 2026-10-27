"use client";

import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEMO_USER, demoSession } from "./demo-session";
import { firebaseAuth, googleProvider } from "./firebase";
import { isDemo } from "./mode";
import type { AppUser } from "./types";

type AuthContextValue = {
  user: AppUser | null;
  /** True until the initial sign-in state is known. */
  loading: boolean;
  /** True when a pretend account stands in for Google sign-in. */
  demo: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toAppUser(user: User): AppUser {
  return { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL };
}

function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth(), (next) => {
        setUser(next ? toAppUser(next) : null);
        setLoading(false);
      }),
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      demo: false,
      signIn: async () => {
        await signInWithPopup(firebaseAuth(), googleProvider());
      },
      signOut: async () => {
        await firebaseSignOut(firebaseAuth());
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function DemoAuthProvider({ children }: { children: ReactNode }) {
  const signedIn = useSyncExternalStore(demoSession.subscribe, demoSession.getSnapshot, demoSession.getServerSnapshot);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: signedIn ? DEMO_USER : null,
      loading: false,
      demo: true,
      signIn: async () => demoSession.setSignedIn(true),
      signOut: async () => demoSession.setSignedIn(false),
    }),
    [signedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return isDemo ? <DemoAuthProvider>{children}</DemoAuthProvider> : <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
