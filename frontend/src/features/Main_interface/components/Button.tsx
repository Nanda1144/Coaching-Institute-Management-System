import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { ButtonProps } from '../types'
import { cn } from '../utils/cn'
import { handleNavigation } from '../utils/navigation'
import { buttonTap } from '../animations/variants'

const variantStyles: Record<string, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
  secondary:
    'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200',
  outline:
    'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25',
  gradient:
    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500',
}

const sizeStyles: Record<string, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1',
  sm: 'px-3.5 py-1.5 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
  xl: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      href,
      fullWidth = false,
      disabled,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      if (loading) return
      if (href) {
        handleNavigation(href)
        return
      }
      onClick?.(e)
    }

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || loading ? undefined : buttonTap}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...(props as any)}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'xs' ? 14 : size === 'sm' ? 16 : 18} />
        ) : icon && iconPosition === 'left' ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
        {!loading && icon && iconPosition === 'right' ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

export default Button
