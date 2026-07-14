import { motion } from 'framer-motion'
import { MdCalendarMonth, MdPeople, MdSchool, MdAccessTime } from 'react-icons/md'
import type { FacultyStats as FacultyStatsType } from '../types/facultyTimetable.types'

interface FacultyStatsProps {
  stats: FacultyStatsType
}

const statCards = [
  { key: 'classesToday', label: 'Classes Today', icon: MdCalendarMonth, color: '#3b82f6', bgColor: '#dbeafe' },
  { key: 'classesThisWeek', label: 'Classes This Week', icon: MdSchool, color: '#10b981', bgColor: '#d1fae5' },
  { key: 'studentsAssigned', label: 'Students Assigned', icon: MdPeople, color: '#8b5cf6', bgColor: '#ede9fe' },
  { key: 'workingHours', label: 'Working Hours / Wk', icon: MdAccessTime, color: '#f59e0b', bgColor: '#fef3c7' },
]

export default function FacultyStats({ stats }: FacultyStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const value = stats[card.key as keyof FacultyStatsType]
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
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
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
