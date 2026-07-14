import { motion } from 'framer-motion'
import { MdTrendingUp, MdPeople, MdArrowUpward, MdArrowDownward } from 'react-icons/md'
import type { AnalyticsCards as Cards } from '../types/attendanceAnalytics.types'

interface AnalyticsCardsProps {
  cards: Cards
}

const cardConfig: {
  key: keyof Cards
  label: string
  icon: typeof MdTrendingUp
  gradient: string
  format?: (v: any) => string
}[] = [
  {
    key: 'overallPercentage',
    label: 'Overall Attendance %',
    icon: MdTrendingUp,
    gradient: 'from-blue-500 to-indigo-600',
    format: (v) => `${v}%`,
  },
  {
    key: 'averageAttendance',
    label: 'Average Attendance',
    icon: MdPeople,
    gradient: 'from-emerald-500 to-teal-600',
    format: (v) => `${v}`,
  },
  {
    key: 'highestAttendance',
    label: 'Highest Attendance',
    icon: MdArrowUpward,
    gradient: 'from-amber-500 to-orange-600',
    format: (v) => `${v.value}% (${v.department})`,
  },
  {
    key: 'lowestAttendance',
    label: 'Lowest Attendance',
    icon: MdArrowDownward,
    gradient: 'from-rose-500 to-pink-600',
    format: (v) => `${v.value}% (${v.department})`,
  },
]

export default function AnalyticsCards({ cards }: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardConfig.map((cfg, index) => {
        const Icon = cfg.icon
        const raw = cards[cfg.key]
        const display = cfg.format ? cfg.format(raw) : String(raw)

        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 group hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500">{cfg.label}</p>
                <motion.p
                  key={String(typeof raw === 'object' ? (raw as any).value : raw)}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-bold text-gray-800 leading-tight"
                >
                  {display}
                </motion.p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-sm`}>
                <Icon className="text-white text-lg" />
              </div>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gray-100/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${typeof raw === 'object' ? (raw as any).value : Number(raw)}%`,
                }}
                transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: cfg.key === 'lowestAttendance' ? '#ef4444' : '#10b981',
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
