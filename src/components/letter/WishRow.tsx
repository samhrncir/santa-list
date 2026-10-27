"use client";

import { useState } from "react";
import type { WishInput } from "@/lib/letters";
import { toRoman } from "@/lib/roman";
import type { Wish } from "@/lib/types";
import { faviconFor, hostnameOf } from "@/lib/urls";
import WishForm from "./WishForm";

type Props = {
  wish: Wish;
  index: number;
  count: number;
  editable: boolean;
  onUpdate?: (wishId: string, input: WishInput) => Promise<boolean>;
  onRemove?: (wishId: string) => Promise<boolean>;
  onMove?: (wishId: string, delta: -1 | 1) => Promise<boolean>;
};

export default function WishRow({ wish, index, count, editable, onUpdate, onRemove, onMove }: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const numeral = `${toRoman(index + 1)}.`;

  if (editing && onUpdate) {
    return (
      <li className="wish wish-editing">
        <span className="wish-num" aria-hidden="true">{numeral}</span>
        <WishForm
          initial={{ name: wish.name, url: wish.url, note: wish.note }}
          submitLabel="Save"
          focusOnMount
          onSubmit={async (input) => {
            const ok = await onUpdate(wish.id, input);
            if (ok) setEditing(false);
            return ok;
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  const favicon = wish.url ? faviconFor(wish.url) : null;

  return (
    <li className="wish">
      <span className="wish-num" aria-hidden="true">{numeral}</span>
      <div className="wish-main">
        <span className="wish-name">{wish.name}</span>
        {wish.url && (
          <>
            <span className="leader" aria-hidden="true" />
            <a className="wish-link" href={wish.url} target="_blank" rel="noopener noreferrer nofollow">
              {favicon && (
                // eslint-disable-next-line @next/next/no-img-element -- tiny third-party favicon, not worth the optimizer
                <img
                  src={favicon}
                  alt=""
                  width={14}
                  height={14}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              {hostnameOf(wish.url)}
              <span aria-hidden="true">↗</span>
            </a>
          </>
        )}
      </div>
      {wish.note && <p className="wish-note">{wish.note}</p>}
      {editable && (
        <div className="wish-tools">
          {confirming ? (
            <>
              <span className="wish-confirm">Remove this wish?</span>
              <button
                type="button"
                className="tool-btn tool-btn-danger"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const ok = await onRemove?.(wish.id);
                  if (!ok) {
                    setBusy(false);
                    setConfirming(false);
                  }
                }}
              >
                Yes, remove
              </button>
              <button type="button" className="tool-btn" onClick={() => setConfirming(false)}>
                Keep it
              </button>
            </>
          ) : (
            <>
              <button type="button" className="tool-btn" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button
                type="button"
                className="tool-btn"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => void onMove?.(wish.id, -1)}
              >
                ▲
              </button>
              <button
                type="button"
                className="tool-btn"
                aria-label="Move down"
                disabled={index === count - 1}
                onClick={() => void onMove?.(wish.id, 1)}
              >
                ▼
              </button>
              <button type="button" className="tool-btn tool-btn-danger" onClick={() => setConfirming(true)}>
                Remove
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
