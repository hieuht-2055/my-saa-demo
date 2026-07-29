// mm:520:11602 (Viết Kudo) — the compose modal's contract between its UI layer
// (compose-dialog.tsx + its sub-components) and its behaviour layer
// (use-kudos-compose.ts). The dialog is presentational: it renders this API and
// calls back into it, holding no form state of its own.

import type { Sunner } from "./kudos-data";

/** An attachment held in the draft. `url` is an object URL for preview only. */
export interface ComposeImage {
  id: string;
  url: string;
  name: string;
}

export interface KudosDraft {
  /** Spec B — required, chosen from the Sunner directory via autocomplete. */
  recipient: Sunner | null;
  /**
   * "Danh hiệu" — required. Carries no `mms_` spec row (mm:1688:10448 is the only
   * field on the frame without one), but the design draws it with a `*` and its
   * own helper text: "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn". That makes
   * it the post's `groupTag`, the centred strip the feed card already renders.
   */
  title: string;
  /** Spec D — rich-text HTML produced by the C toolbar. Required. */
  content: string;
  /** Spec E — 1..MAX_HASHTAGS, without the leading "#". Required. */
  hashtags: string[];
  /** Spec F — 0..MAX_IMAGES. Optional. */
  images: ComposeImage[];
  /** Spec G — send anonymously. */
  anonymous: boolean;
  /** Spec G — display name used when `anonymous` is on. */
  anonymousName: string;
}

/**
 * Per-field validation state. Values are i18n keys under the `kudos` namespace's
 * `compose.errors` group, so the UI never spells an error message itself.
 */
export interface ComposeErrors {
  recipient?: "required";
  title?: "required";
  content?: "required" | "max";
  hashtags?: "required" | "max";
  images?: "max" | "type";
}

/** Spec E — "Tối đa 5". */
export const MAX_HASHTAGS = 5;
/** Spec F — "Tối đa 5"; at 5 the "+ Image" button is hidden, not disabled. */
export const MAX_IMAGES = 5;
/** Spec D.1 — the character counter under the editor. */
export const MAX_CONTENT = 1000;
/** Spec F / TC ID-21..24, ID-55 — only images are accepted. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

/**
 * What `useKudosCompose` hands the dialog. Every mutation is a callback here —
 * the dialog owns no `useState` for form data.
 */
export interface KudosComposeApi {
  draft: KudosDraft;
  /** Populated on submit attempt, and cleared per-field as the user fixes it. */
  errors: ComposeErrors;
  /** False while any required field is unfilled — drives the "Gửi" disabled state. */
  canSubmit: boolean;
  submitting: boolean;

  setRecipient: (sunner: Sunner | null) => void;
  setTitle: (title: string) => void;
  setContent: (html: string) => void;
  setAnonymous: (value: boolean) => void;
  setAnonymousName: (value: string) => void;

  addHashtag: (tag: string) => void;
  removeHashtag: (tag: string) => void;

  /** Filters by type and by remaining slots; sets `errors.images` when it rejects. */
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;

  /** Spec B — autocomplete source, already trimmed and diacritic-insensitive. */
  searchRecipients: (query: string) => Sunner[];
  /** Spec D — "@"-mention source inside the editor. */
  searchMentions: (query: string) => Sunner[];
  /** Spec E — the "+ Hashtag" dropdown's options, minus already-chosen tags. */
  hashtagOptions: string[];
  /** The "Danh hiệu" dropdown's options — the design's own award titles. */
  titleOptions: string[];

  /** Validates, then submits. No-op when invalid — surfaces `errors` instead. */
  submit: () => void;
  /** Clears the draft. Called by "Hủy" and after a successful submit. */
  reset: () => void;
}
