import { motion } from 'framer-motion'
import { MdTrendingUp, MdTrendingDown, MdCalendarToday, MdCalendarViewWeek, MdCalendarMonth, MdDateRange } from 'react-icons/md'
import type { StatCardData } from '../types/attendanceReports.types'

interface ReportStatsCardsProps {
  stats: StatCardData[]
}

const icons = [MdCalendarToday, MdCalendarViewWeek, MdCalendarMonth, MdDateRange]

const gradients = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-purple-500 to-purple-600',
]

export default function ReportStatsCards({ stats }: ReportStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = icons[index]
        const isPositive = stat.change >= 0
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 group hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                <motion.p
                  key={String(stat.value)}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-gray-800 tabular-nums"
                >
                  {stat.value.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
                    isPositive ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {isPositive ? <MdTrendingUp className="text-xs" /> : <MdTrendingDown className="text-xs" />}
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-[10px] text-gray-400">{stat.period}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-sm`}>
                <Icon className="text-white text-lg" />
              </div>
            </div>
            <div className="mt-2.5 h-1 w-full rounded-full bg-gray-100/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(stat.change) * 8 + 50, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: isPositive ? '#10b981' : '#ef4444',
                  opacity: 0.3,
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
