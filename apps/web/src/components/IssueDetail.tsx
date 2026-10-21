import { ISSUE_PRIORITIES, type Issue, type IssuePriority, type UpdateIssueInput } from '@tasklane/shared';
import { useState } from 'react';
import { useUpdateIssue } from '../api/issues';
import { useUsers } from '../api/users';
import { formatDate } from '../lib/dates';
import { PRIORITY_LABELS } from '../lib/labels';
import { CommentSection } from './CommentSection';
import { ErrorMessage } from './ErrorMessage';
import { StatusSelect } from './StatusSelect';

export function IssueDetail({ issue }: { issue: Issue }) {
  const { data: users = [] } = useUsers();
  const updateIssue = useUpdateIssue();
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);

  function save(input: UpdateIssueInput) {
    updateIssue.mutate({ identifier: issue.identifier, input });
  }

  return (
    <div className="issue-detail">
      <input
        className="issue-detail__title"
        aria-label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={() => title.trim() && title !== issue.title && save({ title })}
      />
      <textarea
        className="issue-detail__description"
        aria-label="Description"
        placeholder="Add a description…"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        onBlur={() => description !== issue.description && save({ description })}
        rows={5}
      />

      <dl className="properties">
        <dt>Status</dt>
        <dd>
          <StatusSelect value={issue.status} onChange={(status) => save({ status })} />
        </dd>
        <dt>Priority</dt>
        <dd>
          <select
            aria-label="Priority"
            value={issue.priority}
            onChange={(event) => save({ priority: event.target.value as IssuePriority })}
          >
            {ISSUE_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </dd>
        <dt>Assignee</dt>
        <dd>
          <select
            aria-label="Assignee"
            value={issue.assignee?.id ?? ''}
            onChange={(event) => save({ assigneeId: event.target.value ? Number(event.target.value) : null })}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </dd>
        <dt>Created</dt>
        <dd>
          {formatDate(issue.createdAt)} by {issue.creator.name}
        </dd>
      </dl>

      {updateIssue.error && <ErrorMessage error={updateIssue.error} />}

      <CommentSection identifier={issue.identifier} />
    </div>
  );
}
