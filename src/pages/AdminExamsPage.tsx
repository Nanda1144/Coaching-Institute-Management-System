import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdEvent, MdAdd, MdEdit, MdDelete, MdRateReview, MdPublish, MdCalendarMonth, MdSubject, MdPerson } from 'react-icons/md'
import { useExamList, useCreateExam, useUpdateExam, useDeleteExam } from '../hooks/useReactQuery'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminExamsPage() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})

  const { data: exams, isLoading, isError, error, refetch } = useExamList()
  const createExam = useCreateExam()
  const updateExam = useUpdateExam()
  const deleteExam = useDeleteExam()

  const examList = Array.isArray(exams) ? exams : []

  const scheduledExams = examList.filter((e: any) => e.status === 'scheduled').length
  const completedExams = examList.filter((e: any) => e.status === 'completed').length

  const filtered = examList.filter((e: any) => e.title?.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    const form = document.getElementById('create-exam-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    createExam.mutate(data)
    setShowCreate(false)
  }

  const handleEdit = (e: any) => {
    setEditingId(e.id)
    setEditData({ title: e.title, subject: e.subject, batch: e.batch, date: e.date, time: e.time })
  }

  const handleSaveEdit = (id: string) => {
    updateExam.mutate({ id, data: editData })
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure?')) deleteExam.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="skeleton h-9 w-64 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="skeleton h-10 w-36 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={'sk' + i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="card overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={'sk' + i} className="skeleton h-24 mx-4 my-2 rounded-lg" />
          ))}
          <div className="h-4" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon !bg-danger-light !text-danger">!</div>
          <h3>Error loading exams</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load exams'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Exam Management</h1>
          <p>{examList.length} exams total</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
          <MdAdd size={18} /> {showCreate ? 'Cancel' : 'Create Exam'}
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdEvent size={24} /></div>
          <div className="stat-value">{examList.length}</div>
          <div className="stat-label">Total Exams</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-warning-light text-warning"><MdCalendarMonth size={24} /></div>
          <div className="stat-value">{scheduledExams}</div>
          <div className="stat-label">Scheduled</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdRateReview size={24} /></div>
          <div className="stat-value">{completedExams}</div>
          <div className="stat-label">Completed</div>
        </motion.div>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="card mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdEvent className="text-primary" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Schedule New Exam</h3>
              <p className="text-xs text-neutral-500">Fill in the exam details and select the batch</p>
            </div>
          </div>
          <form id="create-exam-form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {['title', 'subject', 'batch', 'date', 'startTime', 'endTime', 'location', 'type'].map((f) => (
                <div className="input-group" key={f}>
                  <label>{f.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</label>
                  <input type="text" name={f} className="input-field" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="btn btn-primary" disabled={createExam.isPending}>
                {createExam.isPending ? 'Scheduling...' : 'Schedule Exam'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="card">
        <div className="relative mb-5">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input type="text" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MdEvent size={28} /></div>
            <h3>No exams found</h3>
            <p>Try adjusting your search or schedule a new exam to get started.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
            {filtered.map((exam: any) => (
              <motion.div key={exam.id} variants={itemVariants} className="card p-4 hover:border-primary-200 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary leading-tight">{new Date(exam.date).getDate()}</p>
                      <p className="text-xs text-primary font-semibold">{new Date(exam.date).toLocaleString('en-US', { month: 'short' })}</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === exam.id ? (
                      <div className="flex flex-col gap-1.5">
                        <input type="text" value={editData.title || ''} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="input-field !py-1.5 !text-sm" />
                        <input type="text" value={editData.subject || ''} onChange={(e) => setEditData({ ...editData, subject: e.target.value })} className="input-field !py-1.5 !text-sm" />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold text-neutral-800">{exam.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1"><MdSubject size={14} /> {exam.subject}</span>
                          <span className="flex items-center gap-1"><MdPerson size={14} /> {exam.batch}</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">{exam.time}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge ${exam.status === 'scheduled' ? 'badge-info' : 'badge-success'}`}>{exam.status}</span>
                    {editingId === exam.id ? (
                      <div className="flex flex-col gap-1">
                        <button onClick={() => handleSaveEdit(exam.id)} className="btn btn-primary btn-sm">Save</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(exam)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Edit"><MdEdit size={16} /></button>
                        <button onClick={() => handleDelete(exam.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete"><MdDelete size={16} /></button>
                        {exam.status === 'completed' ? (
                          <button className="btn btn-sm !bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100 !border-0">
                            <MdPublish size={14} /> Publish
                          </button>
                        ) : (
                          <button className="btn btn-sm !bg-amber-50 !text-amber-700 hover:!bg-amber-100 !border-0">
                            <MdRateReview size={14} /> Enter Marks
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
