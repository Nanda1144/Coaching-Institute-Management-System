import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdStar, MdCheckCircle, MdCancel, MdEvent } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ParentAttendancePage() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-attendance'],
    queryFn: () => parentDashboardService.getAttendance(),
  })

  const attendance = response?.data ?? { overall: 0, present: 0, total: 0, subjects: [], recent: [] }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={'sk' + i} className="card p-5 text-center">
              <div className="skeleton w-8 h-8 rounded-full mx-auto mb-2" />
              <div className="skeleton h-8 w-16 mx-auto mb-1" />
              <div className="skeleton h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="skeleton h-6 w-48 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={'sk' + i} className="mb-3">
                <div className="skeleton h-4 w-32 mb-1" />
                <div className="skeleton h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
          <div className="card p-5">
            <div className="skeleton h-6 w-48 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={'sk' + i} className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div>
                  <div className="skeleton h-4 w-28 mb-1" />
                  <div className="skeleton h-3 w-20" />
                </div>
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Attendance</h1>
          <p className="text-neutral-500 mt-1">Your child&apos;s attendance records</p>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load attendance data. Please try again later.
        </div>
      </div>
    )
  }

  if (!attendance.subjects.length && !attendance.recent.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Attendance</h1>
          <p className="text-neutral-500 mt-1">Your child&apos;s attendance records</p>
        </motion.div>
        <div className="card empty-state">
          <div className="empty-state-icon"><MdEvent size={24} /></div>
          <p className="text-neutral-500">No attendance data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text text-3xl font-bold">Attendance</h1>
        <p className="text-neutral-500 mt-1">Your child&apos;s attendance records</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="stat-card text-center" variants={itemVariants}>
          <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdStar /></div>
          <p className="stat-value">{attendance.overall}%</p>
          <p className="stat-label">Overall Attendance</p>
        </motion.div>
        <motion.div className="stat-card text-center" variants={itemVariants}>
          <div className="stat-icon bg-success-light text-success mx-auto"><MdCheckCircle /></div>
          <p className="stat-value">{attendance.present}</p>
          <p className="stat-label">Classes Attended</p>
        </motion.div>
        <motion.div className="stat-card text-center" variants={itemVariants}>
          <div className="stat-icon bg-warning-light text-warning mx-auto"><MdEvent /></div>
          <p className="stat-value">{attendance.total}</p>
          <p className="stat-label">Total Classes</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="card p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Subject-wise Attendance</h3>
          <div className="space-y-3">
            {attendance.subjects.map((s: any) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-700">{s.name}</span>
                  <span
                    className={`font-medium ${
                      s.percentage >= 85
                        ? 'text-success'
                        : s.percentage >= 75
                          ? 'text-warning'
                          : 'text-danger'
                    }`}
                  >
                    {s.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.percentage >= 85
                        ? 'bg-success'
                        : s.percentage >= 75
                          ? 'bg-warning'
                          : 'bg-danger'
                    }`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {s.present}/{s.total} classes
                </p>
              </div>
            ))}
            {attendance.subjects.length === 0 && (
              <p className="text-sm text-neutral-400 text-center py-4">No subject-wise data</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="card p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Attendance</h3>
          <div className="space-y-2">
            {attendance.recent.map((r: any) => (
              <div
                key={`${r.date}-${r.subject}`}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <p className="text-sm text-neutral-700">{r.subject}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(r.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`badge ${
                    r.status === 'present' ? 'badge-success' : 'badge-danger'
                  }`}
                >
                  {r.status === 'present' ? <MdCheckCircle size={14} /> : <MdCancel size={14} />}
                  {r.status}
                </span>
              </div>
            ))}
            {attendance.recent.length === 0 && (
              <p className="text-sm text-neutral-400 text-center py-4">
                No recent attendance records
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
