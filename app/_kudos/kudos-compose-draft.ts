// mm:520:11602 (Viết Kudo) — the compose form's rules, with no React in sight.
// Validation lives here rather than in the hook so each rule is a plain function
// over a draft: the spec's constraints read as code, and the hook stays wiring.

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_CONTENT,
  MAX_HASHTAGS,
  MAX_IMAGES,
  type ComposeErrors,
  type KudosDraft,
} from "./kudos-compose-types";

/**
 * Everything in a draft except the attachments, which are held separately because
 * they own object URLs (see `useComposeAttachments`).
 */
export const EMPTY_COMPOSE_FORM: Omit<KudosDraft, "images"> = {
  recipient: null,
  title: "",
  content: "",
  hashtags: [],
  anonymous: false,
  anonymousName: "",
};

export const EMPTY_DRAFT: KudosDraft = { ...EMPTY_COMPOSE_FORM, images: [] };

/**
 * The editor hands up HTML (spec C's toolbar formats the content), so "is this
 * field empty" can only be answered by the visible text — `<p><br></p>` is what
 * an untouched contentEditable actually contains, and it must still count as
 * blank (TC ID-11, ID-51).
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|blockquote|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // `&amp;` last, or "&amp;lt;" would decode twice.
    .replace(/&amp;/g, "&")
    .trim();
}

/** Drives the counter under the editor (spec D.1). */
export function contentLength(html: string): number {
  return htmlToText(html).length;
}

/** Strips the "#" the user may type, so chips and filters store bare tags. */
export function normalizeHashtag(raw: string): string {
  return raw.trim().replace(/^#+/, "").trim();
}

/** Case-insensitive, because "TeamWork" and "teamwork" are one tag. */
export function hasHashtag(hashtags: string[], tag: string): boolean {
  const needle = tag.toLowerCase();
  return hashtags.some((existing) => existing.toLowerCase() === needle);
}

/**
 * Spec B/D/E plus "Danh hiệu" — the four required fields and the two ceilings.
 * Returns one error per field; an empty object means the draft may be sent.
 */
export function validateDraft(draft: KudosDraft): ComposeErrors {
  const errors: ComposeErrors = {};

  if (!draft.recipient) errors.recipient = "required";
  if (!draft.title.trim()) errors.title = "required";

  const length = contentLength(draft.content);
  if (length === 0) errors.content = "required";
  else if (length > MAX_CONTENT) errors.content = "max";

  if (draft.hashtags.length === 0) errors.hashtags = "required";
  else if (draft.hashtags.length > MAX_HASHTAGS) errors.hashtags = "max";

  if (draft.images.length > MAX_IMAGES) errors.images = "max";

  return errors;
}

export function isDraftComplete(draft: KudosDraft): boolean {
  return Object.keys(validateDraft(draft)).length === 0;
}

export interface ImageIntake {
  accepted: File[];
  /**
   * "type" when anything non-image was picked (TC ID-23, ID-24, ID-55), "max"
   * when the selection overshot the five slots. Type wins: a wrong file is the
   * more specific complaint.
   */
  error?: "type" | "max";
}

/**
 * Spec F — filters a file-picker selection down to what the draft can accept.
 * Partial selections are kept rather than rejected wholesale: picking six valid
 * images should attach five, not none.
 */
export function intakeImages(files: File[], currentCount: number): ImageIntake {
  const accepted: File[] = [];
  let rejectedType = false;

  for (const file of files) {
    if ((ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) accepted.push(file);
    else rejectedType = true;
  }

  const room = Math.max(0, MAX_IMAGES - currentCount);
  const overflowed = accepted.length > room;

  return {
    accepted: accepted.slice(0, room),
    error: rejectedType ? "type" : overflowed ? "max" : undefined,
  };
}
