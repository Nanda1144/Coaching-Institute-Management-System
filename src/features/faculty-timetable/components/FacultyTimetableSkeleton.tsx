export default function FacultyTimetableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-72 bg-gray-200/60 rounded-xl" />
      <div className="h-32 bg-white/50 rounded-2xl border border-white/30" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={'sk' + i} className="h-24 bg-white/50 rounded-2xl border border-white/30" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-14 bg-white/50 rounded-2xl border border-white/30" />
          <div className="h-10 bg-white/50 rounded-xl border border-white/30 w-48" />
          <div className="h-72 bg-white/50 rounded-2xl border border-white/30" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-48 bg-white/50 rounded-2xl border border-white/30" />
        </div>
      </div>
    </div>
  )
}
