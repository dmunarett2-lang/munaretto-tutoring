# Munaretto Tutoring

Marketing site + student/admin portal for Munaretto Tutoring (ACT prep & college essays) — Dominic Munaretto, University of Notre Dame.

**Stack:** [Next.js 16](https://nextjs.org) (App Router, TypeScript). Migrated from the original single-file static `index.html` (still in git history) so that real Supabase auth can be added cleanly.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Node 24 LTS. No environment variables needed yet (they arrive with Supabase).

## Routes

| Route | What it is |
|-------|------------|
| `/` | Home — hero, services, results, about, testimonials, contact |
| `/pricing` | Rates & packages |
| `/dashboard` | Student dashboard (**placeholder-gated**, demo data) |
| `/admin` | Admin dashboard (**placeholder-gated**, demo data) |

## Deploy

Hosted on Vercel. Vercel auto-detects Next.js — no config needed. Pushes to `main` auto-deploy.

## ⚠️ Auth is a placeholder — NOT production auth (yet)

The "Log in" dropdown (student + admin) and the `/dashboard` + `/admin` route gates are a **client-side placeholder**, carried over from the original demo. They provide **no real security**:

- Demo credentials are hardcoded in the client bundle (see [`lib/auth.ts`](lib/auth.ts)).
- "Sessions" are just a value in `sessionStorage`; the route gates run in the browser, so the pages are directly reachable.
- Dashboards render hardcoded demo data ([`lib/demo-data.ts`](lib/demo-data.ts)); the contact form and "add student" don't persist.

Demo logins (placeholder only):
- **Student:** `demo@student.com` / `student123`
- **Admin:** `dominic@munarettotutoring.com` / `admin123`

**Do not treat any of this as real authentication.**

## Next milestone: Supabase auth

[`lib/auth.ts`](lib/auth.ts) is deliberately structured as the single seam where Supabase drops in:

- `checkCredentials()` → `supabase.auth.signInWithPassword()`
- `getSession()` / `setSession()` → real Supabase sessions + a `role` claim / `profiles` table
- the client-side route gates → **Next.js middleware + server-side session checks**
- demo data → Supabase (Postgres) tables with row-level security

This will need a Supabase project (URL + anon key as env vars; service-role key kept server-side only).
