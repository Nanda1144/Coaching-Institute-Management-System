import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Feature } from '../types'
import { staggerItem, cardHover } from '../animations/variants'
import { cn } from '../utils/cn'
import { handleNavigation } from '../utils/navigation'

interface FeatureCardProps extends Feature {
  index?: number
}

const GLOW_COLORS = [
  'rgba(59,130,246,0.12)',
  'rgba(139,92,246,0.12)',
  'rgba(6,182,212,0.12)',
  'rgba(245,158,11,0.12)',
  'rgba(16,185,129,0.12)',
  'rgba(236,72,153,0.12)',
  'rgba(239,68,68,0.12)',
  'rgba(168,85,247,0.12)',
]

export default function FeatureCard({ icon: Icon, title, description, href, gradient, index = 0 }: FeatureCardProps) {
  const glowColor = useMemo(() => GLOW_COLORS[index % GLOW_COLORS.length], [index])

  return (
    <motion.div
      variants={{ ...staggerItem, hover: cardHover.hover, tap: cardHover.tap }}
      whileHover="hover"
      whileTap="tap"
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 cursor-pointer overflow-hidden"
      onClick={() => href && handleNavigation(href)}
    >
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          transition: 'opacity 0.3s',
        }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          transition: 'opacity 0.3s',
        }}
      />

      <div className={cn(
        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md',
        gradient || 'from-blue-600 to-indigo-600',
      )}>
        {Icon && <Icon className="text-white" size={24} aria-hidden="true" />}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        {description}
      </p>

      {href && (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
          Learn more <ArrowRight size={16} aria-hidden="true" />
        </span>
      )}
    </motion.div>
  )
}
