import type { Issue } from '@tasklane/shared';
import { useUpdateIssue } from '../api/issues';
import { StatusSelect } from './StatusSelect';

/** A status menu wired to the API, for the list and the board. */
export function IssueStatusControl({ issue }: { issue: Issue }) {
  const updateIssue = useUpdateIssue();

  return (
    <StatusSelect
      value={issue.status}
      disabled={updateIssue.isPending}
      onChange={(status) => updateIssue.mutate({ identifier: issue.identifier, input: { status } })}
    />
  );
}
