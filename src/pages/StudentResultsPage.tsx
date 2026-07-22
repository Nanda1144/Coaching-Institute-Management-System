import { motion } from 'framer-motion'
import { MdRateReview, MdSchool, MdStar, MdErrorOutline } from 'react-icons/md'
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

export default function StudentResultsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-results'],
    queryFn: () => studentDashboardService.getMarks(),
  })

  const results = data?.data ?? []

  const overallGPA = results.length > 0 ? ((results.reduce((s: number, r: { total: number }) => s + r.total, 0) / (results.length * 100)) * 4).toFixed(2) : '0.00'

  const overallGrade = results.length > 0
    ? (() => {
        const avg = results.reduce((s: number, r: { total: number }) => s + r.total, 0) / results.length
        if (avg >= 90) return 'A+'
        if (avg >= 80) return 'A'
        if (avg >= 70) return 'A-'
        if (avg >= 60) return 'B+'
        if (avg >= 50) return 'B'
        return 'C'
      })()
    : '-'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Results</h1>
          <p className="text-neutral-500 text-sm mt-1">View your academic performance</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="stat-card">
                  <div className="flex flex-col items-center space-y-2 animate-pulse">
                    <div className="w-8 h-8 rounded-full skeleton" />
                    <div className="h-6 skeleton rounded w-16" />
                    <div className="h-3 skeleton rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-5 animate-pulse">
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load results</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdRateReview size={28} /></div>
            <h3>No results available yet</h3>
            <p>Check back after your exams are graded.</p>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="stat-card text-center">
                <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdStar size={24} /></div>
                <div className="stat-value">{overallGrade}</div>
                <div className="stat-label">Overall Grade</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdSchool size={24} /></div>
                <div className="stat-value">{overallGPA}</div>
                <div className="stat-label">GPA (4.0 Scale)</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdRateReview size={24} /></div>
                <div className="stat-value">{results.length}</div>
                <div className="stat-label">Subjects</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Mid Term</th>
                    <th className="text-center">Final</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r: { subject: string; midTerm: number; final: number; total: number; grade: string }) => (
                    <tr key={r.subject}>
                      <td className="font-medium text-neutral-800">{r.subject}</td>
                      <td className="text-center text-neutral-600">{r.midTerm}</td>
                      <td className="text-center text-neutral-400">{r.final || '-'}</td>
                      <td className="text-center font-medium text-neutral-800">{r.total}</td>
                      <td className="text-center">
                        <span className={`badge ${r.grade.startsWith('A') ? 'badge-success' : r.grade.startsWith('B') ? 'badge-info' : 'badge-warning'}`}>{r.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
