export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Title skeleton */}
        <div className="mb-6 h-12 w-3/4 animate-pulse rounded-lg bg-gray-200" />

        {/* Meta info skeleton */}
        <div className="mb-8 flex gap-4">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Image skeleton */}
        <div className="mb-8 h-96 w-full animate-pulse rounded-lg bg-gray-200" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
