import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdRateReview, MdSchool, MdStar } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
}

export default function ParentResultsPage() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-results'],
    queryFn: () => parentDashboardService.getMarks(),
  })

  const results = response?.data ?? []

  const overallGPA =
    results.length > 0
      ? ((results.reduce((s: any, r: any) => s + r.total, 0) / (results.length * 100)) * 4).toFixed(2)
      : '0.00'

  const overallGrade =
    results.length > 0
      ? (() => {
          const avg = results.reduce((s: any, r: any) => s + r.total, 0) / results.length
          if (avg >= 90) return 'A+'
          if (avg >= 80) return 'A'
          if (avg >= 70) return 'B+'
          if (avg >= 60) return 'B'
          return 'C'
        })()
      : '-'

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
        <div className="card overflow-hidden">
          <div className="skeleton h-10 w-full rounded-none" />
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={'sk' + i} className="flex justify-between">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-4 w-16" />
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
          <h1 className="gradient-text text-3xl font-bold">Exam Results</h1>
          <p className="text-neutral-500 mt-1">Your child&apos;s academic performance</p>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load results. Please try again later.
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Exam Results</h1>
          <p className="text-neutral-500 mt-1">Your child&apos;s academic performance</p>
        </motion.div>
        <div className="card empty-state">
          <div className="empty-state-icon"><MdSchool size={24} /></div>
          <p className="text-neutral-500">No results available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text text-3xl font-bold">Exam Results</h1>
        <p className="text-neutral-500 mt-1">Your child&apos;s academic performance</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: MdStar, value: overallGrade, label: 'Overall Grade', color: 'text-primary', bg: 'bg-primary-50' },
          { icon: MdSchool, value: overallGPA, label: 'GPA (4.0 Scale)', color: 'text-info', bg: 'bg-info-light' },
          { icon: MdRateReview, value: results.length, label: 'Subjects', color: 'text-success', bg: 'bg-success-light' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card text-center"
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`stat-icon ${stat.bg} ${stat.color} mx-auto`}>
              <stat.icon />
            </div>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
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
            {results.map((r: any) => (
              <tr key={r.subject}>
                <td className="font-medium text-neutral-900">{r.subject}</td>
                <td className="text-center text-neutral-600">{r.midTerm}</td>
                <td className="text-center text-neutral-400">{r.final || '-'}</td>
                <td className="text-center font-medium text-neutral-900">{r.total}</td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      r.grade.startsWith('A')
                        ? 'badge-success'
                        : r.grade.startsWith('B')
                          ? 'badge-info'
                          : 'badge-warning'
                    }`}
                  >
                    {r.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
