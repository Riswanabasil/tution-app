import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-4 text-6xl font-bold text-red-600">404</h1>
      <p className="mb-6 text-xl text-gray-700">Oops! Page not found.</p>

      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}
