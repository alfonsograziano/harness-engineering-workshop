import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="padded">
      <h1>Page not found</h1>
      <Link to="/">Back to your projects</Link>
    </div>
  );
}
