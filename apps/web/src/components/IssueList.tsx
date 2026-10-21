import { ISSUE_STATUSES, type Issue } from '@tasklane/shared';
import { Link } from 'react-router';
import { formatRelative } from '../lib/dates';
import { STATUS_LABELS } from '../lib/labels';
import { Avatar } from './Avatar';
import { IssueStatusControl } from './IssueStatusControl';
import { LabelList } from './LabelList';
import { PriorityIcon } from './PriorityIcon';

export function IssueList({ issues }: { issues: Issue[] }) {
  return (
    <div className="issue-list">
      {ISSUE_STATUSES.map((status) => {
        const group = issues.filter((issue) => issue.status === status);
        if (group.length === 0) {
          return null;
        }
        return (
          <section key={status} className="issue-list__group">
            <h2 className="issue-list__heading">
              {STATUS_LABELS[status]} <span className="count">{group.length}</span>
            </h2>
            {group.map((issue) => (
              <div key={issue.id} className="issue-row">
                <PriorityIcon priority={issue.priority} />
                <Link to={`issues/${issue.identifier}`} className="issue-row__link">
                  <span className="issue-row__identifier">{issue.identifier}</span>
                  <span className="issue-row__title">{issue.title}</span>
                </Link>
                <span className="issue-row__labels">
                  <LabelList labels={issue.labels} />
                </span>
                <IssueStatusControl issue={issue} />
                <span className="issue-row__date">{formatRelative(issue.updatedAt)}</span>
                <Avatar user={issue.assignee} />
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
