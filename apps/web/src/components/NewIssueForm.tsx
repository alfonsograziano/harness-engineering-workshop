import { ISSUE_PRIORITIES, type IssuePriority } from '@tasklane/shared';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useCreateIssue } from '../api/issues';
import { useUsers } from '../api/users';
import { PRIORITY_LABELS } from '../lib/labels';
import { ErrorMessage } from './ErrorMessage';

interface NewIssueFormProps {
  projectKey: string;
  onClose: () => void;
}

export function NewIssueForm({ projectKey, onClose }: NewIssueFormProps) {
  const { data: users = [] } = useUsers();
  const createIssue = useCreateIssue(projectKey);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('none');
  const [assigneeId, setAssigneeId] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  // The form opens after a click on "New issue", so moving focus to the title is expected.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createIssue.mutate(
      {
        title,
        description,
        priority,
        status: 'todo',
        assigneeId: assigneeId ? Number(assigneeId) : null,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <form className="new-issue" onSubmit={handleSubmit} aria-label="New issue">
      <input
        className="new-issue__title"
        placeholder="Issue title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        ref={titleRef}
      />
      <textarea
        className="new-issue__description"
        placeholder="Add a description…"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
      />
      <div className="new-issue__footer">
        <select
          aria-label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as IssuePriority)}
        >
          {ISSUE_PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {PRIORITY_LABELS[value]}
            </option>
          ))}
        </select>
        <select aria-label="Assignee" value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <span className="spacer" />
        <button type="button" className="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="button button--primary" disabled={createIssue.isPending}>
          Create issue
        </button>
      </div>
      {createIssue.error && <ErrorMessage error={createIssue.error} />}
    </form>
  );
}
