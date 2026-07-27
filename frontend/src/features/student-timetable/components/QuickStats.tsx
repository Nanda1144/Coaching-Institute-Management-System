import { motion } from 'framer-motion'
import { MdCalendarMonth, MdCheckCircle, MdQuiz, MdAssignment } from 'react-icons/md'
import type { QuickStats as QuickStatsType } from '../types/studentTimetable.types'

interface QuickStatsProps {
  stats: QuickStatsType
}

const statCards = [
  { key: 'classesToday', label: 'Classes Today', icon: MdCalendarMonth, color: '#3b82f6', bgColor: '#dbeafe' },
  { key: 'attendancePercentage', label: 'Attendance %', icon: MdCheckCircle, color: '#10b981', bgColor: '#d1fae5' },
  { key: 'upcomingExams', label: 'Upcoming Exams', icon: MdQuiz, color: '#8b5cf6', bgColor: '#ede9fe' },
  { key: 'assignments', label: 'Assignments', icon: MdAssignment, color: '#f59e0b', bgColor: '#fef3c7' },
]

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const value = stats[card.key as keyof QuickStatsType]
        const displayValue = card.key === 'attendancePercentage' ? `${value}%` : value
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{displayValue}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bgColor }}>
                <card.icon className="text-xl" style={{ color: card.color }} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
