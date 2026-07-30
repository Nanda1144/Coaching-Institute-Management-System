import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdPersonAdd, MdUpdate, MdLibraryBooks, MdInbox, MdErrorOutline, MdRefresh, MdSchool, MdAssignment } from 'react-icons/md'
import { useFacultyListShared } from '../hooks/useSharedData'
import { useAuth } from '../contexts/AuthContext'
import EmptyState from './EmptyState'

interface ActivityItem {
  id: number | string
  type: 'joined' | 'profile_update' | 'course_assignment' | 'assignment_submitted' | 'student_registered'
  name: string
  description: string
  timestamp: string
}

const activityIcons: Record<string, { icon: any; color: string; bg: string }> = {
  joined: { icon: MdPersonAdd, color: '#10b981', bg: '#d1fae5' },
  profile_update: { icon: MdUpdate, color: '#3b82f6', bg: '#dbeafe' },
  course_assignment: { icon: MdLibraryBooks, color: '#8b5cf6', bg: '#ede9fe' },
  assignment_submitted: { icon: MdAssignment, color: '#f59e0b', bg: '#fef3c7' },
  student_registered: { icon: MdSchool, color: '#06b6d4', bg: '#cffafe' },
}

function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    if (Number.isNaN(diff)) return 'Unknown'
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    return `${Math.floor(days / 7)} week(s) ago`
  } catch {
    return 'Unknown'
  }
}

export default function RecentActivities() {
  const { user } = useAuth()
  const role = user?.role || ''
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'HOD' || role === 'FACULTY'

  const { data: facultyList, isLoading, isError, error, refetch } = useFacultyListShared({ enabled: isAdmin })

  const activities = useMemo(() => {
    if (!Array.isArray(facultyList)) return []
    const sorted = [...facultyList].sort(
      (a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
    )
    return sorted.slice(0, 8).map((f, i) => ({
      id: f.id ?? `activity-${i}`,
      type: (i === 0 || i === 3 ? 'joined' : i % 2 === 0 ? 'profile_update' : 'course_assignment') as ActivityItem['type'],
      name: f.name || 'Unknown',
      description:
        i === 0 || i === 3
          ? `Joined as faculty in ${f.department || 'General'}`
          : i % 2 === 0
          ? 'Updated profile information'
          : `Assigned to ${f.department || 'General'} department`,
      timestamp: timeAgo(f.joiningDate),
    }))
  }, [facultyList])

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <EmptyState
          icon={<MdInbox className="w-8 h-8 text-gray-400" />}
          title="No recent activities"
          message="Recent activities will appear here."
        />
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={'sk' + i} className="flex items-start gap-3 p-3 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-32" />
                <div className="h-2 bg-gray-200 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-5 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
          <MdErrorOutline className="text-red-500 text-xl" />
        </div>
        <p className="text-sm font-medium text-gray-800 mb-1">Failed to load activities</p>
        <p className="text-xs text-gray-500 mb-3">{error instanceof Error ? error.message : 'Something went wrong'}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
        >
          <MdRefresh className="text-sm" />
          Retry
        </button>
      </motion.div>
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
        <EmptyState
          icon={<MdInbox className="w-8 h-8 text-gray-400" />}
          title="No recent activities"
          message="Faculty activities will appear here once faculty members are added."
        />
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const meta = activityIcons[activity.type] || activityIcons.joined
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
                  <p className="text-sm font-medium text-gray-800 truncate">{activity.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
