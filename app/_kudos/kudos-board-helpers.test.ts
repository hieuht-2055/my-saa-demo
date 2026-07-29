import { describe, it, expect } from 'vitest';
import { formatPostedAt, matchesName, matchesFilters, applyLikes } from './kudos-board-helpers';
import type { KudosPost } from './kudos-data';

const mockSeedPost: KudosPost = {
  id: 'seed-post-id',
  senderId: 'old-sender',
  receiverId: 'old-receiver',
  postedAt: '10:00 - 10/30/2025',
  groupTag: 'OLD TAG',
  content: 'Old content',
  hashtags: ['OldTag'],
  images: ['/old-image.png'],
  likeCount: 1000,
  likedByViewer: true,
  sentByViewer: false,
};

describe('formatPostedAt', () => {
  it('formats date as HH:mm - MM/DD/YYYY', () => {
    const date = new Date(2025, 9, 30, 14, 5); // Oct 30, 2025 at 2:05 PM
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('14:05 - 10/30/2025');
  });

  it('pads single-digit hours', () => {
    const date = new Date(2025, 9, 30, 9, 0);
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('09:00 - 10/30/2025');
  });

  it('pads single-digit minutes', () => {
    const date = new Date(2025, 9, 30, 14, 5);
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('14:05 - 10/30/2025');
  });

  it('pads single-digit months', () => {
    const date = new Date(2025, 0, 15, 10, 30); // Jan 15
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('10:30 - 01/15/2025');
  });

  it('pads single-digit days', () => {
    const date = new Date(2025, 9, 5, 10, 30); // Oct 5
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('10:30 - 10/05/2025');
  });

  it('handles midnight', () => {
    const date = new Date(2025, 9, 30, 0, 0);
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('00:00 - 10/30/2025');
  });

  it('handles end of day', () => {
    const date = new Date(2025, 9, 30, 23, 59);
    const formatted = formatPostedAt(date);
    expect(formatted).toBe('23:59 - 10/30/2025');
  });
});

describe('matchesName', () => {
  it('performs diacritic-insensitive matching', () => {
    expect(matchesName('Dương', 'duong')).toBe(true);
    expect(matchesName('Hoàng', 'hoang')).toBe(true);
    expect(matchesName('Nghĩa', 'nghia')).toBe(true);
  });

  it('case-insensitive matching', () => {
    expect(matchesName('John', 'john')).toBe(true);
    expect(matchesName('john', 'JOHN')).toBe(true);
  });

  it('partial string matching', () => {
    expect(matchesName('Hoàng Như Quỳnh', 'hoang')).toBe(true);
    expect(matchesName('Hoàng Như Quỳnh', 'nhu')).toBe(true);
  });

  it('non-matching returns false', () => {
    expect(matchesName('John Doe', 'xyz')).toBe(false);
  });
});

describe('matchesFilters', () => {
  const post: KudosPost = {
    id: 'test-post',
    senderId: 'sender-id',
    receiverId: 'receiver-id',
    postedAt: '10:00 - 10/30/2025',
    groupTag: 'TAG',
    content: 'Message',
    hashtags: ['Teamwork', 'Leadership'],
    images: [],
    likeCount: 10,
    likedByViewer: false,
    sentByViewer: false,
  };

  it('returns true when no filters applied', () => {
    expect(matchesFilters(post, null, null)).toBe(true);
  });

  it('filters by hashtag', () => {
    expect(matchesFilters(post, 'Teamwork', null)).toBe(true);
    expect(matchesFilters(post, 'Creativity', null)).toBe(false);
  });

  it('returns false for missing hashtag', () => {
    expect(matchesFilters(post, 'NonExistent', null)).toBe(false);
  });
});

describe('applyLikes', () => {
  it('applies like overrides', () => {
    const posts: KudosPost[] = [
      { ...mockSeedPost, id: 'post-1', likeCount: 5, likedByViewer: false },
      { ...mockSeedPost, id: 'post-2', likeCount: 10, likedByViewer: true },
    ];

    const overrides = {
      'post-1': { count: 15, liked: true },
    };

    const result = applyLikes(posts, overrides);
    expect(result[0].likeCount).toBe(15);
    expect(result[0].likedByViewer).toBe(true);
    expect(result[1].likeCount).toBe(10); // unchanged
    expect(result[1].likedByViewer).toBe(true); // unchanged
  });

  it('leaves non-overridden posts unchanged', () => {
    const posts: KudosPost[] = [
      { ...mockSeedPost, id: 'post-1', likeCount: 5 },
      { ...mockSeedPost, id: 'post-2', likeCount: 10 },
    ];

    const overrides = {};
    const result = applyLikes(posts, overrides);

    expect(result[0]).toEqual(posts[0]);
    expect(result[1]).toEqual(posts[1]);
  });

  it('handles empty posts', () => {
    const result = applyLikes([], {});
    expect(result).toEqual([]);
  });
});
