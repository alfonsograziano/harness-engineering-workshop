import { Navigate } from 'react-router';
import { useProjects } from '../api/projects';
import { ErrorMessage } from '../components/ErrorMessage';

/** Opens the first project, so the app never starts on an empty screen. */
export function HomePage() {
  const { data: projects, error } = useProjects();

  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (!projects) {
    return <div className="muted padded">Loading…</div>;
  }
  if (projects.length === 0) {
    return <div className="muted padded">No projects yet. Run `npm run db:seed`.</div>;
  }
  return <Navigate to={`/projects/${projects[0].key}`} replace />;
}
