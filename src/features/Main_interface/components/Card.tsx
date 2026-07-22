import { motion } from 'framer-motion'
import type { CardProps } from '../types'
import { cn } from '../utils/cn'
import { cardHover } from '../animations/variants'

const variantStyles: Record<string, string> = {
  default: 'bg-white shadow-sm border border-gray-100',
  glass: 'bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg',
  bordered: 'bg-white border-2 border-gray-100',
  elevated: 'bg-white shadow-xl border border-gray-50',
  gradient: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
}

const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  onClick,
  hoverable = false,
}: CardProps) {
  const Component = hoverable ? motion.div : 'div'
  const motionProps = hoverable
    ? {
        initial: 'rest',
        whileHover: 'hover',
        whileTap: 'tap' as const,
        variants: cardHover,
      }
    : {}

  return (
    <Component
      className={cn(
        'rounded-2xl transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
