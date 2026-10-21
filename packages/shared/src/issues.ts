export const ISSUE_STATUSES = ['backlog', 'todo', 'in_progress', 'done', 'canceled'] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_PRIORITIES = ['none', 'low', 'medium', 'high', 'urgent'] as const;
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

/** Builds the human readable identifier of an issue, for example `WEB-12`. */
export function formatIssueIdentifier(projectKey: string, issueNumber: number): string {
  return `${projectKey}-${issueNumber}`;
}

/** Splits `WEB-12` into its project key and issue number. Returns null when the format is wrong. */
export function parseIssueIdentifier(identifier: string): { projectKey: string; number: number } | null {
  const match = /^([A-Z][A-Z0-9]*)-(\d+)$/.exec(identifier);
  const [, projectKey, issueNumber] = match ?? [];
  if (!projectKey || !issueNumber) {
    return null;
  }
  return { projectKey, number: Number(issueNumber) };
}
