import { createBrowserRouter } from 'react-router';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProjectPage } from './pages/ProjectPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'projects/:projectKey',
        element: <ProjectPage />,
        children: [{ path: 'issues/:identifier', element: <IssueDetailPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
