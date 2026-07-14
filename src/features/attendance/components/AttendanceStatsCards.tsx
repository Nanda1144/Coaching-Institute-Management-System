import { motion } from 'framer-motion'
import { MdPeople, MdCheckCircle, MdCancel, MdAccessTime, MdEventNote, MdTrendingUp } from 'react-icons/md'
import type { AttendanceStats } from '../types/attendance.types'

interface AttendanceStatsCardsProps {
  stats: AttendanceStats
}

const cards = [
  { key: 'totalStudents', title: 'Total Students', icon: MdPeople, color: '#3b82f6', bg: '#dbeafe', suffix: '' },
  { key: 'presentToday', title: 'Present Today', icon: MdCheckCircle, color: '#10b981', bg: '#d1fae5', suffix: '' },
  { key: 'absentToday', title: 'Absent Today', icon: MdCancel, color: '#ef4444', bg: '#fee2e2', suffix: '' },
  { key: 'lateArrivals', title: 'Late Arrivals', icon: MdAccessTime, color: '#f59e0b', bg: '#fef3c7', suffix: '' },
  { key: 'leaveRequests', title: 'Leave Requests', icon: MdEventNote, color: '#8b5cf6', bg: '#ede9fe', suffix: '' },
  { key: 'attendancePercentage', title: 'Attendance %', icon: MdTrendingUp, color: '#ec4899', bg: '#fce7f3', suffix: '%' },
]

export default function AttendanceStatsCards({ stats }: AttendanceStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const value = stats[card.key as keyof AttendanceStats]
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md hover:shadow-lg transition-all duration-300 p-5 group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform origin-left">
                  {value}{card.suffix}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: card.bg, color: card.color }}
              >
                <Icon className="text-2xl" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gray-100/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: card.color, opacity: 0.3 }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
