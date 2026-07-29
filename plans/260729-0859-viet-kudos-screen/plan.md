# Viết Kudo — compose modal (mm:520:11602)

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
fileKey `9ypp4enmFmdK3YAFJLIu6C` · screenId `ihQ26W78P2` · 26 specs, 57 test cases, all `spec_status: done`.

Discipline: `--auto` (user: "đừng hỏi gì nhiều… để các agent tự quyết định"). SDD mode `off` → no spec stage.
No clarification questions were asked; every gap below was decided by default and recorded here instead.

## Shape

`app/_kudos/compose-dialog.tsx` already existed as an explicit placeholder for *this* frame
("the dialog itself is drawn on another frame"). This screen replaces it with the real design.

Two tracks, run concurrently, no blocking merge point:

| Track | Owner | Scope | Status |
|---|---|---|---|
| A — UI | background `implementer` + `momorph-implement-design` | the modal and its sub-components, new icons, `kudos` i18n keys | completed |
| B — behaviour | orchestrator (main thread) | draft state, validation, Sunner lookup, attachments, board wiring | completed |
| Integration | orchestrator | contract reconciliation, anonymous feed rendering, typecheck/lint | completed |

The seam between them is `app/_kudos/kudos-compose-types.ts` (`KudosComposeApi`), written before either
track started: the dialog is presentational and holds no draft state, the hook holds no markup.

## Files

Track B (behaviour + integration):
- `kudos-compose-types.ts` — the contract: `KudosDraft`, `ComposeErrors`, `KudosComposeApi`, the four limits.
- `kudos-compose-draft.ts` — pure rules: `validateDraft`, `htmlToText`, `intakeImages`, hashtag normalising.
- `use-kudos-compose.ts` — the hook implementing `KudosComposeApi`.
- `use-kudos-board.ts` — `onComposeSubmit(draft)`, owns the `compose` instance, "Hủy" discards the draft.
- `kudos-data.ts` — `SUNNER_DIRECTORY` (searchable population), `KudosPost.anonymous` / `.anonymousName`.
- `sunner-info.tsx` — `AnonymousSunnerInfo`, the sender column for an anonymous kudos.
- `kudos-post-card.tsx` — anonymous sender, rich text flattened for the card.
- `kudos-gallery.tsx` — `blob:` previews bypass `next/image`.
- `kudos-screen.tsx` — passes `compose` to the dialog.

## Spec gap found in the design (not in the 26 specs)

`mm:1688:10448` — **"Danh hiệu"** is a required field (drawn with a `*`) that carries no `mms_`
prefix, so it appears in neither the 26-row spec CSV nor the 57 test cases. Its own helper text
says what it is for: *"Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn"* — the chosen title becomes
the Kudos heading, which on a card is the centred group-tag strip the feed already renders.

Implemented rather than dropped: a required select over the design's own `GROUP_TAGS`, mapped to
`KudosPost.groupTag` in `draftToPost`. Left out, a composed kudos would silently inherit a seed
post's title.

## Review Outcomes

**Critical** — blob URLs revoked on submit, breaking images on just-sent feed posts: **fixed before review**. `useComposeAttachments` separates `clear()` (discard → revoke) from `detach()` (submit → hand ownership).

**High** — Escape inside nested dropdown/mention/link bubbled to modal's document handler, discarding entire draft: **fixed after review**. `use-dismissable-menu` captures Escape; mention popup + link prompt stop it locally. Mention gained full keyboard nav (↑↓/Enter/Tab/Esc) → moved to `compose-mention-popup.tsx`.

**Deferred:** link-prompt no outside-click dismiss (Esc/Confirm work); ARIA `aria-activedescendant` not wired across pickers; editor HTML unsanitized but inert (feed flattens via `htmlToText`; sanitize before detail-screen ships); no live browser visual-diff (Supabase auth required, no automation; fidelity via MoMorph + reference-PNG).

**Unbuilt:** toolbar's "Tiêu chuẩn cộng đồng" link (no destination in design).

## Decisions taken without asking

- **Rich text**: `contentEditable` + `document.execCommand`, no new dependency. The repo ships no editor
  library and spec C needs only six formats.
- **Content ceiling**: 1000 characters. Spec D.1 names a counter but the design shows no number.
- **Accepted image types**: jpeg / png / gif / webp (TC ID-21..24, ID-55 only pin "images, not pdf/mp4/txt").
- **Recipient population**: the Spotlight cloud's names, promoted to Sunners. No invented people.
- **Self-kudos**: the viewer is filtered out of both lookups. Not specified; a kudos is for a teammate.
- **Anonymous card state**: undesigned — the placeholder mark uses board tokens, hides avatar,
  department, badge and profile link. Empty name falls back to a translated label, so no UI copy is stored.
- **Feed rendering of rich text**: flattened to plain text. The card is drawn as clamped plain text, and
  this keeps `dangerouslySetInnerHTML` out of the feed until a detail screen needs sanitised HTML.
- **Submit**: local, into the board's `submitted` list — there is no `kudos` table in Supabase (auth-only
  project). `submitting` and the try/catch in `submit()` are the seam a real API call drops into.

## Verification

- `npx tsc --noEmit` clean · `npx eslint app lib` clean · `pnpm build` passes.
- `pnpm test` → **71 tests / 7 files passing** (Vitest scoped to `app/**` + `lib/**` via `vitest.config.ts`; `.claude/**` agent kit tests incompatible with Vitest).
- vi/en i18n: 108 keys each, no orphans.
- No file over 200 lines.
