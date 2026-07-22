import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdStar, MdCheckCircle, MdCancel, MdEvent } from 'react-icons/md'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StudentAttendancePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-attendance'],
    queryFn: () => studentDashboardService.getAttendance(),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="h-8 w-48 skeleton rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="empty-state card">
          <div className="empty-state-icon"><MdCancel size={28} className="text-danger" /></div>
          <h3>Failed to load attendance data</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    )
  }

  const attendance = data?.data || data || {}
  const overall = attendance.overall ?? 0
  const present = attendance.present ?? 0
  const total = attendance.total ?? 0
  const subjects = attendance.subjects ?? []
  const recent = attendance.recent ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-neutral-500 text-sm mt-1">View your attendance records</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card text-center">
            <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdStar size={24} /></div>
            <div className="stat-value">{overall}%</div>
            <div className="stat-label">Overall Attendance</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-icon bg-success-light text-success mx-auto"><MdCheckCircle size={24} /></div>
            <div className="stat-value">{present}</div>
            <div className="stat-label">Classes Attended</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-icon bg-warning-light text-warning mx-auto"><MdEvent size={24} /></div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="card p-5">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Subject-wise Attendance</h3>
            {subjects.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-4">No subject attendance data</p>
            ) : (
              <div className="space-y-3">
                {subjects.map((s: any) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700">{s.name}</span>
                      <span className={`font-medium ${s.percentage >= 85 ? 'text-success' : s.percentage >= 75 ? 'text-warning' : 'text-danger'}`}>{s.percentage}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${s.percentage >= 85 ? 'bg-success' : s.percentage >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${s.percentage}%` }} />
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{s.present}/{s.total} classes</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="card p-5">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Recent Attendance</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-4">No recent attendance records</p>
            ) : (
              <div className="space-y-2">
                {recent.map((r: any) => (
                  <div key={`${r.date}-${r.subject}`} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                    <div>
                      <p className="text-sm text-neutral-700">{r.subject}</p>
                      <p className="text-xs text-neutral-400">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className={`badge ${r.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                      {r.status === 'present' ? <MdCheckCircle size={14} /> : <MdCancel size={14} />}{r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
