import { motion } from 'framer-motion'
import { Clock, Users, Star, ArrowRight, BookOpen } from 'lucide-react'
import type { Course } from '../types'
import { staggerItem, cardHover } from '../animations/variants'
import { cn } from '../utils/cn'
import Badge from '../components/Badge'
import { handleNavigation } from '../utils/navigation'

interface CourseCardProps extends Course {
  index?: number
}

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
  all: 'bg-gray-100 text-gray-700',
}

export default function CourseCard({
  title, description, category, duration, level, studentsCount, rating, instructor, href,
}: CourseCardProps) {
  return (
    <motion.div
      variants={{ ...staggerItem, hover: cardHover.hover, tap: cardHover.tap }}
      whileHover="hover"
      whileTap="tap"
      className="group card-premium overflow-hidden cursor-pointer"
      onClick={() => href && handleNavigation(href)}
    >
      <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="info" size="sm">{category}</Badge>
          <span className={cn('px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider', levelColors[level])}>
            {level}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /> {duration}</span>
          <span className="flex items-center gap-1.5"><Users size={14} aria-hidden="true" /> {studentsCount.toLocaleString()}</span>
          <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400" aria-hidden="true" /> {rating}</span>
        </div>

        {instructor && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <BookOpen size={14} className="text-gray-400" aria-hidden="true" />
            <span className="text-xs text-gray-500">by <span className="font-medium text-gray-700">{instructor}</span></span>
          </div>
        )}
      </div>

      <div className="px-6 pb-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
          View Course <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  )
}
