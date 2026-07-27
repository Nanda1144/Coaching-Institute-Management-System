import { MdInbox } from 'react-icons/md'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  title?: string
  message?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({
  icon: IconOrNode = MdInbox,
  title = 'No data found',
  message = 'There are no items to display at the moment.',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6"
      >
        {typeof IconOrNode === 'function' ? <IconOrNode className="text-3xl text-neutral-400" /> : IconOrNode}
      </motion.div>
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">{message}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
