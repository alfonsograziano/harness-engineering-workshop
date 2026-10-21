import { useState } from 'react';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { useIssues } from '../api/issues';
import { useProject } from '../api/projects';
import { ErrorMessage } from '../components/ErrorMessage';
import { IssueBoard } from '../components/IssueBoard';
import { IssueList } from '../components/IssueList';
import { LabelFilter } from '../components/LabelFilter';
import { NewIssueForm } from '../components/NewIssueForm';
import { type IssueView, ViewToggle } from '../components/ViewToggle';

export function ProjectPage() {
  const { projectKey = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);

  const project = useProject(projectKey);
  const view: IssueView = searchParams.get('view') === 'board' ? 'board' : 'list';
  const labelId = Number(searchParams.get('label')) || undefined;
  const issues = useIssues(projectKey, { labelId });

  // The view and the label filter live in the URL, so a reload or a shared link keeps them.
  function updateSearch(name: 'view' | 'label', value: string | undefined) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) {
        next.set(name, value);
      } else {
        next.delete(name);
      }
      return next;
    });
  }

  if (project.error) {
    return <ErrorMessage error={project.error} />;
  }

  return (
    <div className="project">
      <header className="project__header">
        <div>
          <h1 className="project__title">{project.data?.name ?? projectKey}</h1>
          <p className="project__description">{project.data?.description}</p>
        </div>
        <div className="project__actions">
          <LabelFilter
            projectKey={projectKey}
            value={labelId}
            onChange={(next) => updateSearch('label', next ? String(next) : undefined)}
          />
          <ViewToggle value={view} onChange={(next) => updateSearch('view', next === 'list' ? undefined : next)} />
          <button type="button" className="button button--primary" onClick={() => setIsCreating(true)}>
            New issue
          </button>
        </div>
      </header>

      {isCreating && <NewIssueForm projectKey={projectKey} onClose={() => setIsCreating(false)} />}

      <div className="project__body">
        {issues.error && <ErrorMessage error={issues.error} />}
        {issues.isPending && <div className="muted padded">Loading issues…</div>}
        {issues.data && (view === 'board' ? <IssueBoard issues={issues.data} /> : <IssueList issues={issues.data} />)}
      </div>

      <Outlet />
    </div>
  );
}
