import { motion } from 'framer-motion'
import { MdFace, MdHowToVote, MdTrendingUp } from 'react-icons/md'
import type { FaceRecognitionStats } from '../types/faceRecognition.types'

interface StatisticsCardsProps {
  stats: FaceRecognitionStats
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const data = stats || { facesDetected: 0, attendanceMarked: 0, accuracy: 0 }

  const cards = [
    { key: 'facesDetected', title: 'Faces Detected', icon: MdFace, value: data.facesDetected, color: '#3b82f6', bg: '#dbeafe' },
    { key: 'attendanceMarked', title: 'Attendance Marked', icon: MdHowToVote, value: data.attendanceMarked, color: '#10b981', bg: '#d1fae5' },
    { key: 'accuracy', title: 'Recognition Accuracy', icon: MdTrendingUp, value: `${data.accuracy}%`, color: '#8b5cf6', bg: '#ede9fe' },
  ] as const

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">{card.title}</p>
                <motion.p
                  key={String(card.value)}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-gray-800"
                >
                  {card.value}
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
                animate={{ width: card.key === 'accuracy' ? `${data.accuracy}%` : '100%' }}
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
