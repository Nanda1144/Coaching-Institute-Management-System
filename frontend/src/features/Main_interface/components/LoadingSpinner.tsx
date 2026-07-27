import { Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const sizeMap = { sm: 16, md: 24, lg: 36 }

export default function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className="animate-spin text-blue-600" size={sizeMap[size]} aria-hidden="true" />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}
