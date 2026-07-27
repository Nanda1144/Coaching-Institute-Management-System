import { forwardRef, useId } from 'react'
import type { TextareaProps } from '../types'
import { cn } from '../utils/cn'

const variantStyles: Record<string, string> = {
  default: 'border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  glass: 'border border-white/30 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-blue-400',
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, variant = 'default', className, id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400 resize-y min-h-[100px]',
            variantStyles[variant],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
