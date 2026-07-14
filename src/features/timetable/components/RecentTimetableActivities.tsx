import { motion } from 'framer-motion'
import { MdUpdate, MdPlaylistAdd, MdSchedule } from 'react-icons/md'
import type { TimetableActivity } from '../types/timetable.types'

interface RecentTimetableActivitiesProps {
  activities: TimetableActivity[]
  error?: string | null
}

const activityConfig: Record<string, { icon: typeof MdUpdate; color: string; bg: string }> = {
  updated: { icon: MdUpdate, color: '#3b82f6', bg: '#dbeafe' },
  added: { icon: MdPlaylistAdd, color: '#10b981', bg: '#d1fae5' },
}

export default function RecentTimetableActivities({ activities, error }: RecentTimetableActivitiesProps) {
  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-5 text-center">
        <MdSchedule className="text-3xl text-red-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <MdSchedule className="text-3xl text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No recent timetable activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type]
            const Icon = config.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <Icon className="text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{activity.timetableName}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{activity.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">{activity.timestamp}</span>
                    <span className="text-[10px] text-gray-400">by {activity.user}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
