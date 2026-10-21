import { Link, useLocation, useParams } from 'react-router';
import { useIssue } from '../api/issues';
import { ErrorMessage } from '../components/ErrorMessage';
import { IssueDetail } from '../components/IssueDetail';

/** The issue detail, shown as a panel on top of the project list or board. */
export function IssueDetailPage() {
  const { projectKey = '', identifier = '' } = useParams();
  const { search } = useLocation();
  const issue = useIssue(identifier);

  return (
    <aside className="panel" aria-label={`Issue ${identifier}`}>
      <div className="panel__header">
        <span className="panel__identifier">{identifier}</span>
        <Link to={`/projects/${projectKey}${search}`} className="panel__close" aria-label="Close">
          ×
        </Link>
      </div>
      {issue.error && <ErrorMessage error={issue.error} />}
      {issue.isPending && <div className="muted padded">Loading…</div>}
      {issue.data && <IssueDetail key={issue.data.id} issue={issue.data} />}
    </aside>
  );
}
