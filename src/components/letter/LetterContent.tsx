"use client";

import type { WishInput } from "@/lib/letters";
import { LIMITS, type Letter } from "@/lib/types";
import EditableText from "./EditableText";
import WaxSeal from "./WaxSeal";
import WishForm from "./WishForm";
import WishRow from "./WishRow";

export type LetterHandlers = {
  onSaveIntro: (value: string) => Promise<boolean>;
  onSaveName: (value: string) => Promise<boolean>;
  onAdd: (input: WishInput) => Promise<boolean>;
  onUpdate: (wishId: string, input: WishInput) => Promise<boolean>;
  onRemove: (wishId: string) => Promise<boolean>;
  onMove: (wishId: string, delta: -1 | 1) => Promise<boolean>;
};

type Props = { letter: Letter } & ({ editable: true; handlers: LetterHandlers } | { editable: false; handlers?: undefined });

/** The body of the letter: salutation, intro, the numbered wishes, and the signature. */
export default function LetterContent({ letter, editable, handlers }: Props) {
  const full = letter.items.length >= LIMITS.items;
  return (
    <>
      <h1 className="salutation">Dear Santa,</h1>
      <div className="letter-body">
        {editable ? (
          <EditableText
            multiline
            value={letter.intro}
            onSave={handlers.onSaveIntro}
            maxLength={LIMITS.intro}
            ariaLabel="Opening of the letter"
            className="letter-text"
            placeholder="Write a few words to Santa…"
          />
        ) : (
          letter.intro && <p className="letter-text">{letter.intro}</p>
        )}

        {letter.items.length === 0 ? (
          <p className="wishes-empty">
            {editable ? "The list is empty so far. Add the first wish below." : "Nothing on the list yet… check back soon!"}
          </p>
        ) : (
          <ol className="wishes">
            {letter.items.map((wish, index) => (
              <WishRow
                key={wish.id}
                wish={wish}
                index={index}
                count={letter.items.length}
                editable={editable}
                onUpdate={handlers?.onUpdate}
                onRemove={handlers?.onRemove}
                onMove={handlers?.onMove}
              />
            ))}
          </ol>
        )}

        {editable && (
          <div className="add-wish">
            {full ? (
              <p className="add-wish-title">The sleigh is full: {LIMITS.items} wishes is the limit for one letter.</p>
            ) : (
              <WishForm title="Add a wish to the list" submitLabel="Add to my list" onSubmit={handlers.onAdd} />
            )}
          </div>
        )}

        <p className="closing">
          <span>Love,</span>
          {editable ? (
            <EditableText
              value={letter.childName}
              onSave={handlers.onSaveName}
              maxLength={LIMITS.childName}
              ariaLabel="Your name"
              className="signature signature-input"
              placeholder="your name"
            />
          ) : (
            <span className="signature">{letter.childName}</span>
          )}
        </p>
      </div>
      <WaxSeal />
    </>
  );
}
