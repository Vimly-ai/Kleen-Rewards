// AuthPage is no longer used - Clerk handles authentication
// This file is kept to avoid import errors

export function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold">Authentication handled by Clerk</h1>
        <p className="mt-2 text-gray-600">This page should not be visible in production.</p>
      </div>
    </div>
  );
}