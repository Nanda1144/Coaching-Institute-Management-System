import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { MdInbox } from 'react-icons/md'

interface EmptyStateProps {
  title?: string
  message?: string
  action?: ReactNode
  icon?: ReactNode
}

export default function EmptyState({
  title = 'No data found',
  message = 'There are no items to display at the moment.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-12 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        {icon || <MdInbox className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{message}</p>
      {action}
    </motion.div>
  )
}
