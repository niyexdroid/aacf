"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          Failed to Load Blog Post
        </h2>

        <p className="mb-6 text-gray-600">
          We couldn't load this blog post. It might have been removed or there
          was a technical issue.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700"
          >
            Try Again
          </button>

          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
