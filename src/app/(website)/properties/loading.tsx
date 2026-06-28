export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-[#f7f6f3] pt-20 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="h-9 w-64 bg-gray-100 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
                  <div className="h-9 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          </aside>

          {/* Cards skeleton */}
          <div className="flex-1">
            <div className="h-10 w-36 bg-gray-100 rounded-lg mb-6 ml-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
