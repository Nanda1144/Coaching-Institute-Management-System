import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdCheckCircle, MdClose, MdError, MdWarning } from 'react-icons/md'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
  type?: 'success' | 'error' | 'warning'
}

export default function Toast({ message, isVisible, onClose, duration = 3000, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  const styles = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: MdCheckCircle, iconColor: 'text-emerald-500', hoverBg: 'hover:bg-emerald-100' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: MdError, iconColor: 'text-red-500', hoverBg: 'hover:bg-red-100' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: MdWarning, iconColor: 'text-amber-500', hoverBg: 'hover:bg-amber-100' },
  }[type]

  const Icon = styles.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl ${styles.bg} ${styles.border} border shadow-xl`}
        >
          <Icon className={`${styles.iconColor} text-xl flex-shrink-0`} />
          <span className={`text-sm font-medium ${styles.text}`}>{message}</span>
          <button onClick={onClose} className={`p-1 rounded-lg ${styles.hoverBg} transition-colors ml-2`}>
            <MdClose className={`${styles.iconColor} text-sm`} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
