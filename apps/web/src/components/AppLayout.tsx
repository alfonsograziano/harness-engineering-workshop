import { NavLink, Outlet } from 'react-router';
import { useProjects } from '../api/projects';
import { UserMenu } from './UserMenu';

export function AppLayout() {
  const { data: projects = [], isPending } = useProjects();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">Tasklane</div>
        <UserMenu />
        <nav className="sidebar__nav" aria-label="Projects">
          <div className="sidebar__heading">Projects</div>
          {isPending && <div className="sidebar__muted">Loading…</div>}
          {projects.map((project) => (
            <NavLink
              key={project.id}
              to={`/projects/${project.key}`}
              className={({ isActive }) => (isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link')}
            >
              <span className="sidebar__key">{project.key}</span>
              {project.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
