import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAssignment, MdCloudUpload, MdCheckCircle, MdPendingActions, MdSearch, MdSchedule, MdErrorOutline, MdInsertDriveFile } from 'react-icons/md'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'
import submissionService from '../services/submission/submission.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StudentAssignmentSubmissionPage() {
  const [search, setSearch] = useState('')
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [files, setFiles] = useState<Record<string, File>>({})
  const [submitted, setSubmitted] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['student-assignments-submit'],
    queryFn: () => studentDashboardService.getAssignments(),
  })

  const assignments = data?.data ?? []
  const pendingAssignments = assignments.filter((a: any) => !a.submitted)

  const filtered = pendingAssignments.filter((a: { title: string }) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleFileSelect = (id: string, file: File | null) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [id]: file }))
    }
  }

  const handleSubmit = async (id: string) => {
    if (!files[id]) return
    setSubmittingId(id)
    try {
      await submissionService.create({
        assignmentId: id,
        fileName: files[id].name,
        fileSize: files[id].size,
      } as any)
      setSubmitted((prev) => [...prev, id])
      setFiles((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      queryClient.invalidateQueries({ queryKey: ['student-assignments-submit'] })
    } catch {
      /* ignore */
    }
    setSubmittingId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Assignment Submission</h1>
            <p className="text-neutral-500 text-sm mt-1">Submit your pending assignments</p>
          </div>
          <div className="relative w-full max-w-xs">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card text-center">
            <div className="stat-icon bg-warning-light text-warning mx-auto"><MdPendingActions size={24} /></div>
            <div className="stat-value">{pendingAssignments.length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-icon bg-success-light text-success mx-auto"><MdCheckCircle size={24} /></div>
            <div className="stat-value">{submitted.length}</div>
            <div className="stat-label">Submitted Now</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdAssignment size={24} /></div>
            <div className="stat-value">{assignments.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-md skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                    <div className="h-3 skeleton rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load assignments</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdCheckCircle size={28} className="text-success" /></div>
            <h3>All caught up!</h3>
            <p>{search ? 'No assignments match your search.' : 'You have no pending assignments to submit.'}</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-3">
            {filtered.map((assignment: {
              id: string; title: string; subjectName: string; description: string;
              dueDate: string; totalMarks: number; facultyName: string
            }) => {
              const isSubmitting = submittingId === assignment.id
              const isDone = submitted.includes(assignment.id)
              const hasFile = !!files[assignment.id]
              return (
                <div key={assignment.id} className={`card p-5 hover:shadow-card-hover ${isDone ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
                        <MdAssignment className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-800">{assignment.title}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">{assignment.subjectName} &bull; {assignment.facultyName}</p>
                        <p className="text-xs text-neutral-500 mt-1">{assignment.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-neutral-400">
                            <MdSchedule size={14} /> Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-neutral-400">Max Marks: {assignment.totalMarks}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isDone ? (
                        <span className="badge badge-success flex items-center gap-1"><MdCheckCircle size={14} /> Submitted</span>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <label className="btn btn-ghost btn-sm cursor-pointer">
                            <MdCloudUpload size={16} />
                            {hasFile ? files[assignment.id].name : 'Choose File'}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileSelect(assignment.id, e.target.files?.[0] || null)}
                              disabled={isSubmitting}
                            />
                          </label>
                          {hasFile && (
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <MdInsertDriveFile size={14} />
                              <span>{(files[assignment.id].size / 1024).toFixed(1)} KB</span>
                            </div>
                          )}
                          <button
                            onClick={() => handleSubmit(assignment.id)}
                            disabled={!hasFile || isSubmitting}
                            className="btn btn-primary btn-sm"
                          >
                            {isSubmitting ? 'Uploading...' : 'Submit'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
