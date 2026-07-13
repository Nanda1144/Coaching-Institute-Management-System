import { motion } from 'framer-motion'
import { MdPersonAdd, MdUpdate, MdLibraryBooks } from 'react-icons/md'
import { recentActivities } from '../data/dashboardData'

const activityIcons: Record<string, { icon: typeof MdPersonAdd; color: string; bg: string }> = {
  joined: { icon: MdPersonAdd, color: '#10b981', bg: '#d1fae5' },
  profile_update: { icon: MdUpdate, color: '#3b82f6', bg: '#dbeafe' },
  course_assignment: { icon: MdLibraryBooks, color: '#8b5cf6', bg: '#ede9fe' },
}

export default function RecentActivities() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {recentActivities.map((activity, index) => {
          const meta = activityIcons[activity.type]
          const Icon = meta.icon
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
                style={{ backgroundColor: meta.bg, color: meta.color }}
              >
                <Icon className="text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{activity.facultyName}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
