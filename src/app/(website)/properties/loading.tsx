export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-white pt-18 animate-pulse">
      {/* Filter bar placeholder */}
      <div className="h-24 border-b border-gray-100 bg-white" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-4 w-48 bg-gray-100 rounded mr-auto" />
          <div className="h-9 w-36 bg-gray-100 rounded-sm" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-100 overflow-hidden">
              {/* Image */}
              <div className="aspect-4/3 bg-gray-100" />
              {/* Body */}
              <div className="p-4 flex flex-col gap-2">
                <div className="h-6 w-32 bg-gray-100 rounded" />
                <div className="h-3.5 w-24 bg-gray-100 rounded" />
                <div className="h-3.5 w-28 bg-gray-100 rounded" />
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-3 w-8 bg-gray-100 rounded" />
                  <div className="h-3 w-8 bg-gray-100 rounded" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
