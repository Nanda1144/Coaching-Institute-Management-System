import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAssignment, MdCloudUpload, MdCheckCircle, MdPendingActions, MdSchedule, MdSearch, MdErrorOutline } from 'react-icons/md'
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

export default function StudentAssignmentsPage() {
  const [search, setSearch] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['student-assignments'],
    queryFn: () => studentDashboardService.getAssignments(),
  })

  const assignments = data?.data ?? []

  const filtered = assignments.filter((a: { title: string }) => a.title.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (id: string) => {
    if (!selectedFile) return
    setSubmittingId(id)
    try {
      await submissionService.create({
        assignmentId: id,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      } as any)
      setSelectedFile(null)
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] })
    } catch {
      /* ignore */
    }
    setSubmittingId(null)
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <MdCheckCircle className="text-warning" size={18} />
      case 'graded': return <MdCheckCircle className="text-success" size={18} />
      default: return <MdPendingActions className="text-neutral-400" size={18} />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">My Assignments</h1>
            <p className="text-neutral-500 text-sm mt-1">View and submit your assignments</p>
          </div>
          <div className="relative w-full max-w-xs">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input type="text" placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
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
        ) : (
          <motion.div variants={itemVariants} className="space-y-3">
            {filtered.map((assignment: { id: string; title: string; subject: string; description: string; dueDate: string; status: string; grade?: string }) => (
              <div key={assignment.id} className="card p-5 hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center shrink-0"><MdAssignment className="text-primary" size={20} /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-800">{assignment.title}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">{assignment.subject}</p>
                      <p className="text-xs text-neutral-500 mt-1">{assignment.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-neutral-400"><MdSchedule size={14} /> Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1 text-xs font-medium">{statusIcon(assignment.status)} {assignment.status}</span>
                        {assignment.grade && <span className="badge badge-success">Grade: {assignment.grade}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {assignment.status === 'pending' && (
                      <div className="flex flex-col items-end gap-2">
                        <label className="btn btn-ghost btn-sm cursor-pointer">
                          <MdCloudUpload size={16} /> Choose File
                          <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        </label>
                        {selectedFile && <span className="text-xs text-neutral-500">{selectedFile.name}</span>}
                        <button onClick={() => handleSubmit(assignment.id)} disabled={!selectedFile || submittingId === assignment.id} className="btn btn-primary btn-sm">
                          {submittingId === assignment.id ? 'Uploading...' : 'Submit'}
                        </button>
                      </div>
                    )}
                    {assignment.status === 'submitted' && <span className="badge badge-warning">Awaiting grade</span>}
                    {assignment.status === 'graded' && <span className="badge badge-success">Graded: {assignment.grade}</span>}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state card">
                <div className="empty-state-icon"><MdAssignment size={28} /></div>
                <h3>No assignments found</h3>
                <p>Try adjusting your search criteria.</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
