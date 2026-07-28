"use client";

import { useCallback, useMemo, useState } from "react";
import { ALL_KUDOS, HIGHLIGHT_KUDOS, VIEWER, type KudosPost } from "./kudos-data";
import {
  PAGE_SIZE,
  applyLikes,
  formatPostedAt,
  matchesFilters,
  type LikeOverride,
} from "./kudos-board-helpers";
import { useSunnerSearch } from "./use-sunner-search";

/**
 * All Kudos-board behaviour in one place: filters, the carousel cursor, hearts,
 * clipboard + toast, the two search fields, feed paging and the two dialogs.
 * The board is presentational below this hook — every child receives plain data
 * and callbacks, which keeps the design components free of business rules.
 */
export function useKudosBoard() {
  const [hashtagFilter, setHashtagFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [likes, setLikes] = useState<Record<string, LikeOverride>>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [submitted, setSubmitted] = useState<KudosPost[]>([]);
  const [toastKey, setToastKey] = useState<string | null>(null);
  const [isComposeOpen, setComposeOpen] = useState(false);
  const [isSecretBoxOpen, setSecretBoxOpen] = useState(false);
  const search = useSunnerSearch();

  /** Spec B/C — one filter pass drives both the carousel and the feed. */
  const keep = useCallback(
    (post: KudosPost) => matchesFilters(post, hashtagFilter, departmentFilter),
    [hashtagFilter, departmentFilter],
  );

  const highlightPosts = useMemo(
    () => applyLikes(HIGHLIGHT_KUDOS.filter(keep), likes),
    [keep, likes],
  );

  const feedPosts = useMemo(
    () => applyLikes([...submitted, ...ALL_KUDOS].filter(keep), likes),
    [keep, likes, submitted],
  );

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
  const onToggleLike = useCallback((kudosId: string) => {
    // `submitted` must be in the lookup too, or a just-composed kudos would
    // silently fall through and never accept a heart.
    const source = [...HIGHLIGHT_KUDOS, ...ALL_KUDOS, ...submitted].find(
      (post) => post.id === kudosId,
    );
    if (!source || source.sentByViewer) return;
    setLikes((prev) => {
      const current = prev[kudosId] ?? {
        count: source.likeCount,
        liked: source.likedByViewer,
      };
      return {
        ...prev,
        [kudosId]: {
          liked: !current.liked,
          count: current.count + (current.liked ? -1 : 1),
        },
      };
    });
  }, [submitted]);

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

  const onComposeSubmit = useCallback((content: string, hashtags: string[]) => {
    setSubmitted((prev) => [
      {
        // The recipient picker lives on the compose dialog's own MoMorph frame
        // and is out of this screen's scope, so the seed post supplies the
        // receiver while the sender is the viewer.
        ...ALL_KUDOS[0],
        id: `new-${prev.length + 1}`,
        senderId: VIEWER.id,
        content,
        hashtags,
        images: [],
        likeCount: 0,
        likedByViewer: false,
        sentByViewer: true,
        postedAt: formatPostedAt(new Date()),
      },
      ...prev,
    ]);
    setComposeOpen(false);
    setVisibleCount((n) => n + 1);
    setToastKey("compose.sent");
  }, []);

  /**
   * These six MUST be memoised, not inline arrows. Each one lands in a
   * consumer's effect dependency array, so a fresh identity on every board
   * render re-runs those effects: the feed's IntersectionObserver would
   * re-observe and burst-load every page at once, the dialog's focus effect
   * would yank focus off whatever the user is typing, and the toast's
   * auto-dismiss timer would restart forever and outlive its 3s window.
   */
  const onLoadMore = useCallback(() => setVisibleCount((n) => n + PAGE_SIZE), []);
  const dismissToast = useCallback(() => setToastKey(null), []);
  const openCompose = useCallback(() => setComposeOpen(true), []);
  const closeCompose = useCallback(() => setComposeOpen(false), []);
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
      onComposeSubmit,
      isSecretBoxOpen,
      openSecretBox,
      closeSecretBox,
    },
  };
}
