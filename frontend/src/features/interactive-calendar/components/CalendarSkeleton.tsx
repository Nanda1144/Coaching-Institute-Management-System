export default function CalendarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-xl" />
          <div className="h-9 w-20 bg-gray-200 rounded-xl" />
          <div className="h-9 w-9 bg-gray-200 rounded-xl" />
          <div className="h-6 w-48 bg-gray-200 rounded ml-2" />
          <div className="flex-1" />
          <div className="h-8 w-36 bg-gray-200 rounded-xl" />
          <div className="h-8 w-28 bg-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-4">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={'weekday-' + i} className="h-4 bg-gray-200 rounded mb-2" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={'date-' + i} className="aspect-square bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="w-60 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-4 hidden lg:block">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={'sk' + i}>
                <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={'sk' + j} className="h-5 bg-gray-100 rounded mb-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
