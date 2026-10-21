import { ISSUE_STATUSES, type Issue } from '@tasklane/shared';
import { Link } from 'react-router';
import { STATUS_LABELS } from '../lib/labels';
import { Avatar } from './Avatar';
import { IssueStatusControl } from './IssueStatusControl';
import { LabelList } from './LabelList';
import { PriorityIcon } from './PriorityIcon';

export function IssueBoard({ issues }: { issues: Issue[] }) {
  return (
    <div className="board">
      {ISSUE_STATUSES.map((status) => {
        const column = issues.filter((issue) => issue.status === status);
        return (
          <section key={status} className="board__column" aria-label={STATUS_LABELS[status]}>
            <h2 className="board__heading">
              {STATUS_LABELS[status]} <span className="count">{column.length}</span>
            </h2>
            {column.map((issue) => (
              <article key={issue.id} className="card">
                <div className="card__top">
                  <span className="card__identifier">{issue.identifier}</span>
                  <Avatar user={issue.assignee} />
                </div>
                <Link to={`issues/${issue.identifier}`} className="card__title">
                  {issue.title}
                </Link>
                <LabelList labels={issue.labels} />
                <div className="card__bottom">
                  <PriorityIcon priority={issue.priority} />
                  <IssueStatusControl issue={issue} />
                </div>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
