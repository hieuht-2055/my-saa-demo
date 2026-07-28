# Clarifications — Sun* Kudos Live Board

MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
fileKey `9ypp4enmFmdK3YAFJLIu6C` · screenId `MaZUn5xHXZ` · 64 specs · 41 test cases

The user explicitly waived the clarification interview ("đừng hỏi gì nhiều… để các agent
tự quyết định"). Every gap below was therefore resolved by the orchestrator and is recorded
here rather than asked. Each answer is the decision that was implemented.

## Session 2026-07-28

- Q: Where does the board's data come from — Supabase or mock data? → A: Mock data in `app/_kudos/kudos-data.ts`; Supabase in this repo is auth-only (no migrations, no `kudos` table), so the same pattern as `app/_home/awards-data.ts` applies until an API exists.
- Q: Hero title — specs say "Hệ thống ghi nhận lời cảm ơn", the rendered design says "Hệ thống ghi nhận và cảm ơn". Which wins? → A: The design. MoMorph visual data is authoritative over the spec prose; test case 40d4ba26 quotes the spec wording and will need updating.
- Q: Department label — spec item name says "CECV2", the design text says "CEVC10". → A: "CEVC10" (design content).
- Q: Sidebar — spec D lists two leaderboards ("10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT" and "10 SUNNER NHẬN QUÀ MỚI NHẤT"); the design draws only the gift list. → A: Ship only the gift list that is drawn. The promotion list is a spec-vs-design gap to confirm with the designer.
- Q: Sidebar stats — spec D.1 says 6 rows, the design draws 5. → A: 5 rows as drawn (received / sent / hearts / opened / unopened).
- Q: The compose dialog (A.1) and Secret Box dialog (D.1.8) are specified as behaviour but drawn on other frames. Build or stub? → A: Build both for real, minimally, from this screen's own tokens — test cases f183a3e4 and 43b54c29 require the observable behaviour (empty message ⇒ submit disabled; button opens the box dialog). No invented artwork.
- Q: "Xem chi tiết" and profile links target `/kudos/{id}` and `/sunner/{id}`, neither of which exists. → A: Forward-link them anyway, exactly as the site header forward-linked `/kudos` before this screen existed. Those screens are separate MoMorph frames and out of scope.
- Q: What does the hero's "Tìm kiếm profile Sunner" field search, given the board shows no profile list? → A: It drives the Spotlight word cloud (the only Sunner-name surface on the screen) and scrolls it into view. Validation per spec B.7.3: required, max 100 characters.
- Q: Is `/kudos` public or authenticated? → A: Authenticated. `/kudos` is absent from `PUBLIC_PATHS` in `lib/supabase/proxy.ts`, so an unauthenticated request already redirects to `/login` — which is what test case 71b3ef43 asks for. No proxy change needed.
- Q: Heart behaviour — how are the like rules enforced without a backend? → A: Client state in `use-kudos-board.ts`: one heart per user per kudos, the heart disabled on the viewer's own kudos (spec C.4.1), and un-hearting reverses the count. The x2 special-day multiplier is surfaced as the sidebar chip; awarding it belongs to the API.
- Q: Feed paging — infinite scroll or pagination? → A: Infinite scroll via `IntersectionObserver` over the mock list, 4 cards per step, per spec C.
- Q: Spotlight cloud positions — random or fixed? → A: Deterministic seeded layout in `kudos-data.ts`; `Math.random()` would desynchronise the server and client renders and break hydration.
- Q: The "New Hero" rank badge has no exported Figma asset (media URL is null, node export 500s). → A: Extracted from the frame render at 1:1 and normalised to 110×20 to match the three exported badges.
- Q: How is the work split? → A: Two background `implementer` agents on the UI (hero + highlight carousel; spotlight + feed + sidebar) against frozen prop contracts, with the orchestrator owning the data, i18n, state hook, dialogs, toast, screen composition and route.
