import { describe, expect, it } from 'vitest';
import { formatIssueIdentifier, parseIssueIdentifier } from './issues';

describe('issue identifiers', () => {
  it('formats a project key and a number', () => {
    expect(formatIssueIdentifier('WEB', 12)).toBe('WEB-12');
  });

  it('parses a valid identifier', () => {
    expect(parseIssueIdentifier('WEB-12')).toEqual({ projectKey: 'WEB', number: 12 });
    expect(parseIssueIdentifier('MOB2-3')).toEqual({ projectKey: 'MOB2', number: 3 });
  });

  it.each(['web-12', 'WEB12', 'WEB-', '-12', 'WEB-12a', ''])('returns null for %j', (identifier) => {
    expect(parseIssueIdentifier(identifier)).toBeNull();
  });
});
