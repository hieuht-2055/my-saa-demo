# Review — Sun* Kudos Live Board (`/kudos`)

Scope: all 27 files under `app/_kudos/`, `app/kudos/page.tsx`, `lib/i18n/messages/{vi,en}/kudos.ts`,
`lib/i18n/messages/index.ts`, `app/_home/site-footer.tsx` diff. ~2440 LOC.
tsc/lint/build already verified clean by the orchestrator (not re-checked here); this pass is
logic/security/a11y/convention only, per the brief.

Note: `use-kudos-board.ts` was mid-refactor when this review started (state moved out into
`kudos-board-helpers.ts` + `use-sunner-search.ts`, file dropped from 249→160 lines). All findings
below are against the file contents as they stand on disk now, re-verified after the refactor
settled.

**Score: 7/10. Critical issues: 0.**

## High Priority

### H1 — Unmemoized callbacks in `use-kudos-board.ts` thrash three different consumer effects

`use-kudos-board.ts:144,149,152-153,156-157` return fresh arrow-function closures on every render
for `feed.onLoadMore`, `toast.dismiss`, `dialogs.openCompose/closeCompose/openSecretBox/closeSecretBox`
— unlike every other callback in the file (`onToggleLike`, `onCopyLink`, `onHashtagChange`, etc.),
which are correctly wrapped in `useCallback`. Three consumers key an effect off exactly these
unstable references:

1. **`kudos-feed.tsx:33-46`** — the infinite-scroll `IntersectionObserver` effect depends on
   `[hasMore, onLoadMore]`. Any board re-render while a dialog isn't even open — a like toggle,
   a filter change, the toast timer firing — recreates `onLoadMore`, so the effect tears down and
   rebuilds the observer. `IntersectionObserver.observe()` fires an initial callback reflecting the
   target's *current* intersection state, so if the sentinel is already inside the 200px root
   margin when this happens (e.g. user is scrolled near the bottom and hearts a post), `onLoadMore`
   fires again immediately — which changes `visibleCount`, which re-renders the board, which
   recreates the observer again, etc. Net effect: instead of the specified "4 cards per scroll
   step" (spec C.2), the feed can burst-load everything remaining in one uncontrolled cascade the
   moment any unrelated board state changes while the sentinel is in view. This is inherently flaky
   — it depends on card height vs. viewport — which makes it easy to miss in a quick smoke test.
2. **`dialog-shell.tsx:28-51`** — the focus-trap/scroll-lock effect depends on `[open, onClose]`.
   While Compose or Secret Box is open, any board re-render (e.g. the toast auto-dismiss timer
   completing from an earlier "Link copied" toast) recreates `onClose`, re-running the effect:
   cleanup calls `restoreFocusTo.current?.focus()` (jumping focus back to the trigger button behind
   the modal), then the fresh effect body immediately re-captures `document.activeElement` and
   refocuses the panel's first control. Concretely: open Compose, start typing in the textarea, let
   a stray toast from a prior action time out — focus visibly jerks away from the field the user is
   typing in.
3. **`kudos-toast.tsx:26-30`** — the auto-dismiss effect depends on `[messageKey, onDismiss]`. A new
   `dismiss` reference on every board render restarts the 3s `setTimeout`, so continued interaction
   elsewhere (typing in the hero search box, toggling a filter) while a toast is showing prevents it
   from ever reaching its documented 3-second auto-dismiss.

**Fix:** wrap those six closures in `useCallback` with empty deps (they only call a stable
`setState` setter), matching the pattern already used for `onToggleLike`/`resetPaging`/etc.

### H2 — Inactive Highlight Carousel cards are `aria-hidden` but keep their interactive children in the tab order

`highlight-card.tsx:36-40` marks the non-active card `aria-hidden={!active}` and dims it via
`pointer-events-none scale-95 opacity-50`, but that only blocks *mouse* interaction —
`aria-hidden` on a container does not remove its descendant `<button>`/`<Link>` elements
(heart toggle, copy-link, "Xem chi tiết") from the keyboard tab order. All 5 highlight cards render
simultaneously in `highlight-carousel.tsx:78-80` (only translated off-screen via the track
transform), so a keyboard user tabbing through the page lands on invisible/dimmed inactive cards'
controls — a WCAG 4.1.2 violation ("hidden but focusable"), and screen readers get an inconsistent
tree (hidden from the AT tree, still reachable by keyboard).

**Fix:** when `!active`, either add `tabIndex={-1}` to each interactive descendant, or (simpler)
put the modern `inert` attribute on the card's outer div alongside `aria-hidden` — `inert` removes
the whole subtree from the tab order and is supported by React 19 / current browsers.

## Medium Priority

### M1 — Composed kudos always attributed to a hardcoded sender, not the logged-in viewer

`use-kudos-board.ts:109-127` builds every submitted post by spreading `ALL_KUDOS[0]`, so
`senderId` is always `"s1"` ("Huỳnh Dương Xuân Nhật", `new-hero` badge) — the same fixed identity
for every user who composes a kudos, unrelated to the actual authenticated account
(`isAuthenticated`/`userEmail` passed into `KudosScreen` are never consulted for this). Understood
as a mock-data limitation (no `kudos`/Sunner-profile table yet, per `clarifications.md`), but unlike
the file's other documented scope decisions this one isn't called out anywhere — it reads as an
oversight rather than an intentional stub. Recommend at minimum a code comment flagging it as a
known gap to close when the real API lands, since visually it will look like every "Của tôi" kudos
came from one specific coworker regardless of who is logged in.

### M2 — `DialogShell` has no Tab focus trap

`dialog-shell.tsx:28-51` handles Escape-to-close and moves initial focus into the panel, but does
not intercept Tab/Shift+Tab. Background page content is not marked `inert`/`aria-hidden` while the
dialog is open, so a keyboard user can Tab straight out of the Compose/Secret Box modal into the
header, footer, or feed behind the (visually opaque but DOM-present) backdrop. There's no existing
modal convention elsewhere in the codebase to conform to (checked `app/_home`, `app/_awards-system`
— no prior `role="dialog"` component), so this is a gap to close now rather than a regression
against house style.

**Fix:** add a `keydown` handler for `Tab` that cycles between the first/last focusable elements in
`panelRef.current`, or set `inert` on the app shell's other top-level landmarks while `open`.

## Low / Suggestion

- **`use-kudos-board.ts:75`** — `onToggleLike`'s source lookup is
  `[...HIGHLIGHT_KUDOS, ...ALL_KUDOS].find(...)`, which excludes `submitted` (composed) posts. Today
  this is masked because every composed post is `sentByViewer: true` and the heart button is
  already `disabled` for those cards (`kudos-post-card.tsx:101`, `highlight-card.tsx:98`), so the
  handler can't currently be invoked for a composed post's id — but the correctness relies on that
  coincidence rather than the lookup being complete. Worth including `submitted` in the search array
  so the guard is correct by construction, not by accident.
- **`kudos-hero.tsx:88` / `spotlight-search.tsx:25`** — both search inputs already cap length at the
  DOM level (`maxLength={100}`) *and* re-check `value.length > SEARCH_MAX` in the change handler.
  Harmless, but the manual check is effectively dead code under normal typing/paste; fine to leave,
  just noting it's redundant belt-and-suspenders rather than load-bearing.
- **`kudos-gallery.tsx:65-93`** — the image lightbox is `role="dialog" aria-modal="true"` but (unlike
  `DialogShell`) doesn't move focus onto its own Close button when it opens; Escape and backdrop
  click both work, and focus does correctly return to the originating thumbnail on close, so this is
  a minor inconsistency rather than a broken flow.
- Unused i18n keys in `lib/i18n/messages/{vi,en}/kudos.ts`: `spotlight.zoomIn`, `spotlight.zoomOut`,
  `spotlight.loading`, `search.noResult`, `filter.all` — none are referenced anywhere in
  `app/_kudos/`. Dead translation strings; fine to drop or leave for a near-future feature, not
  urgent either way.

## Positive Observations

- `use-kudos-board.ts` / `kudos-board-helpers.ts` / `use-sunner-search.ts` split is a clean example
  of the "pull business logic into its own module" rule — every presentational component genuinely
  stays free of state/business rules.
- Deterministic seeded layout for `SPOTLIGHT_NODES` (`kudos-data.ts`) deliberately avoids
  `Math.random()` to keep SSR/CSR hydration in sync — correct call, explicitly commented.
- `onCopyLink`'s clipboard write is wrapped in try/catch with a distinct failure toast
  (`toast.copyFailed`) rather than swallowing the rejection — good defensive handling of a genuinely
  fallible browser API.
- No `dangerouslySetInnerHTML` anywhere; user-authored compose content renders through normal JSX
  text interpolation (auto-escaped) — no injection surface from the one piece of real user input on
  this screen.
- All `/kudos/{id}` and `/sunner/{id}` links are same-origin `next/link` — no unvalidated external
  URLs, so the "missing `rel` on external links" class of issue doesn't apply here.
- Every file in scope is under the 200-line rule (largest is `kudos-screen.tsx` at 198, `kudos-data.ts` at 194).

## Edge Cases Found

Covered above (H1's cascading-load / focus-yank / stuck-toast scenarios, H2's tab-order leak). No
additional edge cases beyond what's already listed.

## Metrics

- Type Coverage: not independently re-measured (orchestrator reports `tsc --noEmit` clean).
- Test Coverage: no unit tests exist for `app/_kudos/*` (none were requested in scope).
- Linting Issues: 0 in `app/` / `lib/` per orchestrator's prior run (not re-run here).

## Recommended Actions

1. Wrap the six unmemoized closures in `use-kudos-board.ts` (H1) in `useCallback` — highest
   leverage fix, resolves three separate consumer bugs at the root.
2. Add `inert`/`tabIndex={-1}` to inactive Highlight cards (H2) — WCAG 4.1.2 fix.
3. Decide whether M1 (hardcoded compose sender) is acceptable as-is for this mock-data phase or
   needs a "known limitation" comment; either is fine, silence is the only wrong answer.
4. Add Tab-trapping to `DialogShell` (M2) before this modal pattern gets reused elsewhere in the
   site — cheaper to fix once here than after a second dialog copies it.

## Unresolved Questions

- None blocking. M1's disposition (fix now vs. document as a known mock-data limitation) is a
  product call, not something this review can settle unilaterally.

**Status:** DONE_WITH_CONCERNS
**Summary:** No criticals. One High-severity root cause (six unmemoized callbacks in `use-kudos-board.ts`) cascades into three separate consumer bugs — feed over-loads past its 4-per-step spec, dialog focus gets yanked mid-typing, and toasts can outlive their 3s auto-dismiss. One High a11y gap (inactive carousel cards keep focusable descendants despite `aria-hidden`). Two Medium items (hardcoded compose-sender identity; no Tab focus-trap in the shared dialog shell). Rest is Low/style.
**Concerns/Blockers:** H1 and H2 are worth fixing before this ships, since they're reproducible under normal use (not contrived edge cases) and H1 in particular touches three files at once. Everything else can land as follow-up.
