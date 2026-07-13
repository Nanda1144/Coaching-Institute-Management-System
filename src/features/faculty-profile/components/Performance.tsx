import { motion } from 'framer-motion'
import { MdBook, MdPeople, MdStar, MdTrendingUp } from 'react-icons/md'
import type { PerformanceData } from '../types/profile.types'

interface PerformanceProps {
  performance: PerformanceData
}

const items = [
  { key: 'subjectsHandled', label: 'Subjects', icon: MdBook, color: '#3b82f6', bg: '#dbeafe' },
  { key: 'students', label: 'Students', icon: MdPeople, color: '#8b5cf6', bg: '#ede9fe' },
  { key: 'feedbackRating', label: 'Feedback Rating', icon: MdStar, color: '#f59e0b', bg: '#fef3c7', suffix: '/5.0' },
] as const

export default function Performance({ performance }: PerformanceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Performance</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {items.map(item => {
          const val = performance[item.key as keyof PerformanceData]
          return (
            <div key={item.key} className="text-center p-3 rounded-xl" style={{ backgroundColor: item.bg }}>
              <item.icon className="text-2xl mx-auto mb-1" style={{ color: item.color }} />
              <p className="text-2xl font-bold text-gray-800">
                {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(1)) : val}
              </p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 text-sm text-gray-600">
        <MdTrendingUp className="text-primary" />
        <span className="font-medium">Overall performance is excellent</span>
      </div>
    </motion.div>
  )
}
