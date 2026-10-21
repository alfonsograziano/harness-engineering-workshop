import { describe, expect, it } from 'vitest';
import { formatRelative } from './dates';

const now = Date.parse('2026-11-07T10:00:00.000Z');

describe('formatRelative', () => {
  it.each([
    ['2026-11-07T09:59:30.000Z', 'just now'],
    ['2026-11-07T09:55:00.000Z', '5 minutes ago'],
    ['2026-11-07T07:00:00.000Z', '3 hours ago'],
    ['2026-11-06T10:00:00.000Z', 'yesterday'],
    ['2026-11-01T10:00:00.000Z', '6 days ago'],
  ])('formats %s as %j', (isoDate, expected) => {
    expect(formatRelative(isoDate, now)).toBe(expected);
  });
});
