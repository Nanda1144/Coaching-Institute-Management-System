import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ErrorMessageProps } from '../types'
import Button from './Button'
import { cn } from '../utils/cn'

export default function ErrorMessage({ message, onRetry, fullPage = false }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullPage ? 'min-h-[60vh]' : 'py-12',
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
        <AlertTriangle className="text-red-600" size={28} aria-hidden="true" />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Something went wrong</h3>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" icon={<RefreshCw size={16} />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
