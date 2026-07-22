import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { PricingPlan } from '../types'
import { staggerItem, cardHover } from '../animations/variants'
import { cn } from '../utils/cn'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { handleNavigation } from '../utils/navigation'

interface PricingCardProps extends PricingPlan {
  index?: number
}

export default function PricingCard({
  name, description, price, currency = '$', interval = 'month', features, highlighted, badge, href,
}: PricingCardProps) {
  return (
    <motion.div
      variants={{ ...staggerItem, hover: cardHover.hover }}
      whileHover={highlighted ? 'hover' : undefined}
      className={cn(
        'relative rounded-2xl border p-8 transition-all duration-300',
        highlighted
          ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-600/25 scale-105 border-blue-400'
          : 'bg-white border-gray-100 shadow-sm hover:shadow-xl',
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="gradient" size="md">{badge}</Badge>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className={cn('text-lg font-semibold mb-1', highlighted ? 'text-white' : 'text-gray-900')}>
          {name}
        </h3>
        <p className={cn('text-sm', highlighted ? 'text-blue-200' : 'text-gray-500')}>
          {description}
        </p>
      </div>

      <div className="text-center mb-6">
        <span className={cn('text-5xl font-bold', highlighted ? 'text-white' : 'text-gray-900')}>
          {currency}{price}
        </span>
        <span className={cn('text-sm ml-1', highlighted ? 'text-blue-200' : 'text-gray-500')}>
          /{interval}
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <Check size={16} className={cn('shrink-0 mt-0.5', highlighted ? 'text-blue-200' : 'text-emerald-500')} aria-hidden="true" />
            <span className={highlighted ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>

      {href && (
        <Button
          variant={highlighted ? 'primary' : 'outline'}
          fullWidth
          size="lg"
          onClick={() => handleNavigation(href)}
        >
          {price === 0 ? 'Get Started Free' : `Subscribe ${currency}${price}`}
        </Button>
      )}
    </motion.div>
  )
}
