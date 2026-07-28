# Sun* Kudos — Live Board

**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
**Route:** `/kudos` (authenticated — enforced by `lib/supabase/proxy.ts`)
**Source:** 64 design specs + 41 test cases · SDD mode off · discipline `--auto` (user waived the interview)
**Decisions:** [clarifications.md](./clarifications.md)

## Status

| # | Phase | Owner | Status |
|---|-------|-------|--------|
| 1 | Design fetch — frame, specs, test cases, 19 assets → `public/kudos/` | orchestrator | ✅ Done |
| 2 | Data contract, icons, shared identity block, i18n VI+EN | orchestrator | ✅ Done |
| 3 | Track A — hero + HIGHLIGHT KUDOS carousel (UI) | `implementer` (bg) | ✅ Done |
| 4 | Track A — SPOTLIGHT + ALL KUDOS feed + sidebar (UI) | `implementer` (bg) | ✅ Done |
| 5 | Track B — state hook, dialogs, toast, screen composition, route | orchestrator | ✅ Done |
| 6 | Integration + live browser verification | orchestrator | ✅ Done |
| 7 | Code review + fixes | `reviewer` → orchestrator | ✅ Done (7/10, 0 critical; all High + Low fixed) |
| 8 | Commit | — | ⏸ Not committed — awaiting your go-ahead |

Tracks 3 and 4 ran concurrently with track 5 against frozen prop contracts — neither blocked the other.

## Architecture

`app/kudos/page.tsx` (server) resolves session + locale → `app/_kudos/kudos-screen.tsx` (client shell:
fonts, header/footer chrome, `LocaleProvider`) → `KudosBoard`, which calls `useKudosBoard()` and passes
plain data + callbacks down. Every section component is presentational; no business rule lives in a view.

- **Data:** `app/_kudos/kudos-data.ts` — types + mock data lifted verbatim from the design. Supabase in
  this repo is auth-only (no migrations, no `kudos` table), so this is the board's source until an API exists.
- **Behaviour:** `app/_kudos/use-kudos-board.ts` — filters, carousel cursor, hearts, clipboard + toast,
  both search fields, feed paging, both dialogs.
- **Copy:** the `kudos` i18n namespace (`lib/i18n/messages/{vi,en}/kudos.ts`, ~90 keys). No hardcoded strings.
- **Shared:** `sunner-info.tsx` (sender/receiver identity block) and `icons.tsx` (inline `currentColor` SVGs)
  are consumed by both tracks; `dialog-shell.tsx` backs both dialogs.

## Verified behaviour (live browser, 1440px, zero console errors)

- Carousel: translate −264 at index 0, −816 at index 1; arrows disable at both ends; pager 1/5 → 2/5.
- Hearts: 1.000 → 1.001 → 1.000 on toggle; 2 of 10 disabled (the viewer's own kudos, spec C.4.1).
- Copy Link → clipboard + toast "Link copied — ready to share!".
- Filters: department → empty state → clear restores; hashtag click on a card applies the filter and resets paging.
- Compose dialog: submit disabled while blank, enabled after typing, submitted kudos lands in the feed.
- Secret Box dialog, gallery lightbox, Escape-to-close, body-scroll lock and restore.
- Spotlight: accent-insensitive search narrows 126 → 23 nodes; pan/zoom toggle resets on release.
- Hero search: required message when empty, `maxLength` 100, valid query drives the Spotlight cloud.
- Layout: post card measures exactly 144→824px, matching the design render pixel for pixel. No horizontal overflow.
- Auth: unauthenticated `/kudos` → 307 → `/login`.

Gates: `tsc --noEmit` clean · `pnpm lint` zero findings in `app/` + `lib/` · `pnpm build` succeeds.

## Bugs found and fixed during integration

1. **Carousel cards rendered off-canvas.** `translateX(calc(50% - …))` resolved the percentage against the
   *track's* 2736px width, not the viewport, shifting every card 1104px right. Replaced with a
   `left-1/2` anchor plus a pixel-only X translate.
2. **Content column too narrow.** The shell inherited the home page's `max-w-[1224px]`, giving a 936px
   column; the design measures 1152px (144→1296), which is exactly `card 680 + gap 48 + sidebar 424`.
   Corrected, and the carousel was made full-bleed so its side fades reach the frame edges as drawn.
3. **Spotlight chrome unreadable.** The search pill used a 10% tint so cloud names read through it
   (design samples a solid `#1E221E`); the headline and ticker had no separation. Added an opaque pill,
   an explicit z-layer, a headline text-shadow and a bottom scrim.
4. **227px horizontal overflow at 375px.** `SunnerInfo` held a rigid `w-[235px]`, and a card renders two
   of them side by side (602px). The width now locks in only from `sm:` up; the highlight card's action
   bar wraps too. Zero overflow at 375 / 768 / 1024.
5. **Unmemoised callbacks (reviewer H1).** Six handlers were inline arrows in the hook's return object
   and fed three consumer effect dependency arrays — the feed's IntersectionObserver would re-observe
   and burst-load, the dialog's focus effect would steal focus mid-typing, and the toast timer would
   restart forever. All six are now `useCallback`-stable. Re-verified: focus stays in the textarea while
   typing, and the feed climbs 4→8→12 then stops at "Bạn đã xem hết Kudos."
6. **Peeking carousel cards were tabbable (reviewer H2).** All five slides are in the DOM; `aria-hidden`
   alone left ~47 buttons/links of the four inactive cards in the tab order (WCAG 4.1.2). Switched to
   `inert`; a 12-press Tab sweep never lands inside an inactive card.
7. **No Tab trap in the dialogs.** Added one to `dialog-shell.tsx`; a 14-press sweep never escapes.
   The gallery lightbox now also moves focus to its close button on open.
8. **Receiver column overflowed the highlight card** (reported: "Legend Hero hơi lệch"). The design pins
   both identity columns at 235px, but the highlight card's info row is only 480px wide
   (mm:I2940:13465;335:9442) — `235 + 32 icon + 235 + 2×24 gap = 502`. Figma lets the children overlap;
   flexbox pushed the receiver past the card edge, clipping the name and the badge. The send icon is now
   centred *over* the gap (absolute from `sm:` up) instead of consuming row width, matching the design's
   own overlap. Result: post-card columns land at exactly 184→419 / 549→784 (design-identical) and the
   highlight card's at 232px each, both names on one line, badges fully inside.
9. **`onToggleLike` ignored composed kudos** — the source lookup missed `submitted`, so a just-sent
   kudos could never take a heart. Also gave the composed kudos an explicit `VIEWER` sender instead of
   inheriting `ALL_KUDOS[0]`'s.

## Known gaps (need a designer/PO call, not code)

- Hero title: design renders "Hệ thống ghi nhận và cảm ơn"; spec A and test case `40d4ba26` say
  "Hệ thống ghi nhận lời cảm ơn". Design was followed — the test case needs updating.
- Spec D lists a second sidebar leaderboard ("10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT") that the design
  does not draw. Not built.
- Spec D.1 says 6 stat rows; the design draws 5. Five were built.
- `/kudos/{id}` (detail) and `/sunner/{id}` (profile) are forward-linked but live on other MoMorph frames.
- Like/heart accrual, the x2 special-day rule and Secret Box prizes are surfaced in the UI but need a
  real API to persist.
