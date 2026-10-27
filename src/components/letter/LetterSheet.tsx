import type { ReactNode } from "react";
import Postmark from "./Postmark";
import Stamp from "./Stamp";

type Props = {
  children: ReactNode;
  /** The dateline written at the top of the letter. */
  dateText?: string;
};

/** The aged parchment sheet with its postage stamp, postmark and fold creases. */
export default function LetterSheet({ children, dateText }: Props) {
  return (
    <div className="letter-wrap">
      <div className="letter-under" aria-hidden="true" />
      <article className="letter parchment">
        <div className="letter-crease letter-crease-1" aria-hidden="true" />
        <div className="letter-crease letter-crease-2" aria-hidden="true" />
        <Stamp />
        <Postmark />
        {dateText && <p className="letter-date">{dateText}</p>}
        {children}
      </article>
    </div>
  );
}
