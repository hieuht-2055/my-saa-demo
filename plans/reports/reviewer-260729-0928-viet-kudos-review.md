# Review: Viết Kudo compose modal

Scope: app/_kudos/{compose-*.tsx,use-kudos-compose.ts,use-compose-attachments.ts,kudos-compose-draft.ts,kudos-compose-types.ts,kudos-board-helpers.ts,use-kudos-board.ts,kudos-data.ts,kudos-sunners.ts,kudos-post-card.tsx,kudos-gallery.tsx,dialog-shell.tsx,sunner-info.tsx,kudos-feed.tsx,kudos-toast.tsx}. Read-only review, no code changed.

## Critical

### 1. Submitted kudos images render broken — `reset()` revokes blob URLs already embedded in the just-created feed post
`use-kudos-compose.ts:161-179` (`submit`) calls `onSubmit(draft)` then immediately `reset()`, synchronously, in the same tick:
```
onSubmit(draft);
reset();
```
`onSubmit` is `onComposeSubmit` (`use-kudos-board.ts:116-121`), which builds the new post via `draftToPost(draft, ...)` (`kudos-board-helpers.ts:67-88`). `draftToPost` copies the *string* blob URLs (`draft.images.map(image => image.url)`, line 78) into `KudosPost.images` and stores that post in `submitted` state — the blob objects themselves are not copied, only their URL strings.

`reset()` (`use-kudos-compose.ts:154-159`) calls `clearAttachments` → `useComposeAttachments.clear` (`use-compose-attachments.ts:79-84`):
```
urls.current.forEach(URL.revokeObjectURL);
urls.current = [];
setImages([]);
```
This revokes **every** URL ever created for the draft, unconditionally — including the ones that were just handed off to the new post a statement earlier. Because both calls happen synchronously before React commits/paints, the `<img>`/`next/image` elements in the feed (`kudos-gallery.tsx` → `GalleryImage`, using `src={image.url}` for `blob:` URLs) never get a chance to load the blob before it's invalidated. Every kudos submitted with at least one image will show broken image icons in the feed, 100% reproducible.

Fix direction (not applied — read-only review): `useComposeAttachments.clear` needs to only revoke URLs that are *not* referenced by the just-submitted draft, or attachment ownership needs to transfer to the post on submit (e.g. drop the URLs from `urls.current` before calling `onSubmit`, or clone as new object URLs owned by the feed item). This is the single most impactful bug found.

## High

### 2. Escape key on any nested popup discards the entire draft, not just that popup
`DialogShell` (`dialog-shell.tsx:69-73`) registers a `document`-level `keydown` listener when the modal opens, unconditionally calling `onClose()` on `Escape` — for `ComposeDialog` that's `onCancel`, i.e. `compose.reset(); onClose();` (`compose-dialog.tsx:41-44`). This listener is attached once, when the dialog mounts.

None of the nested popovers stop propagation on Escape:
- `ComposeRecipientPicker.onKeyDown` closes its own dropdown on Escape (`compose-recipient-picker.tsx:75-77`) but never calls `stopPropagation`.
- `useDismissableMenu` (`app/_home/use-dismissable-menu.ts:23-27`, used by hashtag + title pickers, and also duplicated on the recipient picker) closes on a *second*, independently-registered `document` `keydown` listener — also no `stopPropagation`.
- The mention popup (`compose-editor.tsx`) and the link-URL prompt (`compose-editor-toolbar.tsx`) have **no** Escape handling of their own at all.

Since DialogShell's listener is registered earlier (on dialog open) than any of the per-popup listeners (registered when the user opens that popup), and DOM listeners on the same target fire in registration order, DialogShell's handler fires *first* and unconditionally tears down the whole compose form. Concretely: user opens the recipient/hashtag/title dropdown, or types "@" to trigger a mention, or opens the link-URL prompt, presses Escape meaning "close this popup" — instead the entire Viết Kudo draft (recipient, title, content, hashtags, images) is discarded and the modal closes. This is a very reachable, high-frequency interaction (Escape is the natural way to dismiss any of these), so real-world data loss risk is high.

### 3. Mention popup (`compose-editor.tsx`) is mouse-only — no keyboard selection
`onInput` (`compose-editor.tsx:61-66`) computes `mention` state and renders a listbox (`compose-editor.tsx:118-139`), but the editable `div` has no `onKeyDown` wired for ArrowUp/ArrowDown/Enter to navigate/select a suggestion — only `onClick`/`onMouseDown` on each `<li><button>`. A keyboard-only user typing "@name" gets a visible suggestion list they cannot select from without switching to a mouse (they can still finish typing the name manually, but that's a materially different, undocumented fallback, and the dropdown is not reachable/operable per WCAG 2.1.1). Task explicitly called out checking keyboard operability of the mention popup — this is the one popup with no keyboard path at all.

## Medium

### 4. Link-URL prompt has no outside-click dismissal, inconsistent with the other 3 pickers
`linkPromptOpen` (`compose-editor-toolbar.tsx:35`) is plain local state, not wired through `useDismissableMenu` like the recipient/hashtag/title pickers. Clicking anywhere else in the dialog (that isn't the toolbar button again) leaves the prompt floating open (`z-30`, absolutely positioned) while the user keeps typing in the editor beneath it. Only re-clicking the link toolbar button toggles it shut, or confirming a link. Minor UX/consistency issue, not a crash.

### 5. Unsanitized HTML from `execCommand`/paste flows into `KudosDraft.content` / `KudosPost.content`
`ComposeEditorToolbar.confirmLink` (`compose-editor-toolbar.tsx:60-77`) calls `document.execCommand("createLink", false, url)` with no scheme validation — a `javascript:` URL is accepted as-is. Separately, the `contentEditable` div (`compose-editor.tsx:105-116`) accepts arbitrary pasted HTML (no `paste` handler intercepts/sanitizes it), which then flows through `onInput → pushChange → onChange(editor.innerHTML)` straight into `draft.content`, and from there unfiltered into `KudosPost.content` via `draftToPost` (`kudos-board-helpers.ts:76`).

Today this is *not* exploitable in the feed: `KudosPostCard` deliberately renders `htmlToText(post.content)` (`kudos-post-card.tsx:92`, `kudos-compose-draft.ts:35-48`) as a text child, never `dangerouslySetInnerHTML`, and `htmlToText`'s final regex (`/<[^>]*>/g`) strips all tags including any injected `<img onerror=...>` or `<a href="javascript:...">`. So the current render path is safe. But note `highlight-card.tsx:77` renders `{post.content}` directly (as a JSX text child, so still auto-escaped, not raw HTML — confirmed safe) from `HIGHLIGHT_KUDOS` seed data only; submitted drafts never reach the highlight carousel today (`highlightPosts` is derived from `HIGHLIGHT_KUDOS`, not `submitted`), so that path isn't reachable with user content either.

Flagging as Medium rather than Critical because there's no live sink today, but the code's own comment in `kudos-post-card.tsx:86-89` says the eventual kudos-detail screen *will* need to render the real HTML — at that point this becomes a straightforward stored-XSS vector unless that screen sanitizes (DOMPurify or similar) before any `dangerouslySetInnerHTML`. Worth a tracked follow-up now rather than discovering it when the detail screen ships.

### 6. ARIA listbox pattern misapplied across all four pickers (recipient, hashtag, title, mention)
`role="listbox"` / `role="option"` is used to wrap native `<button>` elements in `compose-recipient-picker.tsx`, `compose-hashtag-picker.tsx`, `compose-title-picker.tsx`, and the mention popup. The ARIA listbox pattern expects a single roving tab stop with arrow-key navigation and `aria-activedescendant` pointing at the active option; here every option is independently focusable via Tab, and there's no `aria-activedescendant`. This still works for a keyboard user (Tab + Enter/Space reaches every option), so it's not blocking, but a screen reader announcing "listbox, N options" while only Tab (not arrow keys) moves between them is an inconsistent experience. `ComposeRecipientPicker` at least layers real Up/Down/Enter handling (`compose-recipient-picker.tsx:64-78`) on top, closer to the intended pattern, but still lacks `aria-activedescendant` so the visually-highlighted `activeIndex` option isn't announced as active to AT.

## Low

### 7. Hidden file input has no accessible name of its own
`compose-image-picker.tsx:90-99` — the `sr-only` (not `hidden`) `<input type="file">` has `id`, `aria-describedby`, but no `aria-label` or associated `<label htmlFor>` — the visible field name lives in a `<span id={`${id}-label`}>` that only the trigger `<button aria-labelledby=...>` references. A screen-reader user who tabs directly to the (still-focusable) hidden input hears an unlabeled file control. Low impact since the visible/primary interaction path (the "+ Image" button) is correctly labeled.

### 8. Defensive-only image-count validation
`validateDraft` (`kudos-compose-draft.ts:83`) checks `draft.images.length > MAX_IMAGES`, but `intakeImages` (same file, `:107-123`) already clamps accepted files to remaining room, so this branch is unreachable through the shipped UI. Not a bug, just dead code worth a comment or removal — flagging only because it reads as if it's load-bearing.

## Verified safe / non-issues

- **Object-URL lifecycle (add/remove/unmount)**: `use-compose-attachments.ts` correctly revokes on `remove` (single URL) and on unmount (all tracked URLs via the ref, not derived from `images` state) — the *only* gap is the submit→reset race in Critical #1 above.
- **Caret-jump / controlled-vs-uncontrolled editor**: `compose-editor.tsx:47-52` writes `innerHTML` exactly once behind a `hydrated` ref guard, so React never stomps on the DOM mid-typing. Confirmed the editor fully unmounts on dialog close (`DialogShell` returns `null` when `!open`) so a later reopen re-hydrates cleanly from a fresh `content` prop — no stale-DOM/stale-state mismatch found.
- **Mention insertion / selection integrity**: `insertMention` (`compose-editor.tsx:68-87`) re-reads the live selection/caret at click time (via `textBeforeCaret()`), and the suggestion buttons use `onMouseDown={preventDefault}` to stop the editor losing focus/selection before the click fires — selection state is not stale when the replace happens.
- **Module-init cycle (`kudos-sunners.ts` ↔ `kudos-data.ts`)**: `kudos-sunners.ts` imports only `type { HeroBadge, Sunner }` from `kudos-data.ts` (erased at compile time); `kudos-data.ts` imports `RECEIVER, SENDERS` (values) from `kudos-sunners.ts`. Load order: evaluating `kudos-data.ts` first evaluates its dependency `kudos-sunners.ts`, which has no runtime dependency back on `kudos-data.ts`, so it completes cleanly before `kudos-data.ts` resumes. No TDZ/uninitialized-binding hazard.
- **React 19 hook hygiene in `use-kudos-board.ts`**: `onLoadMore`, `dismissToast`, `openCompose`, `closeCompose`, `openSecretBox`, `closeSecretBox` are all stable (empty or minimal-dep `useCallback`s); `resetCompose`/`clearAttachments` are pulled out specifically to keep `closeCompose`/`reset` stable across renders, as the comments state. `IntersectionObserver` effect deps (`hasMore`, `onLoadMore`) are both stable/primitive. Toast timer deps (`messageKey`, `onDismiss`) likewise stable. No unstable-identity-into-effect-deps bug found.
- **XSS via feed card**: confirmed no `dangerouslySetInnerHTML` anywhere under `app/_kudos/` — `htmlToText` is the only path from rich HTML to rendered text, and it correctly regex-strips all remaining tags after unwrapping block-level whitespace, including in adversarial cases like `&amp;lt;` (decoded last, per the code comment, so it can't double-decode into a live tag).
- **Required-field / ceiling rules**: `validateDraft` + `isDraftComplete` correctly encode all 4 required fields, 1–5 hashtags, and defer the 0–5 image ceiling to `intakeImages`'s partial-accept behavor (accepts what fits, refuses the rest with "max", refuses non-images with "type", type beats max when both apply) — matches the stated spec/TC behavior.
- **Anonymous toggle**: unchecking clears `anonymousName` in the same setter call (`use-kudos-compose.ts:95-103`), so a stale name can't ride along once hidden; `draftToPost` also independently guards `anonymous ? name.trim() : undefined`.

## Unresolved questions
- Is a kudos-detail screen (rendering the compose HTML with real formatting) already planned/scheduled? If so, recommend sanitizing (e.g. DOMPurify) at that render boundary before this becomes an exploitable stored-XSS path (see Medium #5).
- Product intent for Escape inside a nested popup — should it dismiss just the popup (needs `stopPropagation` added at each popup's key handler) or is "Escape always exits the whole form" acceptable? Given #2 is reachable via completely ordinary interaction (opening any dropdown and hitting Escape), recommend treating as a real bug rather than a UX preference.

**Status:** DONE_WITH_CONCERNS
**Summary:** One critical, fully-reproducible bug (submitted kudos images are broken because `reset()` revokes blob URLs already embedded in the newly-created feed post) plus a high-severity Escape-key data-loss bug and a mention-popup keyboard-accessibility gap. XSS surface is currently inert (feed always flattens HTML to text) but flagged as a forward risk given the planned detail screen. Object-URL lifecycle, editor caret handling, module-init cycle, and hook hygiene all checked out clean.
**Concerns/Blockers:** Critical #1 and High #2 both look like straightforward, scoped fixes (respectively: don't revoke URLs that were just handed to the new post; add `stopPropagation` on Escape in the nested popups) — recommend fixing both before this ships, since both are trivially reproducible in normal use, not edge cases.
