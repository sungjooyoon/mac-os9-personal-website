export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-4 text-2xl">Page Not Found</p>
        <a href="/" className="text-blue-500 underline">
          Go back home
        </a>
      </div>
    </div>
  );
} 