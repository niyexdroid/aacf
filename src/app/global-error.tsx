"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Global Error Component
 * This catches errors in the root layout
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
              Application Error
            </h1>

            <p className="mb-6 text-center text-gray-600">
              We're sorry, but something went wrong. Our team has been notified
              and is working on it.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 rounded bg-red-50 p-3">
                <p className="text-sm font-medium text-red-800">
                  Error Details:
                </p>
                <p className="mt-1 break-all font-mono text-xs text-red-700">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-1 text-xs text-red-600">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
