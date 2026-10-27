"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { WishInput } from "@/lib/letters";
import { LIMITS } from "@/lib/types";
import { normalizeUrl } from "@/lib/urls";

type Props = {
  initial?: WishInput;
  submitLabel: string;
  title?: string;
  focusOnMount?: boolean;
  /** Resolve true when the wish was saved; the form only resets on success. */
  onSubmit: (input: WishInput) => Promise<boolean>;
  onCancel?: () => void;
};

export default function WishForm({ initial, submitLabel, title, focusOnMount, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount) nameRef.current?.focus();
  }, [focusOnMount]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("What is the wish? Give it a name.");
      nameRef.current?.focus();
      return;
    }
    const link = normalizeUrl(url);
    if (link === null) {
      setError("That link doesn't look like a web address. Try pasting the whole link.");
      return;
    }
    setBusy(true);
    setError(null);
    const ok = await onSubmit({ name: cleanName, url: link, note: note.trim() });
    setBusy(false);
    if (ok && !initial) {
      setName("");
      setUrl("");
      setNote("");
      nameRef.current?.focus();
    }
  };

  return (
    <form className="wish-form" onSubmit={handleSubmit}>
      {title && <p className="add-wish-title">{title}</p>}
      <div className="field-grid">
        <label>
          <span className="field-label">The wish</span>
          <input
            ref={nameRef}
            className="ink-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={LIMITS.wishName}
            placeholder="A red bicycle with a bell"
          />
        </label>
        <div className="field-grid field-grid-2">
          <label>
            <span className="field-label">Link (optional)</span>
            <input
              className="ink-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              maxLength={LIMITS.url}
              placeholder="https://…"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <label>
            <span className="field-label">Note (optional)</span>
            <input
              className="ink-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={LIMITS.note}
              placeholder="size, colour, which one…"
            />
          </label>
        </div>
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" className="btn btn-wax btn-sm" disabled={busy}>
          {busy ? "Sending…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
