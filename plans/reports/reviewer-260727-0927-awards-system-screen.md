# Review: Hệ thống giải thưởng SAA 2025 (/he-thong-giai)

## Scope
New: app/he-thong-giai/page.tsx, app/_awards-system/* (7 files, 572 LOC total).
Edited: app/_home/site-header.tsx, site-footer.tsx, award-card.tsx.
All files under the 200-line cap. tsc/eslint/build already verified clean by orchestrator (not rerun).

## Overall Assessment
Clean. Auth gating is sound, all 6 award cards match spec data, nav/scroll-spy guards the ID-13 edge case, home page is backward compatible. No critical or high issues.

## Auth Verification (ID-0/ID-1) — the main risk area
- `proxy.ts` matcher: `/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)` — this covers `/he-thong-giai` (not a static asset).
- `lib/supabase/proxy.ts` `PUBLIC_PATHS = ['/', '/login']` (+ `/auth/*`) — `/he-thong-giai` is NOT public, so `updateSession()` redirects unauthenticated requests to `/login` before the route renders. Confirmed: no gap. ID-1 satisfied at the proxy layer.
- `app/he-thong-giai/page.tsx` does not itself call `redirect()` — it trusts the proxy and only uses `getCurrentUser()` to populate header state (bell/avatar/admin menu). This diverges slightly from the literal clarifications.md wording ("unauthenticated → redirect('/login')") but is functionally equivalent and architecturally correct (single enforcement point, DRY — avoids duplicating the redirect check the proxy already guarantees for every non-public path).
  - **Low/informational**: no defense-in-depth fallback in the page itself. If the proxy matcher is ever edited to exclude this route by accident, there is no second gate. Given award content here is static/non-sensitive (no PII, no per-user data), the blast radius of that hypothetical regression is low. Worth a one-line note in code or docs if the team wants a belt-and-suspenders redirect, but not blocking.

## Data / Spec Correctness
- 6 award cards, correct order: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP (`awards-system-data.ts:34-115`). Matches nav item order 1:1 (`AWARD_NAV_ITEMS` derived from same array).
- Signature 2025 dual prize confirmed: `5.000.000 VNĐ` (cá nhân) / `8.000.000 VNĐ` (tập thể), rendered with "Hoặc" divider between them (`award-detail-card.tsx:89-114`).
- Slugs (`top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`, `mvp`) match 1:1 with `app/_home/awards-data.ts` slugs used for the home cards' `#slug` anchors — the `/he-thong-giai#slug` links from home will land on the right section.
- All referenced images exist in `public/awards/` and `public/home/` (checked via `find`); the signature/MVP asset swap noted in the code comment (home's `award-name-signature-creator.png`/`award-name-mvp.png` have swapped pixel content) is pre-existing and correctly worked around here by pointing to the new `public/awards/` copies instead of propagating the bug.
- **Low/unresolved**: nav label uses "Signature 2025 Creator" (no hyphen, `NAV_LABEL_OVERRIDES` in `awards-system-data.ts:123`) vs "Signature 2025 - Creator" as given in the review brief. I have no live MoMorph access to confirm which is the literal spec copy; code comment claims it matches the design exactly. Flagging so it can be checked against the actual Figma text, not a functional bug either way.

## Nav / Scroll-spy (awards-nav.tsx)
- Exactly one active item at a time (single `activeSlug` string state) — structurally guaranteed.
- ID-13 (invalid/missing section id must not throw): both the `IntersectionObserver` wiring (`sections.length === 0` guard, `.filter` for null elements) and `handleNavClick` (`if (!target) return`) handle missing DOM nodes without throwing. Confirmed no unguarded `getElementById(...)!` anywhere.
- First item defaults active before scroll, matching the "gold+underline by default" Figma note.
- `aria-current` used correctly for a11y on both `AwardsNav` and the shared `NavLink`.

## Integration (Track A/B merge)
- `AwardsSystemScreen` receives `isAuthenticated`/`isAdmin`/`userEmail` as real props from the server page — mock-data placeholders were fully replaced, no leftover TODOs or stub data.
- `SiteHeader` got a purely-additive `activeHref?: string` prop defaulting to `"/"` — `home-screen.tsx`'s existing `<SiteHeader ... />` call (no `activeHref` passed) still resolves to `"/"`, so the home page's "About SAA 2025" tab stays active. No regression.
- Header/footer nav arrays both updated consistently (`/awards` → `/he-thong-giai` nowhere lingering — grepped, none found in the new/edited files).
- Kudos "Chi tiết" → `/kudos` is a real `Link` (`app/_home/kudos-section.tsx:44`); route doesn't exist yet (404), matches the documented clarification decision (out of scope, ID-14 accepts the 404).
- `signOut()` server action unchanged, redirects to `/login` — consistent with the pattern already used on the home page.

## Findings by Severity
- Critical: none.
- High: none.
- Medium: none.
- Low:
  1. No page-level redirect fallback in `app/he-thong-giai/page.tsx` — relies solely on proxy for the auth gate (informational, not a gap given current proxy matcher config).
  2. Nav label "Signature 2025 Creator" vs brief's "Signature 2025 - Creator" — verify against literal Figma copy (no MoMorph access from this review).

## Positive Observations
- Consistent architecture with the existing home screen (server page fetches auth, client screen is presentational, same font/layout conventions).
- Good edge-case handling in the nav component for ID-13 without any agent needing to be told explicitly (comments cite the test ID directly).
- Comment in `awards-system-data.ts` proactively documents and works around a pre-existing asset-swap bug in the home page's image set rather than silently propagating it — good judgment call, correctly scoped as "out of scope to fix here."
- File sizes all comfortably under the 200-line budget.

## Unresolved Questions
1. Confirm literal Figma copy for the Signature nav label (with or without " - ") — needs MoMorph access, not verifiable from code alone.

**Status:** DONE
**Summary:** Auth gating for /he-thong-giai is correctly enforced by the proxy (route is absent from PUBLIC_PATHS, matcher covers it); no page-level redirect exists but none is needed given the proxy is the single enforcement point. All 6 award cards, order, and the Signature dual-prize copy match spec. Nav scroll-spy handles the missing-section-id edge case (ID-13) without throwing. Home page and shared header/footer changes are backward compatible (activeHref defaults to "/"). No critical/high/medium issues found.
**Concerns/Blockers:** None blocking. Two low-severity/informational notes above (defense-in-depth gate, nav label hyphen) — neither requires a code change before ship.
