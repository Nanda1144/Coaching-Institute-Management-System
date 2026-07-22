import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdAssignment, MdCheckCircle, MdPendingActions, MdSchedule, MdSearch, MdSchool } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ParentAssignmentsPage() {
  const [search, setSearch] = useState('')
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-assignments'],
    queryFn: () => parentDashboardService.getAssignments(),
  })
  const assignments = response?.data ?? []
  const filtered = assignments.filter((a: any) => a.title.toLowerCase().includes(search.toLowerCase()))

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-64" />
          </div>
          <div className="skeleton h-10 w-48 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="flex gap-3">
                    <div className="skeleton h-3 w-24" />
                    <div className="skeleton h-5 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Assignments</h1>
          <p className="text-neutral-500 mt-1">View your child&apos;s assignments and submission status</p>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load assignments. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="gradient-text text-3xl font-bold">Assignments</h1>
          <p className="text-neutral-500 mt-1">View your child&apos;s assignments and submission status</p>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 pr-3 py-2 w-48"
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><MdSchool size={24} /></div>
          <p className="text-neutral-500">No assignments found</p>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((a: any) => (
            <motion.div key={a.id} className="card p-5" variants={itemVariants}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <MdAssignment className="text-primary" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900">{a.title}</h3>
                  <p className="text-xs text-neutral-400">{a.subject}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <MdSchedule size={14} /> Due:{' '}
                      {new Date(a.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span
                      className={`badge ${
                        a.status === 'pending'
                          ? 'badge-warning'
                          : a.status === 'submitted'
                            ? 'badge-info'
                            : 'badge-success'
                      }`}
                    >
                      {a.status === 'pending' ? (
                        <MdPendingActions size={14} />
                      ) : (
                        <MdCheckCircle size={14} />
                      )}
                      {a.status === 'graded' ? `Graded: ${a.grade}` : a.status}
                    </span>
                    {a.submittedDate && (
                      <span className="text-xs text-neutral-400">
                        Submitted:{' '}
                        {new Date(a.submittedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
