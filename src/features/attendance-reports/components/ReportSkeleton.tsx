import { motion } from 'framer-motion'

export default function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={'sk' + i} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-4 animate-pulse">
            <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-7 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      <div className="h-12 bg-gray-100/60 rounded-2xl animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={'sk' + i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5 animate-pulse"
          >
            <div className="h-5 w-44 bg-gray-200 rounded mb-4" />
            <div className="h-52 bg-gray-100 rounded-xl" />
          </motion.div>
        ))}
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={'sk' + i} className="h-32 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
