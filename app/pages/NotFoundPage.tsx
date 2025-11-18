export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>

      <a
        href="/"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        Return Home
      </a>
    </div>
  );
}
