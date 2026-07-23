import { motion } from 'framer-motion'

export default function AttendanceHistorySkeleton() {
  const rows = 6

  return (
    <div className="space-y-6">
      <div className="h-12 bg-gray-100/60 rounded-2xl animate-pulse" />

      <div className="bg-white/40 backdrop-blur rounded-2xl border border-white/20 shadow-sm overflow-hidden">
        <div className="p-5 space-y-1">
          <div className="flex gap-4 pb-3 border-b border-gray-100">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={'sk' + i} className="h-4 bg-gray-100 rounded animate-pulse flex-1" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <motion.div
              key={'sk' + i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 py-3 border-b border-gray-50"
            >
              {Array.from({ length: 9 }).map((_, j) => (
                <div
                  key={'sk' + j}
                  className={`h-4 bg-gray-100 rounded animate-pulse flex-1 ${j === 1 ? 'flex-[2]' : ''}`}
                  style={{ animationDelay: `${(i + j) * 50}ms` }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={'sk' + i} className="h-8 w-8 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
