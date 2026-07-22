import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAssessment, MdDownload, MdPeople, MdSchool, MdAttachMoney, MdEvent, MdHowToVote, MdRefresh, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import reportService from '../services/reports/reports.service'

const REPORT_CARDS = [
  { key: 'attendance', title: 'Attendance Report', icon: MdHowToVote, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Generate attendance reports by class, date range, or student' },
  { key: 'students', title: 'Student Report', icon: MdPeople, color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Student enrollment statistics, demographics, and performance' },
  { key: 'faculty', title: 'Faculty Report', icon: MdSchool, color: 'text-purple-500', bg: 'bg-purple-50', description: 'Faculty workload, attendance, and evaluation summary' },
  { key: 'fees', title: 'Fee Report', icon: MdAttachMoney, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Fee collection summary, pending dues, and revenue analysis' },
  { key: 'exams', title: 'Exam Report', icon: MdEvent, color: 'text-red-500', bg: 'bg-red-50', description: 'Exam results, grade distribution, and pass percentage' },
]

export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => reportService.getAll(),
  })

  const reportData = data?.data
  const recentReports: { name: string; date: string; type: string }[] = []

  if (reportData) {
    if (reportData.attendance?.records?.length) {
      recentReports.push({ name: `Attendance Report — ${reportData.attendance.total} records`, date: new Date().toISOString().slice(0, 10), type: 'PDF' })
    }
    if (reportData.fees) {
      recentReports.push({ name: `Fee Collection — ₹${reportData.fees.totalCollected?.toLocaleString?.() || reportData.fees.totalCollected}`, date: new Date().toISOString().slice(0, 10), type: 'Excel' })
    }
    if (reportData.students) {
      recentReports.push({ name: `Student Enrollment — ${reportData.students.totalStudents} students`, date: new Date().toISOString().slice(0, 10), type: 'PDF' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.07 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="empty-state card">
          <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
          <h3>Failed to load reports</h3>
          <p className="text-neutral-500">Please try again later.</p>
          <button onClick={() => refetch()} className="btn btn-primary mt-4 flex items-center gap-2">
            <MdRefresh /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
        <h1 className="gradient-text text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-neutral-500 text-sm mt-1">Generate and export institute reports</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {REPORT_CARDS.map((r) => {
          const isSelected = selectedReport === r.key
          const Icon = r.icon
          const count = reportData?.[r.key]?.totalRecords ?? reportData?.[r.key]?.totalStudents ?? reportData?.[r.key]?.totalFaculty ?? reportData?.[r.key]?.totalExams ?? reportData?.[r.key]?.totalCollected ?? reportData?.[r.key]?.total ?? null
          return (
            <motion.div
              key={r.key}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReport(r.key)}
              className={`card p-5 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500/30 border-primary-400' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center mb-3`}>
                <Icon className={r.color} size={24} />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">{r.title}</h3>
              <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{r.description}</p>
              {count !== null && !isLoading && (
                <p className="text-xs text-neutral-400 mt-2 font-medium">{typeof count === 'number' && count > 1000 ? `₹${count.toLocaleString()}` : count}</p>
              )}
              {isSelected && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="mt-4 pt-4 border-t border-neutral-100 space-y-4 overflow-hidden">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="input-group">
                      <label className="text-xs text-neutral-500">From</label>
                      <input type="date" className="input-field text-sm" />
                    </div>
                    <div className="input-group">
                      <label className="text-xs text-neutral-500">To</label>
                      <input type="date" className="input-field text-sm" />
                    </div>
                  </div>
                  <button onClick={() => refetch()} className="btn btn-primary w-full flex items-center gap-2">
                    <MdDownload size={16} /> Generate Report
                  </button>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <MdAssessment className="text-primary" size={18} />
            </span>
            Available Reports
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-14 skeleton rounded-xl" />)}
            </div>
          ) : recentReports.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">No reports generated yet. Select a report type above to generate your first report.</p>
          ) : (
            <div className="space-y-1">
              {recentReports.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 transition-colors group">
                  <div className="flex items-center gap-3.5">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${r.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      <MdAssessment size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{r.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <button onClick={() => refetch()} className="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <MdRefresh size={14} /> Refresh
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
