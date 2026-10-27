# Letters to Santa

An old-fashioned letter to Santa, on the web. Sign in with Google, write a letter for each child, add wishes with links and notes, and share the letter with family through a private link, the way a Google Photos album is shared: anyone who has the link can read it, nobody can find it without one, and you can switch it off or get a new link at any time.

Live at **https://santa.mappa.systems**.

The backdrop can be switched between Santa's desk, falling snow that reacts to the mouse, and a child's kitchen table. Readers of a shared letter can pick their own.

## How it works

- **Next.js 16** (App Router, Cache Components) with **Tailwind CSS v4**, deployed on **Vercel**.
- **Firebase Authentication** (Google sign-in) and **Cloud Firestore**. Everything talks to Firebase from the browser; the app has no server-side secrets.
- One Firestore document per letter in `letters/{id}`. The id is a 22-character random string (about 131 bits of entropy), so it doubles as the private-link secret.
- `firestore.rules` enforce the model: owners can do anything with their own letters; anyone can **get** a letter by id while its `sharing` flag is true; nobody can list letters they don't own.
- "Get a new link" copies the letter to a fresh id and deletes the old document, so every copy of the old link stops working.

## Running it locally

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the Firebase web-app config (Firebase console → Project settings → Your apps → SDK setup).
3. `npm run dev`, then open http://localhost:3000

Other scripts: `npm test` (unit tests with vitest), `npm run lint`, `npm run typecheck`, `npm run build`.

## Setting up Firebase from scratch

1. Create a project at https://console.firebase.google.com and add a **Web** app. Put its config in `.env.local` (and in Vercel's environment variables for deployments).
2. **Authentication → Sign-in method → Google → Enable.** Under **Authentication → Settings → Authorized domains**, add every host the app is served from (for example `santa.mappa.systems` and the project's `*.vercel.app` host). `localhost` is allowed by default.
3. **Firestore Database → Create database** (production mode, any location).
4. Deploy the security rules:

   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project <your-project-id>
   ```

   `.firebaserc` names the project this repository was built against; pass `--project` or edit it for your own.

## Deploying on Vercel

Import the GitHub repository in Vercel, add the six `NEXT_PUBLIC_FIREBASE_*` variables, and add your domain under **Settings → Domains** (a `CNAME` pointing at `cname.vercel-dns.com`, or Vercel's `A` record for an apex domain). Every push to `main` deploys.

## Project layout

| Path | What lives there |
| --- | --- |
| `src/app/` | Routes: `/` (sign in or your letters), `/l/[id]` (edit a letter), `/s/[id]` (read a shared letter) |
| `src/components/letter/` | The parchment sheet, postmark, stamp, wax seal, wish rows and forms |
| `src/components/scenes/` | The three backdrops, including the pointer-reactive snow canvas |
| `src/components/pages/` | The client-side page bodies behind each route |
| `src/lib/` | Firebase setup, auth context, Firestore operations, id/url/date helpers and their tests |
| `firestore.rules` | Security rules (see "How it works") |

## License

MIT, see `LICENSE`.
