"use client";

import { useCallback, useMemo, useState } from "react";
import { GROUP_TAGS, type Sunner } from "./kudos-data";
import {
  MAX_HASHTAGS,
  type ComposeErrors,
  type KudosComposeApi,
  type KudosDraft,
} from "./kudos-compose-types";
import {
  EMPTY_COMPOSE_FORM,
  hasHashtag,
  isDraftComplete,
  normalizeHashtag,
  validateDraft,
} from "./kudos-compose-draft";
import { useComposeAttachments } from "./use-compose-attachments";
import { availableHashtags, lookupSunners } from "./kudos-compose-options";

/**
 * mm:520:11602 (Viết Kudo) — every behaviour behind the compose modal: the draft,
 * its validation, the two Sunner lookups and the submit. Attachments live in
 * `useComposeAttachments`; the dialog that renders all of it is presentational,
 * and the contract between them is `KudosComposeApi`.
 *
 * Errors surface on a submit attempt and clear per-field as the user fixes them,
 * so the form never argues with someone who is already correcting it.
 */
export function useKudosCompose(onSubmit: (draft: KudosDraft) => void): KudosComposeApi {
  const [form, setForm] = useState(EMPTY_COMPOSE_FORM);
  const [fieldErrors, setFieldErrors] = useState<ComposeErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const attachments = useComposeAttachments();
  // Pulled out so `reset` keeps a stable identity: it reaches the board's
  // `closeCompose`, which lands in the dialog's focus effect — a fresh identity
  // each render would yank focus off whatever the user is typing.
  const clearAttachments = attachments.clear;
  const detachAttachments = attachments.detach;

  const draft: KudosDraft = useMemo(
    () => ({ ...form, images: attachments.images }),
    [form, attachments.images],
  );

  /**
   * The attachment hook owns its own refusals, so the image error is *derived*
   * from it rather than copied into state by an effect — one source of truth, and
   * no render where the two disagree.
   */
  const errors: ComposeErrors = useMemo(
    () => (attachments.error ? { ...fieldErrors, images: attachments.error } : fieldErrors),
    [fieldErrors, attachments.error],
  );

  /** Drops one field's complaint the moment that field changes. */
  const clearError = useCallback((field: keyof ComposeErrors) => {
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /**
   * The three "set a value and forgive its error" fields, built once so each keeps
   * a stable identity. Written as one memo rather than three `useCallback`s because
   * they differ only in which key they touch.
   */
  const { setRecipient, setTitle, setContent } = useMemo(
    () => ({
      setRecipient: (recipient: Sunner | null) => {
        setForm((prev) => ({ ...prev, recipient }));
        clearError("recipient");
      },
      setTitle: (title: string) => {
        setForm((prev) => ({ ...prev, title }));
        clearError("title");
      },
      setContent: (content: string) => {
        setForm((prev) => ({ ...prev, content }));
        clearError("content");
      },
    }),
    [clearError],
  );

  const setAnonymous = useCallback((anonymous: boolean) => {
    // Unchecking discards the name too — spec G hides the field, and a hidden
    // value must not ride along to the server.
    setForm((prev) => ({
      ...prev,
      anonymous,
      anonymousName: anonymous ? prev.anonymousName : "",
    }));
  }, []);

  const setAnonymousName = useCallback((anonymousName: string) => {
    setForm((prev) => ({ ...prev, anonymousName }));
  }, []);

  /** Spec E — ignores blanks and duplicates; refuses the sixth with a message. */
  const addHashtag = useCallback(
    (raw: string) => {
      const tag = normalizeHashtag(raw);
      if (!tag || hasHashtag(form.hashtags, tag)) return;
      // TC ID-17 / ID-53 — the sixth tag is refused out loud, not swallowed.
      if (form.hashtags.length >= MAX_HASHTAGS) {
        setFieldErrors((errs) => ({ ...errs, hashtags: "max" }));
        return;
      }
      setForm((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag] }));
      clearError("hashtags");
    },
    [clearError, form.hashtags],
  );

  const removeHashtag = useCallback(
    (tag: string) => {
      setForm((prev) => ({
        ...prev,
        hashtags: prev.hashtags.filter((existing) => existing !== tag),
      }));
      // Removing can only take the count down, so a "max" complaint is now moot.
      clearError("hashtags");
    },
    [clearError],
  );

  /** The text half of a reset. The attachments half differs by caller — see below. */
  const clearForm = useCallback(() => {
    setForm(EMPTY_COMPOSE_FORM);
    setFieldErrors({});
    setSubmitting(false);
  }, []);

  /** Discard ("Hủy"): the draft is gone, so its preview URLs are revoked too. */
  const reset = useCallback(() => {
    clearForm();
    clearAttachments();
  }, [clearAttachments, clearForm]);

  const submit = useCallback(() => {
    if (submitting) return;
    const found = validateDraft(draft);
    if (Object.keys(found).length) {
      // Spec H.2 keeps "Gửi" disabled, but validation still runs here so a
      // keyboard Enter cannot slip past it.
      setFieldErrors(found);
      return;
    }
    setSubmitting(true);
    try {
      onSubmit(draft);
      // Detach rather than clear: the new post carries these object URLs into the
      // feed, so revoking them here would blank the thumbnails on the kudos the
      // user just sent. Ownership passes to the post.
      clearForm();
      detachAttachments();
    } catch {
      // The board's handler is local today; when it becomes a network call this
      // is the seam that must surface the failure instead of clearing the draft.
      setSubmitting(false);
    }
  }, [clearForm, detachAttachments, draft, onSubmit, submitting]);

  return {
    draft,
    errors,
    canSubmit: isDraftComplete(draft) && !submitting,
    submitting,
    setRecipient,
    setTitle,
    setContent,
    setAnonymous,
    setAnonymousName,
    addHashtag,
    removeHashtag,
    addImages: attachments.add,
    removeImage: attachments.remove,
    searchRecipients: lookupSunners,
    searchMentions: lookupSunners,
    hashtagOptions: availableHashtags(form.hashtags),
    titleOptions: [...GROUP_TAGS],
    submit,
    reset,
  };
}
