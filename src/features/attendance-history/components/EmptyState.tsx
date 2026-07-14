import { motion } from 'framer-motion'
import { MdSearchOff } from 'react-icons/md'

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-12 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MdSearchOff className="text-6xl text-gray-300 mx-auto mb-4" />
      </motion.div>
      <p className="text-lg font-semibold text-gray-600 mb-1">No records found</p>
      <p className="text-sm text-gray-400 max-w-xs mx-auto">
        Try adjusting your search or filter criteria to find attendance records.
      </p>
    </motion.div>
  )
}
