import type { ReactNode } from "react";

type Props = { title: string; children?: ReactNode; action?: ReactNode };

/** A small parchment card for loading, empty, and error states. */
export default function Notice({ title, children, action }: Props) {
  return (
    <div className="letter-wrap letter-wrap-sm">
      <div className="parchment notice">
        <h1>{title}</h1>
        {children && <div className="letter-body">{children}</div>}
        {action && <div className="notice-actions">{action}</div>}
      </div>
    </div>
  );
}

export function LoadingLetter({ text = "Fetching your letter from the North Pole…" }: { text?: string }) {
  return (
    <Notice title="One moment…">
      <p>{text}</p>
    </Notice>
  );
}

export function ConfigNotice() {
  return (
    <Notice title="Not quite ready">
      <p>
        This copy of Letters to Santa has no Firebase configuration yet. Copy <code>.env.example</code> to{" "}
        <code>.env.local</code>, paste in your Firebase web app settings, and restart the dev server.
      </p>
    </Notice>
  );
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button type="button" className="tool-btn" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
