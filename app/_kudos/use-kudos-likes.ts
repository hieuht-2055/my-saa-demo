"use client";

import { useCallback, useState, useTransition } from "react";
import type { KudosPost } from "./kudos-data";
import type { LikeOverride } from "./kudos-board-helpers";
import { toggleKudosLike } from "./kudos-actions";

/**
 * Spec C.4.1 — the heart. One per user per kudos, never on your own, and it has
 * to survive a reload, so every toggle is written to Postgres.
 *
 * The returned `overrides` are optimistic only: they make the heart respond on the
 * click instead of after the round-trip. Reloading drops them and the server's own
 * counts show through, which is the behaviour we actually want — they are a paint
 * ahead of the truth, never a second source of it.
 */
export function useKudosLikes(posts: KudosPost[], onError: (errorKey: string) => void) {
  const [overrides, setOverrides] = useState<Record<string, LikeOverride>>({});
  const [, startTransition] = useTransition();

  const onToggleLike = useCallback(
    (kudosId: string) => {
      const source = posts.find((post) => post.id === kudosId);
      // The RLS policy refuses a heart on your own kudos as well; this is just the
      // cheap check that keeps the request from being made at all.
      if (!source || source.sentByViewer) return;

      const before = overrides[kudosId] ?? {
        count: source.likeCount,
        liked: source.likedByViewer,
      };
      setOverrides((prev) => ({
        ...prev,
        [kudosId]: { liked: !before.liked, count: before.count + (before.liked ? -1 : 1) },
      }));

      startTransition(async () => {
        const result = await toggleKudosLike(kudosId);
        if (result.ok) return;
        // Put the heart back where it was — the database did not accept it.
        setOverrides((prev) => ({ ...prev, [kudosId]: before }));
        onError(result.errorKey ?? "action.likeFailed");
      });
    },
    [onError, overrides, posts],
  );

  return { overrides, onToggleLike };
}
