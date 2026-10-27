"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

type Props = {
  value: string;
  onSave: (value: string) => Promise<unknown> | void;
  maxLength: number;
  ariaLabel: string;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
};

/**
 * Looks like ink on the page but is really an input. Saves on a short pause
 * in typing and on blur; keeps the local draft when a remote update arrives mid-edit.
 */
export default function EditableText({ value, onSave, maxLength, ariaLabel, multiline, className, placeholder }: Props) {
  const [draft, setDraft] = useState(value);
  const [dirty, setDirty] = useState(false);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    if (!dirty) setDraft(value);
  }

  const timer = useRef<number | null>(null);
  const latest = useRef({ draft, value, dirty, onSave });
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    latest.current = { draft, value, dirty, onSave };
  });

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, multiline]);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const commit = useCallback((trim: boolean) => {
    clearTimer();
    const current = latest.current;
    if (!current.dirty) return;
    const next = trim ? current.draft.trim() : current.draft;
    setDirty(false);
    if (trim && next !== current.draft) setDraft(next);
    if (next !== current.value) void current.onSave(next);
  }, []);

  // Flush an unsaved draft if the component goes away mid-edit.
  useEffect(
    () => () => {
      clearTimer();
      const current = latest.current;
      if (current.dirty && current.draft.trim() !== current.value) void current.onSave(current.draft.trim());
    },
    [],
  );

  const handleChange = (next: string) => {
    setDraft(next);
    setDirty(true);
    clearTimer();
    timer.current = window.setTimeout(() => commit(false), 900);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !multiline) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  if (multiline) {
    return (
      <textarea
        ref={areaRef}
        className={`ink-textarea inline-edit ${className ?? ""}`}
        value={draft}
        rows={2}
        maxLength={maxLength}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => commit(true)}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <input
      className={`ink-input inline-edit ${className ?? ""}`}
      value={draft}
      maxLength={maxLength}
      aria-label={ariaLabel}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={() => commit(true)}
      onKeyDown={handleKeyDown}
    />
  );
}
