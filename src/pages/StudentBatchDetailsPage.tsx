import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdGroup, MdPeople, MdSchool, MdCalendarMonth, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StudentBatchDetailsPage() {
  const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useQuery({
    queryKey: ['student-overview'],
    queryFn: () => studentDashboardService.getOverview(),
  })

  const { data: timetableData, isLoading: timetableLoading } = useQuery({
    queryKey: ['student-timetable'],
    queryFn: () => studentDashboardService.getTimetable(),
    enabled: !overviewError,
  })

  const overview = overviewData?.data
  const student = overview?.student ?? {}
  const stats = overview?.stats ?? {}

  const batch = student.batch || 'Not assigned'
  const section = student.section || '-'
  const course = student.course || '-'
  const semester = student.semester || '-'
  const department = student.department || '-'

  const batchInfo = [
    { label: 'Batch Name', value: batch },
    { label: 'Section', value: section },
    { label: 'Semester', value: `Semester ${semester}` },
    { label: 'Course', value: course },
    { label: 'Department', value: department },
    { label: 'Students', value: stats.totalClasses > 0 ? `${stats.totalClasses} total` : '—' },
  ]

  const classSchedule = useMemo(() => {
    const raw = (timetableData as any)?.data || timetableData || {}
    return dayOrder.map((day) => {
      const entries = (raw[day] || []) as any[]
      const subjects = entries.map((e: any) => ({
        subject: e.subject || e.subjectName || '',
        time: e.startTime ? new Date(e.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        classroom: e.roomNumber || e.classroom || '',
      }))
      return { day, subjects: subjects.map((s) => s.subject).filter(Boolean) }
    }).filter((d) => d.subjects.length > 0)
  }, [timetableData])

  const isLoading = overviewLoading || timetableLoading

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">Batch Details</h1>
          <p className="text-neutral-500 text-sm mt-1">View your batch information and class schedule</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5 animate-pulse">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            </div>
            <div className="card p-5 animate-pulse">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            </div>
          </div>
        ) : overviewError ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load batch details</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="stat-card text-center">
                <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdGroup size={24} /></div>
                <div className="stat-value">{batch}</div>
                <div className="stat-label">Batch</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-emerald-50 text-emerald-600 mx-auto"><MdCalendarMonth size={24} /></div>
                <div className="stat-value">Sem {semester}</div>
                <div className="stat-label">Current Sem</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-violet-50 text-violet-600 mx-auto"><MdPeople size={24} /></div>
                <div className="stat-value">{section}</div>
                <div className="stat-label">Section</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-amber-50 text-amber-600 mx-auto"><MdSchool size={24} /></div>
                <div className="stat-value">{department}</div>
                <div className="stat-label">Department</div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="card p-5">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Batch Information</h3>
                <div className="space-y-3">
                  {batchInfo.map((info) => (
                    <div key={info.label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                      <span className="text-sm text-neutral-500">{info.label}</span>
                      <span className="text-sm font-medium text-neutral-800">{info.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card p-5">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Weekly Schedule</h3>
                {classSchedule.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-6">No schedule available.</p>
                ) : (
                  <div className="space-y-2">
                    {classSchedule.map((day) => (
                      <div key={day.day} className="py-2 border-b border-neutral-50 last:border-0">
                        <p className="text-xs font-semibold text-primary mb-1">{day.day}</p>
                        <div className="flex flex-wrap gap-1">
                          {day.subjects.map((subj) => (
                            <span key={subj} className="px-2 py-0.5 bg-neutral-50 rounded text-xs text-neutral-600">{subj}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
