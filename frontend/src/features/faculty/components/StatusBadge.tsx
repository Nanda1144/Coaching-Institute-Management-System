import { motion } from 'framer-motion'

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-gray-50 text-gray-600 border-gray-200',
  'On Leave': 'bg-amber-50 text-amber-700 border-amber-200',
}

const dotStyles: Record<string, string> = {
  Active: 'bg-emerald-400',
  Inactive: 'bg-gray-400',
  'On Leave': 'bg-amber-400',
}

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.Inactive}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || dotStyles.Inactive}`} />
      {status}
    </motion.span>
  )
}
