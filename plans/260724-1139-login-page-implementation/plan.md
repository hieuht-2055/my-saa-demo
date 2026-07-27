# Plan — Login Page (SAA 2025) with Supabase Google OAuth

Screen: Login · MoMorph https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
Stack: Next.js 16.2.11 (App Router, **middleware→proxy** breaking change), React 19, Tailwind v4, @supabase/ssr, local Supabase.
Decisions: see `clarifications.md` (scaffold-OAuth, static-VN, /todo placeholder).

## Two-track structure (MoMorph)
- **Track A (UI)** — background implementer agent, owns `app/login/**`. Presentational login screen with integration-point stubs. RUNNING.
- **Track B (backend/logic)** — this thread, owns supabase clients, proxy, auth callback, /todo. Does not block on A.
- **Integration** — after A completes, wire `signInWithGoogle` into the login-screen stub.

## Track B phases
1. **Supabase clients** — `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server, async cookies).
2. **OAuth config scaffold** — `supabase/config.toml`: enable `[auth.external.google]` from env + `skip_nonce_check`; add `/auth/callback` to redirect allow-list. `.env.local`: Google client id/secret placeholders. No secrets committed.
3. **Sign-in helper** — `lib/supabase/sign-in-with-google.ts` (client): `signInWithOAuth({provider:'google', redirectTo:/auth/callback?next=/todo})`.
4. **Auth callback** — `app/auth/callback/route.ts`: `exchangeCodeForSession(code)` → redirect `next` (/todo); on error → `/login?error=auth`.
5. **Route protection (proxy)** — `lib/supabase/proxy.ts` (session refresh + redirect rules) + root `proxy.ts`. Authed on /login → /todo; unauthed on /todo → /login.
6. **/todo placeholder** — `app/todo/page.tsx` (server, shows user email) + logout server action → `/login`.
7. **Integration** — edit `app/login/login-screen.tsx`: stub → real OAuth call + surface error `?error=auth`.

## Verify
- `pnpm lint` + `pnpm exec tsc --noEmit` clean.
- Manual: unauthed → /login shown; authed → /login redirects /todo; unauthed → /todo redirects /login; button loading + error states.
- Full Google round-trip requires user's real Google creds (documented).

## Status
- [x] Track A UI — full login screen, assets, pixel match (background agent)
- [x] Track B 1–6 — supabase clients, config scaffold, sign-in helper, callback, proxy, /todo
- [x] Integration — signInWithGoogle wired into login-screen; ?error=auth surfaced; debug code removed
- [x] Verify — `tsc` clean, app lint clean, `pnpm build` OK (/login, /auth/callback, /todo + Proxy)
- [ ] Deferred to user: swap hero asset, real Google creds, tests, i18n, real Todo feature

## Env setup (user supplies — no secrets committed)
Before `supabase start`, export in the shell (or add to .env.local, gitignored):
- SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<google oauth client id>
- SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<google oauth client secret>
Google Cloud console → Authorized redirect URI: http://127.0.0.1:54321/auth/v1/callback (Supabase auth), app callback http://localhost:3000/auth/callback.
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY already present.
