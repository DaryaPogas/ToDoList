import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h2>404 - Page Not Found</h2>
      <Link to="/" className="back-link">
        Go to Home Page
      </Link>
    </div>
  );
}
