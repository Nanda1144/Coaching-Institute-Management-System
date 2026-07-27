import { motion } from 'framer-motion'
import {
  MdCelebration, MdEvent, MdSwapHoriz, MdInfoOutline
} from 'react-icons/md'
import type { Notification } from '../types/timetable.types'

interface NotificationsPanelProps {
  notifications: Notification[]
  error?: string | null
}

const typeConfig: Record<string, { icon: typeof MdCelebration; label: string; color: string; bg: string }> = {
  holiday: { icon: MdCelebration, label: 'Holiday', color: '#f59e0b', bg: '#fef3c7' },
  event: { icon: MdEvent, label: 'Event', color: '#3b82f6', bg: '#dbeafe' },
  change: { icon: MdSwapHoriz, label: 'Change', color: '#8b5cf6', bg: '#ede9fe' },
}

export default function NotificationsPanel({ notifications, error }: NotificationsPanelProps) {
  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-5 text-center">
        <MdInfoOutline className="text-3xl text-red-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Notifications</h3>

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <MdInfoOutline className="text-3xl text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, index) => {
            const config = typeConfig[notif.type] || { icon: MdInfoOutline, label: 'Info', color: '#6b7280', bg: '#f3f4f6' }
            const Icon = config.icon
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <Icon className="text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800 truncate">{notif.title}</p>
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: config.bg, color: config.color }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.description}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(notif.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
