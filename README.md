# Vivek Pal — Portfolio (React + Vite + built-in admin)

Neo-brutalist developer portfolio. The site has a **Login** button (top bar) that opens an editor, so text, images,
skills, projects and experience can be changed from the browser — no code changes, no redeploy.

## How it works

- Visitors load the page and the saved content from `/api/content`.
- After logging in, the **Edit site** drawer changes everything live. **Publish** saves it for everyone.
- Content + uploaded images are stored in **Netlify Blobs** (Netlify's built-in file storage — no database to set up).
- The password is checked **on the server** (`server/api.js`). It is never in the website code, so DevTools can't show it.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173  (API is simulated locally, data goes to ./.data)
```

The local admin password is `ADMIN_PASSWORD` in `.env.local` (git-ignored).

## Going live (one time) — Netlify

1. Put the project on GitHub (`.env.local` and `.data` are git-ignored, so they stay private) and **import it in Netlify**
   (Add new site → Import from Git). Build settings come from `netlify.toml`.
   *Drag-and-drop of the `dist` folder will NOT work* — the login API needs the `netlify/functions` folder.
2. Netlify → Site configuration → **Environment variables** → add `ADMIN_PASSWORD` = a long password (12+ characters).
3. Deploy. Open your site → **Login** → enter that password → edit → **Publish**.
4. After login, open **Security → Change password**. From then on the new password is stored (salted scrypt hash) on
   the server and the env variable is no longer used.

If you forget the password: delete the `auth` entry (Netlify → Blobs → `portfolio`) and the env variable
`ADMIN_PASSWORD` becomes the password again.

## Security notes

- Login: server-side check, scrypt-hashed password, 5 wrong tries → 15-minute lock per IP.
- Session: HttpOnly + SameSite=Strict + signed cookie (JavaScript/DevTools cannot read it), 8 hours,
  every other device is signed out when the password changes.
- Every write needs the cookie, a custom header and a same-origin check (CSRF). Uploads accept only PNG/JPEG/WebP
  (checked by file signature, max 4 MB). Links from the editor are filtered (`javascript:` is blocked).
- `netlify.toml` adds strict security headers (CSP, no framing, no sniffing, HSTS). No source maps are published.
- **No website can be fully copy-proof.** Anything a browser can show can be saved by someone. What *is* protected:
  the password, the admin session, and your ability to edit. Use a watermark / lower-resolution images if a
  picture is sensitive.

## Structure

```
server/api.js            login, content, upload, change-password API (runs on Netlify + in dev)
server/devApi.js         Vite plugin that serves the API locally
netlify/functions/api.mjs  Netlify Function wrapper (stores data in Netlify Blobs)
netlify.toml             build + security headers
src/data/content.js      default content (used until you publish edits)
src/context/SiteContext  live content + admin session
src/components/admin/    login modal, status pill, editor drawer
```
