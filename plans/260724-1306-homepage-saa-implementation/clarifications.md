# Clarifications — Homepage SAA (route /)

Screen: Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

## Session 2026-07-24 (defaults adopted — user declined to answer, proceed autonomously)

- Q: How to wire the auth-aware header (bell/avatar/account menu, admin item)? → A: Read Supabase session server-side; logged-in shows bell/avatar + Profile/Sign out; admin = user.app_metadata.role === 'admin' adds Admin Dashboard; homepage stays public
- Q: Scope for links to non-existent pages (Awards Information, Sun* Kudos, Admin, notifications)? → A: Homepage only; links point to intended paths (/awards, /kudos, ...) which may 404; those pages are future tasks
- Q: i18n VN/EN scope? → A: Static VN (consistent with login decision); selector renders/opens but full translation deferred
- Q: Countdown event datetime source? → A: env var NEXT_PUBLIC_EVENT_DATETIME (ISO-8601); default 2025-12-31T18:30:00+07:00; invalid/missing → graceful 00:00:00 fallback
- Q: Post-login/home route? → A: Homepage is at `/` and is public (test case ID-0)
