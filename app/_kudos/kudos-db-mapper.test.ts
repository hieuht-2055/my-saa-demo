import { describe, it, expect } from 'vitest';
import { rowToPost, rowsToPosts, pickHighlights, type KudosRow } from './kudos-db-mapper';

const VIEWER = 'user-viewer';
const OTHER = 'user-other';

function row(over: Partial<KudosRow> = {}): KudosRow {
  return {
    id: 'k1',
    sender_user_id: OTHER,
    sender_sunner_id: 's2',
    receiver_sunner_id: 'r1',
    title: 'IDOL GIỚI TRẺ',
    content: '<p>Cảm ơn bạn</p>',
    hashtags: ['Teamwork'],
    images: [],
    anonymous: false,
    anonymous_name: null,
    created_at: '2026-07-29T03:05:00.000Z',
    kudos_likes: [],
    ...over,
  };
}

describe('rowToPost', () => {
  it('maps the columns the card renders', () => {
    const post = rowToPost(row(), VIEWER);
    expect(post.id).toBe('k1');
    expect(post.senderId).toBe('s2');
    expect(post.receiverId).toBe('r1');
    // "Danh hiệu" is stored as title and drawn as the group-tag strip.
    expect(post.groupTag).toBe('IDOL GIỚI TRẺ');
    expect(post.content).toBe('<p>Cảm ơn bạn</p>');
    expect(post.hashtags).toEqual(['Teamwork']);
  });

  it('formats created_at as the design timestamp', () => {
    expect(rowToPost(row(), VIEWER).postedAt).toMatch(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/);
  });

  it('counts hearts and reports whether the viewer gave one', () => {
    const liked = rowToPost(row({ kudos_likes: [{ user_id: VIEWER }, { user_id: OTHER }] }), VIEWER);
    expect(liked.likeCount).toBe(2);
    expect(liked.likedByViewer).toBe(true);

    const notLiked = rowToPost(row({ kudos_likes: [{ user_id: OTHER }] }), VIEWER);
    expect(notLiked.likeCount).toBe(1);
    expect(notLiked.likedByViewer).toBe(false);
  });

  it('marks the viewer as the sender only for their own kudos (spec C.4.1)', () => {
    expect(rowToPost(row({ sender_user_id: VIEWER }), VIEWER).sentByViewer).toBe(true);
    expect(rowToPost(row({ sender_user_id: OTHER }), VIEWER).sentByViewer).toBe(false);
  });

  it('leaves seeded authorless posts heartable by everyone', () => {
    // Seed rows carry sender_user_id null, which must never read as "mine".
    expect(rowToPost(row({ sender_user_id: null }), VIEWER).sentByViewer).toBe(false);
  });

  it('treats a signed-out reader as having hearted nothing', () => {
    const post = rowToPost(row({ kudos_likes: [{ user_id: OTHER }] }), null);
    expect(post.likedByViewer).toBe(false);
    expect(post.sentByViewer).toBe(false);
  });

  it('carries anonymity through, and an empty name stays undefined', () => {
    const named = rowToPost(row({ anonymous: true, anonymous_name: 'Ẩn danh' }), VIEWER);
    expect(named.anonymous).toBe(true);
    expect(named.anonymousName).toBe('Ẩn danh');

    // Null must not become "null" — the card falls back to a translated label.
    const unnamed = rowToPost(row({ anonymous: true, anonymous_name: null }), VIEWER);
    expect(unnamed.anonymousName).toBeUndefined();
  });

  it('survives null array columns from Postgres', () => {
    const post = rowToPost(row({ hashtags: null, images: null, kudos_likes: null }), VIEWER);
    expect(post.hashtags).toEqual([]);
    expect(post.images).toEqual([]);
    expect(post.likeCount).toBe(0);
  });
});

describe('rowsToPosts', () => {
  it('preserves the query order', () => {
    const posts = rowsToPosts([row({ id: 'a' }), row({ id: 'b' })], VIEWER);
    expect(posts.map((p) => p.id)).toEqual(['a', 'b']);
  });
});

describe('pickHighlights', () => {
  it('takes the five most-hearted, not the five newest (spec B.2)', () => {
    const posts = rowsToPosts(
      [1, 9, 3, 7, 5, 2].map((n, i) =>
        row({ id: `k${i}`, kudos_likes: Array.from({ length: n }, () => ({ user_id: `u${n}` })) }),
      ),
      VIEWER,
    );
    const top = pickHighlights(posts);
    expect(top).toHaveLength(5);
    expect(top.map((p) => p.likeCount)).toEqual([9, 7, 5, 3, 2]);
  });

  it('does not mutate its input', () => {
    const posts = rowsToPosts([row({ id: 'a' }), row({ id: 'b' })], VIEWER);
    pickHighlights(posts);
    expect(posts.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('returns everything when there are fewer than five', () => {
    expect(pickHighlights(rowsToPosts([row()], VIEWER))).toHaveLength(1);
  });
});
