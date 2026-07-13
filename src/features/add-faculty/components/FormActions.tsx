import { MdSave, MdClose, MdRefresh } from 'react-icons/md'
import { motion } from 'framer-motion'

interface FormActionsProps {
  onCancel: () => void
  onReset: () => void
  isSubmitting?: boolean
  submitLabel?: string
}

export default function FormActions({ onCancel, onReset, isSubmitting, submitLabel = 'Save Faculty' }: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto justify-center"
      >
        <MdRefresh className="text-lg" />
        Reset
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto justify-center"
      >
        <MdClose className="text-lg" />
        Cancel
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
      >
        <MdSave className="text-lg" />
        {isSubmitting ? 'Saving...' : submitLabel}
      </motion.button>
    </div>
  )
}
