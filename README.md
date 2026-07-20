# Munaretto Tutoring

Marketing site for Munaretto Tutoring (ACT prep & college essays) — Dominic Munaretto, University of Notre Dame.

Currently a **single-file static site**: everything lives in [`index.html`](index.html) (HTML, CSS, and vanilla JS inline). No build step, no dependencies. Vercel serves it as a static site.

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Hosted on Vercel as a static site (no framework, no build command). Pushes to `main` auto-deploy.

## ⚠️ Auth is a front-end demo only — NOT production auth

The "Log in" dropdown (student + admin) is a **UI mockup with hardcoded credentials in client-side JavaScript**. It provides **no real security**:

- Credentials are visible to anyone who views source (`ADMIN_CREDS`, student passwords `student123` / `password`).
- "Login" just toggles which `<div class="view">` is shown — no session, no server, no access control.
- The student/admin dashboards render **hardcoded demo data**; the contact form and "add student" only persist to an in-browser storage shim that doesn't exist off-platform.

**Do not treat any of this as real authentication.** Real auth is the next milestone (see below).

## Next milestone: Supabase auth

Planned: replace the demo login with **Supabase Auth** for real student and admin logins (email/password, with an admin role). This will introduce real sessions, server-side access control, and persistent data (students, consult requests) in Supabase instead of the current in-memory/demo data.

See open decision in the repo notes about whether to migrate off the single HTML file into a framework (e.g. Next.js) as part of that work.
