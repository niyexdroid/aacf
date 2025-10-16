export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="mx-auto h-6 w-96 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
          >
            {/* Image skeleton */}
            <div className="h-48 w-full animate-pulse bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-6">
              <div className="mb-3 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
