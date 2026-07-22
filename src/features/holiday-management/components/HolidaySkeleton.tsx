export default function HolidaySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-12 bg-gray-200 rounded" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-200" />
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5">
          <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={'header-' + i} className="h-4 bg-gray-200 rounded" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={'day-' + i} className="aspect-square bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="w-80 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5 hidden lg:block">
          <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
