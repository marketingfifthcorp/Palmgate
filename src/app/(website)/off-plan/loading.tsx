export default function OffPlanLoading() {
  return (
    <div className="min-h-screen bg-white pt-18 animate-pulse">
      {/* Filter bar placeholder */}
      <div className="h-14 border-b border-gray-100 bg-white" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title row */}
        <div className="h-4 w-56 bg-gray-100 rounded mb-8" />

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-sm overflow-hidden">
              {/* Image */}
              <div className="aspect-3/2 bg-gray-100" />
              {/* Body */}
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
                {/* Stats bar */}
                <div className="mt-2 border border-gray-200 rounded-sm grid grid-cols-3 divide-x divide-gray-200 py-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="px-2.5 flex flex-col items-center gap-1">
                      <div className="h-2.5 w-14 bg-gray-100 rounded" />
                      <div className="h-3 w-10 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="h-9 bg-gray-100 rounded-sm" />
                  <div className="h-9 bg-gray-100 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
