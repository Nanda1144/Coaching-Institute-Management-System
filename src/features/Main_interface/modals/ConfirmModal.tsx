import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import Button from '../components/Button'
import { modalOverlay, modalContent } from '../animations/variants'
import { cn } from '../utils/cn'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

const variantConfig = {
  danger: { icon: AlertTriangle, iconClass: 'bg-red-100 text-red-600', buttonVariant: 'danger' as const },
  warning: { icon: AlertTriangle, iconClass: 'bg-amber-100 text-amber-600', buttonVariant: 'primary' as const },
  info: { icon: AlertTriangle, iconClass: 'bg-blue-100 text-blue-600', buttonVariant: 'primary' as const },
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden',
            )}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6 text-center">
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4', config.iconClass)}>
                <config.icon size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>

            <div className="flex items-center gap-3 px-6 pb-6">
              <Button variant="outline" fullWidth onClick={onClose} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button variant={config.buttonVariant} fullWidth onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
