# Clarifications — Award System Screen (Hệ thống giải thưởng SAA 2025)

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
Screen: zFYDgyj_pD (fileKey 9ypp4enmFmdK3YAFJLIu6C) — "Hệ thống giải"

## Session 2026-07-27

- Q: Which route should the Award System screen live at, and reconcile home links? → A: /he-thong-giai (per test cases, authoritative); update home award-card links from /awards#slug to /he-thong-giai#slug
- Q: Should this screen be auth-gated (test ID-1 redirects unauthenticated to login), diverging from the public home? → A: Gate it — server-side getCurrentUser(); unauthenticated → redirect('/login')
- Q: How to handle the Sun* Kudos "Chi tiết" button when /kudos does not exist yet? → A: Link to /kudos as a real Link; building the Kudos page is out of scope (404s cleanly, per test ID-14)
- Q: What is the data source for award content (title/description/quantity/prize)? → A: Static, extracted from Figma design (specs show all databaseTable columns empty — no DB); no backend data source
