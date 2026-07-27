# Plan — Homepage SAA (route /)

Screen: Homepage SAA · https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
Stack: Next.js 16.2.11 (App Router, proxy), React 19, Tailwind v4, @supabase/ssr.
Decisions: `clarifications.md` (auth header from Supabase, homepage-only links, static-VN, countdown env).

## Two-track (MoMorph)
- **Track A (UI)** — background agent. `app/page.tsx` + private `app/_home/**` (header, hero+countdown, root-further, awards grid ×6, kudos, widget, footer) + `public/home/**`. DONE_WITH_CONCERNS.
- **Track B (backend)** — `lib/supabase/proxy.ts` (`/` made public), `lib/event-config.ts` (NEXT_PUBLIC_EVENT_DATETIME), `lib/supabase/current-user.ts` (session + isAdmin from app_metadata.role).
- **Integration** — `app/page.tsx` → server component: real user/role + event ISO into `HomeScreen`; sign-out wired to `app/auth/actions.ts` server action.

## Status
- [x] Track A UI (built from MoMorph node data; tsc/lint/build clean)
- [x] Track B backend (proxy public /, event-config, current-user)
- [x] Integration + verify — tsc clean, app lint clean, `pnpm build` OK (/ dynamic, Proxy registered)

## Concerns from UI agent (for user follow-up)
- No browser tool this session → automated pixel screenshot-diff not run; values sourced directly from MCP get_node (not guessed). Recommend a visual-diff pass later.
- Countdown digit font substituted: Share Tech Mono (Figma's "Digital Numbers" not on Google Fonts).
- Event-info copy taken from real Figma (Thời gian 26/12/2025, Địa điểm Âu Cơ Art Center, livestream) — differs from earlier paraphrase; last 3 award-card descriptions are duplicated placeholders in the design itself.
- Footer has a 4th nav link "Tiêu chuẩn chung" (/standards) present in Figma.

## Deferred (per clarifications)
Awards Information / Sun* Kudos / Admin Dashboard / notification panel pages (links may 404); full VN/EN i18n; real notification data.
