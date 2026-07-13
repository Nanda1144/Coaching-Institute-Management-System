import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdCheckCircle, MdClose } from 'react-icons/md'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xl"
        >
          <MdCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
          <span className="text-sm font-medium text-emerald-800">{message}</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-100 transition-colors ml-2">
            <MdClose className="text-emerald-500 text-sm" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
