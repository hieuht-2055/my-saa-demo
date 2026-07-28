import { findSunner, type KudosPost } from "./kudos-data";

/** How many feed cards the infinite scroll reveals per step. */
export const PAGE_SIZE = 4;

/** Spec B.7.3 / A.1 — both search fields cap at 100 characters. */
export const SEARCH_MAX = 100;

/** A locally-toggled heart, overriding the seed values on a post. */
export interface LikeOverride {
  count: number;
  liked: boolean;
}

/** Diacritic-insensitive contains, so "duong" matches "Dương". */
export function matchesName(haystack: string, needle: string): boolean {
  const fold = (value: string) =>
    value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return fold(haystack).includes(fold(needle));
}

/**
 * Spec B/C — one predicate drives both the Highlight carousel and the feed, so
 * a filter selection can never leave the two sections disagreeing. A department
 * matches when it belongs to either party on the kudos.
 */
export function matchesFilters(
  post: KudosPost,
  hashtag: string | null,
  department: string | null,
): boolean {
  if (hashtag && !post.hashtags.includes(hashtag)) return false;
  if (!department) return true;
  return (
    findSunner(post.senderId)?.department === department ||
    findSunner(post.receiverId)?.department === department
  );
}

/** Folds the locally-toggled hearts back onto the seed posts. */
export function applyLikes(
  posts: KudosPost[],
  overrides: Record<string, LikeOverride>,
): KudosPost[] {
  return posts.map((post) => {
    const override = overrides[post.id];
    return override
      ? { ...post, likeCount: override.count, likedByViewer: override.liked }
      : post;
  });
}

/** Formats "now" as the design's "HH:mm - MM/DD/YYYY" timestamp. */
export function formatPostedAt(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())} - ${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}
