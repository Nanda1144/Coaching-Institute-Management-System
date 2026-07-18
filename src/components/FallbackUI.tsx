import { motion } from 'framer-motion'
import { MdWarning, MdRefresh } from 'react-icons/md'

interface FallbackUIProps {
  error?: Error | null
  onRetry?: () => void
  title?: string
  message?: string
}

export default function FallbackUI({
  error,
  onRetry,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
}: FallbackUIProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <MdWarning className="text-red-500 text-2xl" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-md"
        >
          <MdRefresh className="text-base" />
          Try Again
        </button>
      )}
      {error && (
        <details className="mt-4 text-left w-full max-w-md">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Error details</summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
      )}
    </motion.div>
  )
}
