"use client";

import { useEffect, useRef, useState } from "react";
import type { Letter } from "@/lib/types";

type Props = {
  open: boolean;
  letter: Letter;
  onClose: () => void;
  onToggle: (sharing: boolean) => Promise<boolean>;
  /** Moves the letter to a new link; the old one stops working. */
  onRotate: () => Promise<void>;
};

export default function ShareDialog({ open, letter, onClose, onToggle, onRotate }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [rotating, setRotating] = useState(false);
  // Only ever rendered on the client (after the letter loads), so window is safe here.
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));
  const link = `${origin}/s/${letter.id}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      linkRef.current?.select();
      document.execCommand?.("copy");
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="parchment sheet-inner">
        <h2 className="sheet-title">Share this letter</h2>
        <p className="sheet-text">
          Anyone who has the link can read {letter.childName ? `${letter.childName}'s` : "this"} letter, no sign-in
          needed. Nobody can find it without the link, and you can turn it off at any time.
        </p>

        <label className="switch">
          <input type="checkbox" checked={letter.sharing} onChange={(e) => void onToggle(e.target.checked)} />
          <span className="switch-track" aria-hidden="true" />
          <span className="switch-text">Anyone with the link can view</span>
        </label>

        <div className="link-box">
          <input
            ref={linkRef}
            readOnly
            value={link}
            disabled={!letter.sharing}
            aria-label="Private link"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button type="button" className="btn btn-paper btn-sm" onClick={copyLink} disabled={!letter.sharing}>
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="sheet-actions">
          <a className="btn btn-ghost btn-sm" href={`/s/${letter.id}`} target="_blank" rel="noopener noreferrer">
            Open the shared page
          </a>
          {confirmRotate ? (
            <span className="rotate-confirm">
              <span>The old link will stop working for everyone.</span>
              <button
                type="button"
                className="btn btn-wax btn-sm"
                disabled={rotating}
                onClick={async () => {
                  setRotating(true);
                  try {
                    await onRotate();
                  } finally {
                    setRotating(false);
                    setConfirmRotate(false);
                  }
                }}
              >
                {rotating ? "Sealing…" : "Yes, make a new link"}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmRotate(false)}>
                Keep this one
              </button>
            </span>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmRotate(true)}>
              Get a new link
            </button>
          )}
          <button type="button" className="btn btn-paper btn-sm sheet-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
}
