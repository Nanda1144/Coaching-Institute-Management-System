import { motion } from 'framer-motion'
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
  onClose: () => void
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  success: MdCheckCircle,
  error: MdError,
  warning: MdWarning,
  info: MdInfo,
}

const colors: Record<string, string> = {
  success: 'border-l-success bg-success/10',
  error: 'border-l-danger bg-danger/10',
  warning: 'border-l-warning bg-warning/10',
  info: 'border-l-info bg-info/10',
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  if (!isVisible) return null
  const toastType = type || 'success'
  const Icon = icons[toastType]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border-l-4 shadow-dropdown bg-white border border-neutral-200 min-w-72 max-w-sm ${colors[toastType]}`}
    >
      <Icon className={`text-xl mt-0.5 shrink-0 ${toastType === 'success' ? 'text-success' : toastType === 'error' ? 'text-danger' : toastType === 'info' ? 'text-info' : 'text-warning'}`} />
      <p className="flex-1 text-sm font-medium text-neutral-700">{message}</p>
      <button onClick={onClose} className="p-0.5 rounded hover:bg-neutral-100 text-neutral-400 shrink-0 transition-colors">
        <MdClose className="text-sm" />
      </button>
    </motion.div>
  )
}
