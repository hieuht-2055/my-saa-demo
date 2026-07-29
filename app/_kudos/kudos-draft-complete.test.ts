import { describe, it, expect } from 'vitest';
import {
  EMPTY_DRAFT,
  isDraftComplete,
} from './kudos-compose-draft';
import {
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

describe('isDraftComplete', () => {
  it('returns true for valid draft', () => {
    const draft: KudosDraft = {
      ...EMPTY_DRAFT,
      recipient: mockSunner,
      title: 'Award',
      content: '<p>Message</p>',
      hashtags: ['Teamwork'],
    };
    expect(isDraftComplete(draft)).toBe(true);
  });

  it('returns false for invalid draft', () => {
    expect(isDraftComplete(EMPTY_DRAFT)).toBe(false);
  });
});
