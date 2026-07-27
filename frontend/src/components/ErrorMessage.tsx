import { motion } from 'framer-motion'
import { MdErrorOutline, MdRefresh } from 'react-icons/md'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  fullPage?: boolean
}

export default function ErrorMessage({ message = 'Something went wrong', onRetry, fullPage = false }: ErrorMessageProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${fullPage ? 'min-h-[400px]' : ''}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <MdErrorOutline className="text-red-500 text-2xl" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Error</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-md"
        >
          <MdRefresh className="text-base" />
          Retry
        </button>
      )}
    </motion.div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {content}
      </div>
    )
  }

  return content
}
