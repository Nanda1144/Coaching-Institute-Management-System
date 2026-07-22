import { forwardRef, useId } from 'react'
import type { InputProps } from '../types'
import { cn } from '../utils/cn'

const variantStyles: Record<string, string> = {
  default: 'border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  glass: 'border border-white/30 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-blue-400',
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, variant = 'default', icon, iconPosition = 'left', className, id, ...props },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400',
              variantStyles[variant],
              !!icon && iconPosition === 'left' ? 'pl-10' : undefined,
              !!icon && iconPosition === 'right' ? 'pr-10' : undefined,
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
