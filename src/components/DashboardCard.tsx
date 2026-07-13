import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: IconType
  color: string
  bgColor: string
  index?: number
}

export default function DashboardCard({ title, value, icon: Icon, color, bgColor, index = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md hover:shadow-lg transition-all duration-300 p-5 group"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform origin-left">
            {value}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: bgColor, color }}
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
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
      </div>
    </motion.div>
  )
}
