import { motion } from 'framer-motion'
import { MdFingerprint, MdClose, MdHowToVote } from 'react-icons/md'
import type { FingerprintStats } from '../types/fingerprint.types'

interface StatisticsCardsProps {
  stats: FingerprintStats
}

const cards: {
  key: keyof FingerprintStats
  title: string
  icon: typeof MdFingerprint
  color: string
  bg: string
  format?: (v: number) => string
}[] = [
  { key: 'successfulScans', title: 'Successful Scans', icon: MdFingerprint, color: '#10b981', bg: '#d1fae5' },
  { key: 'failedAttempts', title: 'Failed Attempts', icon: MdClose, color: '#ef4444', bg: '#fee2e2' },
  { key: 'totalAttendance', title: 'Total Attendance', icon: MdHowToVote, color: '#3b82f6', bg: '#dbeafe' },
]

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const value = stats[card.key]
        const maxVal = Math.max(stats.successfulScans, stats.failedAttempts, stats.totalAttendance)

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 group hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">{card.title}</p>
                <motion.p
                  key={String(value)}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-gray-800"
                >
                  {value}
                </motion.p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: card.bg, color: card.color }}
              >
                <Icon className="text-xl" />
              </div>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-gray-100/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
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
