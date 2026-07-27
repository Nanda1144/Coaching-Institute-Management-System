export default function StudentTimetableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200/60 rounded-xl" />
      <div className="h-28 bg-white/50 rounded-2xl border border-white/30" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={'sk' + i} className="h-24 bg-white/50 rounded-2xl border border-white/30" />
        ))}
      </div>
      <div className="h-14 bg-white/50 rounded-2xl border border-white/30" />
      <div className="h-64 bg-white/50 rounded-2xl border border-white/30" />
    </div>
  )
}
