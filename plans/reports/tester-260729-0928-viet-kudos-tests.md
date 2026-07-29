# Viết Kudo Unit Test Setup & Results

**Test Run:** 2026-07-29 09:48
**Stack:** Vitest 4.1.10 · Node environment · Next.js 16.2.11 · TypeScript 5

## Summary

Established minimal unit-test infrastructure for the "Viết Kudo" compose feature. Created 71 unit tests covering pure logic modules (`kudos-compose-draft.ts`, `kudos-board-helpers.ts`) against design specs. All tests pass; TypeScript clean; build passes.

---

## Files Created

### Infrastructure
- `vitest.config.ts` — minimal config resolving `@/` path alias
- Updated `package.json` — added `"test": "vitest run"` script

### Test Files (colocated)
- `app/_kudos/kudos-compose-draft.test.ts` — 42 tests
- `app/_kudos/kudos-board-helpers.test.ts` — 29 tests

---

## Test Results

### Compose Draft Module (`kudos-compose-draft.ts`)

**42 tests | 100% pass**

#### htmlToText (8 tests)
- Tag stripping (p, div, blockquote, h1-h6)
- `<br>` → newline conversion
- HTML entity decoding (`&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`, `&amp;`)
- Double-encoding safety (amp-last ordering verified)
- Empty contentEditable (`<p><br></p>`) counts as empty
- Whitespace trimming

#### contentLength (3 tests)
- Text length after HTML conversion
- Newline handling in count
- Empty HTML edge cases

#### normalizeHashtag (3 tests)
- Strip leading `#` characters
- Whitespace trim
- Already-normalized tags

#### hasHashtag (3 tests)
- Case-insensitive matching
- Returns false for missing tags
- Handles empty lists

#### validateDraft (13 tests)
- Individual field validation
  - Missing recipient (TC ID-7/50)
  - Missing title
  - Missing content (TC ID-11/51)
  - Missing hashtags (TC ID-14/52)
- All-empty draft (TC ID-56)
- Valid draft returns `{}` (TC ID-47/49)
- Content ceiling (MAX_CONTENT = 1000)
- Hashtag ceiling (MAX_HASHTAGS = 5)

#### isDraftComplete (2 tests)
- Returns true for valid draft
- Returns false for invalid draft

#### intakeImages (10 tests, spec F)
- Accept valid types (JPEG, PNG, GIF, WebP)
- Reject non-images with `error: "type"`
  - PDF (TC ID-23)
  - MP4 (TC ID-24)
  - TXT (TC ID-55)
- Truncate to remaining slots (out of 5)
- Report `error: "max"` on overflow
- Type error precedence over max error
- Partial selections kept (not batch-rejected)

---

### Board Helpers Module (`kudos-board-helpers.ts`)

**29 tests | 100% pass**

#### formatPostedAt (7 tests)
- Format: `HH:mm - MM/DD/YYYY`
- Padding for single-digit hours, minutes, months, days
- Midnight and end-of-day edge cases

#### draftToPost (11 tests, spec H.2)
- Draft → feed post mapping
  - recipient → receiverId
  - title → groupTag (trimmed)
  - images (ComposeImage[]) → images (string[])
  - hashtags preserved
  - content preserved as-is
- New post metadata
  - id: `new-{index}`
  - senderId: VIEWER.id
  - likeCount: 0
  - likedByViewer: false
  - sentByViewer: true
  - postedAt: current date/time formatted
- Anonymous handling
  - Flag carried when true
  - anonymousName trimmed and set
  - anonymousName undefined when anonymous: false
  - Empty anonymousName (blank) becomes empty string for fallback label
- Fallback to seed receiverId when recipient is null

#### matchesName (4 tests)
- Diacritic-insensitive (Dương → duong)
- Case-insensitive matching
- Partial string matching
- Non-matches return false

#### matchesFilters (3 tests)
- No filters → true
- Hashtag filter matching
- Non-existent hashtag → false

#### applyLikes (4 tests)
- Override application to specific posts
- Non-overridden posts unchanged
- Empty lists handled

---

## Code Quality Metrics

| Metric | Status |
|--------|--------|
| **Unit Tests** | 71/71 pass |
| **TypeScript** | ✓ Clean (no errors) |
| **ESLint** | ✓ Clean (0 errors, 0 warnings) |
| **Build** | ✓ Passes |
| **Test Execution** | 177ms (test 21ms + setup/import 156ms) |
| **File Sizes** | 42 KB (compose), 32 KB (board-helpers) |

---

## Coverage

### Tested
- ✓ All 4 required fields (recipient, title, content, hashtags)
- ✓ Both ceilings (content max, hashtag max, image max)
- ✓ Empty/placeholder states (contentEditable `<p><br></p>`)
- ✓ HTML sanitization & entity decoding (including double-encoding safety)
- ✓ Error paths (type rejection, overflow, missing fields)
- ✓ Image type filtering (JPEG, PNG, GIF, WebP only)
- ✓ Partial image intake (valid files kept on mixed selection)
- ✓ Draft-to-post mapping (all fields, metadata, anonymous flag)
- ✓ Timestamp formatting (spec shape `HH:mm - MM/DD/YYYY`)

### Not Tested (Out of Scope)
- React components (compose-dialog, compose-editor, etc.) — no DOM environment
- Hook state management (useKudosCompose) — behavior layer
- API calls, Supabase integration — backend only
- i18n message rendering — i18n layer
- Image upload/preview URLs — file picker integration
- Permission/auth checks — auth layer

---

## Defects Found

**None.** All pure logic modules implement specs correctly. Tests validate against design TC IDs where provided.

---

## Notes

### Test Design Decisions

1. **Node environment only** — Node 20+ supports `new File()` natively; no jsdom/DOM setup needed for pure function tests.
2. **Mock data from design** — Sunner objects, hashtags, group tags extracted from kudos-data.ts (verbatim from Figma).
3. **Colocated test files** — `*.test.ts` files next to their subjects; single file per module for clarity.
4. **TC ID callouts** — Tests reference design TC IDs where available (e.g., TC ID-56 for all-empty draft); others inferred from spec requirements.
5. **&amp; ordering verified** — htmlToText test explicitly checks that `&amp;lt;` stays as `&lt;` (not decoded to `<`); the amp-last order is defensive against double-decoding.
6. **Anonymous name blank handling** — When anonymous=true and name is blank, it trims to empty string (not undefined), allowing the card to render a translated default label.

### What's NOT Tested Here

The test scope deliberately excludes:
- UI rendering (no React component tests)
- Event handlers & state mutations (hook layer)
- Backend/API contracts (no Supabase or fetch mocks)
- Integration between compose dialog and form state
- Image file actual uploads
- Real-time filtering (matchesFilters is a pure predicate)

These belong in integration/e2e tests when the backend and React layers are complete.

---

## Verification Checklist

- [x] `pnpm test app/_kudos/` runs 71 tests → all pass
- [x] `npx tsc --noEmit` clean
- [x] `npx eslint app/_kudos/*.test.ts` clean
- [x] `pnpm build` passes
- [x] `pnpm lint` (repo-wide) unaffected by new test files
- [x] No mock cheating (all tests exercise real code paths)
- [x] No test interdependencies (each test is independent)

---

## Next Steps

1. **React component tests** — Once design signals (compose-dialog, editor toolbar) are ready, add React Testing Library tests for UI layer (form validation UI, error messages, image preview).
2. **Integration tests** — When useKudosCompose hook & Supabase integration land, add tests for form state mutations, image upload, submit flow.
3. **E2E tests** — Screen-level flow (user opens Viết Kudo → fills form → sees validation errors → submits → card appears in feed).

---

**Status:** DONE
**Summary:** Minimal test infrastructure in place. All 71 unit tests pass. Pure logic fully covered. Build and TypeScript clean.
**Concerns:** None.
