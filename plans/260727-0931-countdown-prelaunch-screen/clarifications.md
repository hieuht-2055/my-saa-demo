# Clarifications — Countdown Prelaunch Screen

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
Screen: 8PJQswPZmU (fileKey 9ypp4enmFmdK3YAFJLIu6C) — "Countdown - Prelaunch page"

User directive: "đừng hỏi gì nhiều" — decided with sensible defaults, no blocking questions.

## Session 2026-07-27

- Q: Route/URL for the prelaunch screen? → A: /prelaunch (standalone full-screen page)
- Q: Source of the countdown target datetime (spec marks API endpoint as TODO)? → A: Reuse existing lib/event-config.ts (NEXT_PUBLIC_EVENT_DATETIME env); no new API (YAGNI — spec API is a TODO)
- Q: How to implement the spec's "lock navigation until countdown reaches 0"? → A: Page-scoped — while counting down the page is a dead-end (no nav chrome); at 0 (event started) show a CTA into the site. NO destructive global route-hijack gate (avoids reshaping existing working pages)
- Q: Access control for /prelaunch (test cases leave it "unspecified / as per app configuration")? → A: Make /prelaunch PUBLIC in the proxy (coming-soon semantics; reachable pre-auth), satisfies access test 68d82c58 + e6a59553
- Q: Timezone / digit ranges? → A: UTC+7 per spec; per-unit range validation (Days 0–99, Hours 0–23, Minutes 0–59; out of range → "00") per test f98adad8 / 724e6e17
