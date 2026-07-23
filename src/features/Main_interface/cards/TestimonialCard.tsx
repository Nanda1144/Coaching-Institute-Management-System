import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '../types'
import { staggerItem } from '../animations/variants'
import { cn } from '../utils/cn'
import Avatar from '../components/Avatar'

interface TestimonialCardProps extends Testimonial {
  index?: number
}

export default function TestimonialCard({ name, role, content, rating }: TestimonialCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      <Quote className="absolute top-6 right-6 text-blue-100" size={40} aria-hidden="true" />

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={'sk' + i}
            size={16}
            className={cn(
              i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200',
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">
        &ldquo;{content}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <Avatar name={name} size="md" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}
