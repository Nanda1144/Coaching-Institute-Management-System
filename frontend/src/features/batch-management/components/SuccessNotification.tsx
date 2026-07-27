import { motion, AnimatePresence } from 'framer-motion'

interface SuccessNotificationProps {
  show: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function SuccessNotification({
  show, onClose,
  title = 'Batch Created!',
  message = 'The batch has been successfully created and is now active in the system.',
}: SuccessNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">{title}</h2>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">{message}</p>
            <button className="btn btn-primary min-w-[120px]" onClick={onClose}>OK</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
