export default function TimetableLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-12 bg-gray-200 rounded" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-200" />
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
            <div className="h-52 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5">
        <div className="h-5 w-36 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
