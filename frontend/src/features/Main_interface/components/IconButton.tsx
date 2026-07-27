import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'
import { buttonTap } from '../animations/variants'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline' | 'glass'
  label: string
}

const sizeStyles: Record<string, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-xl',
}

const variantStyles: Record<string, string> = {
  default: 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm',
  ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
  outline: 'border-2 border-gray-200 text-gray-600 hover:border-gray-300',
  glass: 'bg-white/70 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/90 shadow-sm',
}

export default function IconButton({
  icon,
  size = 'md',
  variant = 'default',
  label,
  className,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      whileTap={buttonTap}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      aria-label={label}
      title={label}
      onClick={onClick}
      {...(props as any)}
    >
      {icon}
    </motion.button>
  )
}
