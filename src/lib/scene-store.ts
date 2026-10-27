"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isScene, type Scene } from "./types";

const KEY = "santa:scene";
const DEFAULT_SCENE: Scene = "snow";
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Scene {
  try {
    const stored = window.localStorage.getItem(KEY);
    return isScene(stored) ? stored : DEFAULT_SCENE;
  } catch {
    return DEFAULT_SCENE;
  }
}

function getServerSnapshot(): Scene {
  return DEFAULT_SCENE;
}

/** The viewer's preferred background, remembered in this browser only. */
export function useStoredScene(): [Scene, (scene: Scene) => void] {
  const scene = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setScene = useCallback((next: Scene) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just won't be remembered.
    }
    listeners.forEach((listener) => listener());
  }, []);
  return [scene, setScene];
}
