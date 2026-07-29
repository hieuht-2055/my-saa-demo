"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import type { KudosPost } from "./kudos-data";
import { PAGE_SIZE, applyLikes, matchesFilters } from "./kudos-board-helpers";
import { useSunnerSearch } from "./use-sunner-search";
import { useKudosCompose } from "./use-kudos-compose";
import type { KudosDraft } from "./kudos-compose-types";
import { pickHighlights } from "./kudos-db-mapper";
import { createKudos } from "./kudos-actions";
import { useKudosLikes } from "./use-kudos-likes";

/**
 * All Kudos-board behaviour in one place: filters, the carousel cursor, hearts,
 * clipboard + toast, the two search fields, feed paging and the two dialogs.
 * The board is presentational below this hook — every child receives plain data
 * and callbacks, which keeps the design components free of business rules.
 */
export function useKudosBoard(posts: KudosPost[]) {
  const [hashtagFilter, setHashtagFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [toastKey, setToastKey] = useState<string | null>(null);
  // Server actions run inside a transition so a send never blocks the click.
  const [, startTransition] = useTransition();
  const onActionError = useCallback((errorKey: string) => setToastKey(errorKey), []);
  const { overrides: likes, onToggleLike } = useKudosLikes(posts, onActionError);
  const [isComposeOpen, setComposeOpen] = useState(false);
  const [isSecretBoxOpen, setSecretBoxOpen] = useState(false);
  const search = useSunnerSearch();

  /** Spec B/C — one filter pass drives both the carousel and the feed. */
  const keep = useCallback(
    (post: KudosPost) => matchesFilters(post, hashtagFilter, departmentFilter),
    [hashtagFilter, departmentFilter],
  );

  // Both sections read the same rows, newest-first from the `/kudos` Server
  // Component. `likes` holds only optimistic overrides on top, so a reload drops
  // them and the server's own counts show through.
  const feedPosts = useMemo(
    () => applyLikes(posts.filter(keep), likes),
    [keep, likes, posts],
  );

  /** Spec B.2 — the carousel is the five most-hearted kudos, not the newest five. */
  const highlightPosts = useMemo(() => pickHighlights(feedPosts), [feedPosts]);

  /** Selecting any filter resets the carousel and the feed to page 1 (spec B). */
  const resetPaging = useCallback(() => {
    setHighlightIndex(0);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const onHashtagChange = useCallback(
    (value: string | null) => {
      setHashtagFilter(value);
      resetPaging();
    },
    [resetPaging],
  );

  const onDepartmentChange = useCallback(
    (value: string | null) => {
      setDepartmentFilter(value);
      resetPaging();
    },
    [resetPaging],
  );

  /**
   * Spec C.4.1 — one heart per user per kudos, and a sender may never heart
   * their own. Toggling off gives the heart back.
   */

  const onCopyLink = useCallback(async (kudosId: string) => {
    const url = `${window.location.origin}/kudos/${kudosId}`;
    try {
      await navigator.clipboard.writeText(url);
      setToastKey("toast.linkCopied");
    } catch {
      // Clipboard access can be denied (insecure origin, permissions policy).
      setToastKey("toast.copyFailed");
    }
  }, []);

  /** Clicking a tag on any card narrows both sections to that tag (spec B.4.3). */
  const onHashtagClick = useCallback(
    (hashtag: string) => onHashtagChange(hashtag),
    [onHashtagChange],
  );

  /**
   * mm:520:11602 (Viết Kudo) — persists the draft, then lets `revalidatePath` in
   * the action deliver the new row back through the Server Component. Nothing is
   * held in client state, so the sent kudos survives a reload.
   */
  const onComposeSubmit = useCallback((draft: KudosDraft) => {
    if (!draft.recipient) return;
    const input = {
      recipientId: draft.recipient.id,
      title: draft.title,
      content: draft.content,
      hashtags: draft.hashtags,
      anonymous: draft.anonymous,
      anonymousName: draft.anonymousName,
    };

    setComposeOpen(false);
    setVisibleCount((n) => n + 1);
    setToastKey("compose.sent");

    startTransition(async () => {
      const result = await createKudos(input);
      if (!result.ok) setToastKey(result.errorKey ?? "action.createFailed");
    });
    // The new kudos is the first card in ALL KUDOS, but that section sits below
    // the carousel and the whole Spotlight canvas — while the compose pill is up
    // in the hero. Without this the send reads as a no-op: the toast fires and
    // nothing on screen changes. Same move the Sunner search makes (spec B.7.3).
    document.getElementById("all-kudos")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const compose = useKudosCompose(onComposeSubmit);
  // Pulled out so `closeCompose` can depend on the stable callback rather than on
  // the API object, which is a fresh identity every render.
  const resetCompose = compose.reset;

  // These MUST be memoised, not inline arrows: each lands in a consumer's effect
  // deps, so a fresh identity per render would make the feed's
  // IntersectionObserver burst-load every page, the dialog steal focus mid-typing,
  // and the toast timer outlive its 3s window.
  const onLoadMore = useCallback(() => setVisibleCount((n) => n + PAGE_SIZE), []);
  const dismissToast = useCallback(() => setToastKey(null), []);
  const openCompose = useCallback(() => setComposeOpen(true), []);
  /** Spec H.1 — "Hủy" discards the draft as well as closing the modal. */
  const closeCompose = useCallback(() => {
    resetCompose();
    setComposeOpen(false);
  }, [resetCompose]);
  const openSecretBox = useCallback(() => setSecretBoxOpen(true), []);
  const closeSecretBox = useCallback(() => setSecretBoxOpen(false), []);

  return {
    filters: {
      hashtag: hashtagFilter,
      department: departmentFilter,
      onHashtagChange,
      onDepartmentChange,
    },
    highlight: {
      posts: highlightPosts,
      index: Math.min(highlightIndex, Math.max(highlightPosts.length - 1, 0)),
      onIndexChange: setHighlightIndex,
    },
    feed: {
      posts: feedPosts.slice(0, visibleCount),
      hasMore: visibleCount < feedPosts.length,
      onLoadMore,
    },
    spotlight: search.spotlight,
    search: search.hero,
    actions: { onToggleLike, onCopyLink, onHashtagClick },
    toast: { messageKey: toastKey, dismiss: dismissToast },
    dialogs: {
      isComposeOpen,
      openCompose,
      closeCompose,
      /** The compose modal's whole behaviour surface (mm:520:11602). */
      compose,
      isSecretBoxOpen,
      openSecretBox,
      closeSecretBox,
    },
  };
}
