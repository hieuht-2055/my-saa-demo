// Translates a `public.kudos` row into the `KudosPost` the board already renders.
// Pure and framework-free, so the shape contract between Postgres and the cards
// can be unit-tested without a database or a browser.

import type { KudosPost } from "./kudos-data";
import { formatPostedAt } from "./kudos-board-helpers";

/** One row of `public.kudos`, with its hearts joined in. */
export interface KudosRow {
  id: string;
  sender_user_id: string | null;
  sender_sunner_id: string;
  receiver_sunner_id: string;
  title: string;
  content: string;
  hashtags: string[] | null;
  images: string[] | null;
  anonymous: boolean;
  anonymous_name: string | null;
  created_at: string;
  /** From the embedded `kudos_likes(user_id)` select — one entry per heart. */
  kudos_likes?: { user_id: string }[] | null;
}

/**
 * `viewerId` is the authenticated account, which decides two things the row alone
 * cannot: whether the viewer has already hearted this kudos, and whether they
 * authored it (spec C.4.1 disables the heart on your own).
 */
export function rowToPost(row: KudosRow, viewerId: string | null): KudosPost {
  const likes = row.kudos_likes ?? [];

  return {
    id: row.id,
    senderId: row.sender_sunner_id,
    receiverId: row.receiver_sunner_id,
    // The design prints an already-formatted timestamp, so formatting happens on
    // the server and travels as a plain string — no locale drift at hydration.
    postedAt: formatPostedAt(new Date(row.created_at)),
    // "Danh hiệu" is stored as the title and drawn as the card's group-tag strip.
    groupTag: row.title,
    content: row.content,
    hashtags: row.hashtags ?? [],
    images: row.images ?? [],
    likeCount: likes.length,
    likedByViewer: viewerId ? likes.some((like) => like.user_id === viewerId) : false,
    // Seeded posts have no author, so `sender_user_id` is null and they stay
    // heartable by everyone.
    sentByViewer: Boolean(viewerId && row.sender_user_id === viewerId),
    anonymous: row.anonymous,
    anonymousName: row.anonymous_name ?? undefined,
  };
}

export function rowsToPosts(rows: KudosRow[], viewerId: string | null): KudosPost[] {
  return rows.map((row) => rowToPost(row, viewerId));
}

/**
 * Spec B.2 — the HIGHLIGHT carousel is the five most-hearted kudos of the event.
 * Ties break on recency, which is the order the query already delivers.
 */
export function pickHighlights(posts: KudosPost[], limit = 5): KudosPost[] {
  return [...posts].sort((a, b) => b.likeCount - a.likeCount).slice(0, limit);
}
