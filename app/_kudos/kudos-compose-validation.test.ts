import { describe, it, expect } from 'vitest';
import {
  validateDraft,
  EMPTY_DRAFT,
} from './kudos-compose-draft';
import {
  MAX_CONTENT,
  MAX_IMAGES,
  type KudosDraft,
} from './kudos-compose-types';
import type { Sunner } from './kudos-data';

const mockSunner: Sunner = {
  id: 'sunner-1',
  name: 'Hoàng Như Quỳnh',
  department: 'CEVC10',
  avatar: '/avatar.png',
  badge: 'new-hero',
  stars: 1,
};

describe('validateDraft', () => {
  it('reports missing recipient (TC ID-7/50)', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: null,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: ['Teamwork'],
    };
    const errors = validateDraft(draft);
    expect(errors.recipient).toBe('required');
  });

  it('reports missing title', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: '',
      content: '<p>Message</p>',
      hashtags: ['Teamwork'],
    };
    const errors = validateDraft(draft);
    expect(errors.title).toBe('required');
  });

  it('reports missing title when only whitespace', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: '   ',
      content: '<p>Message</p>',
      hashtags: ['Teamwork'],
    };
    const errors = validateDraft(draft);
    expect(errors.title).toBe('required');
  });

  it('reports missing content (TC ID-11/51)', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '',
      hashtags: ['Teamwork'],
    };
    const errors = validateDraft(draft);
    expect(errors.content).toBe('required');
  });

  it('reports missing hashtags (TC ID-14/52)', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: [],
    };
    const errors = validateDraft(draft);
    expect(errors.hashtags).toBe('required');
  });

  it('reports all missing fields (TC ID-56)', () => {
    const draft: KudosDraft = EMPTY_DRAFT;
    const errors = validateDraft(draft);
    expect(errors.recipient).toBe('required');
    expect(errors.title).toBe('required');
    expect(errors.content).toBe('required');
    expect(errors.hashtags).toBe('required');
  });

  it('accepts fully valid draft (TC ID-47/49)', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Thank you for your hard work</p>',
      hashtags: ['Teamwork'],
      images: [],
    };
    const errors = validateDraft(draft);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('reports content exceeds max (TC ID-17)', () => {
    const longContent = '<p>' + 'a'.repeat(MAX_CONTENT + 1) + '</p>';
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: longContent,
      hashtags: ['Teamwork'],
    };
    const errors = validateDraft(draft);
    expect(errors.content).toBe('max');
  });

  it('accepts content at exactly max length', () => {
    const maxContent = '<p>' + 'a'.repeat(MAX_CONTENT) + '</p>';
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: maxContent,
      hashtags: ['Teamwork'],
    };
    const errors = validateDraft(draft);
    expect(errors.content).toBeUndefined();
  });

  it('reports too many hashtags (TC ID-53)', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: ['A', 'B', 'C', 'D', 'E', 'F'], // 6 > MAX_HASHTAGS (5)
    };
    const errors = validateDraft(draft);
    expect(errors.hashtags).toBe('max');
  });

  it('accepts exactly max hashtags', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: ['A', 'B', 'C', 'D', 'E'], // exactly MAX_HASHTAGS (5)
    };
    const errors = validateDraft(draft);
    expect(errors.hashtags).toBeUndefined();
  });

  it('reports too many images', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: ['Teamwork'],
      images: Array.from({ length: MAX_IMAGES + 1 }, (_, i) => ({
        id: `img-${i}`,
        url: `blob:${i}`,
        name: `image-${i}.jpg`,
      })),
    };
    const errors = validateDraft(draft);
    expect(errors.images).toBe('max');
  });

  it('accepts exactly max images', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: ['Teamwork'],
      images: Array.from({ length: MAX_IMAGES }, (_, i) => ({
        id: `img-${i}`,
        url: `blob:${i}`,
        name: `image-${i}.jpg`,
      })),
    };
    const errors = validateDraft(draft);
    expect(errors.images).toBeUndefined();
  });
});
