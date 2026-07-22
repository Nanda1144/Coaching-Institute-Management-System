import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdGroup, MdAdd, MdEdit, MdDelete, MdPerson, MdSchool, MdPeople, MdSchedule } from 'react-icons/md'
import { useBatchList, useCreateBatch, useUpdateBatch, useDeleteBatch } from '../hooks/useReactQuery'
import { useToast } from '../contexts/ToastContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminBatchesPage() {
  const { showInfo } = useToast()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})

  const { data: batches, isLoading, isError, error, refetch } = useBatchList()
  const createBatch = useCreateBatch()
  const updateBatch = useUpdateBatch()
  const deleteBatch = useDeleteBatch()

  const batchList = Array.isArray(batches) ? batches : []

  const totalStudents = batchList.reduce((s: number, b: any) => s + (b.studentCount || 0), 0)
  const totalFaculty = batchList.reduce((s: number, b: any) => s + (b.facultyCount || 0), 0)

  const filtered = batchList.filter((b: any) => b.name?.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    const form = document.getElementById('create-batch-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    createBatch.mutate(data)
    setShowCreate(false)
  }

  const handleEdit = (b: any) => {
    setEditingId(b.id)
    setEditData({ name: b.name, department: b.department, year: b.year, schedule: b.schedule })
  }

  const handleSaveEdit = (id: string) => {
    updateBatch.mutate({ id, data: editData })
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure?')) deleteBatch.mutate(id)
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
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon !bg-danger-light !text-danger">!</div>
          <h3>Error loading batches</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load batches'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Batch Management</h1>
          <p>{batchList.length} active batches</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
          <MdAdd size={18} /> {showCreate ? 'Cancel' : 'Create Batch'}
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdGroup size={24} /></div>
          <div className="stat-value">{batchList.length}</div>
          <div className="stat-label">Total Batches</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdPeople size={24} /></div>
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-info-light text-info"><MdSchool size={24} /></div>
          <div className="stat-value">{totalFaculty}</div>
          <div className="stat-label">Total Faculty</div>
        </motion.div>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="card mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdGroup className="text-primary" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Create New Batch</h3>
              <p className="text-xs text-neutral-500">Set up a new batch with course details</p>
            </div>
          </div>
          <form id="create-batch-form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {['name', 'department', 'year', 'schedule'].map((f) => (
                <div className="input-group" key={f}>
                  <label>{f.replace(/^./, (s) => s.toUpperCase())}</label>
                  <input type="text" name={f} className="input-field" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="btn btn-primary" disabled={createBatch.isPending}>
                {createBatch.isPending ? 'Creating...' : 'Create Batch'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="card">
        <div className="relative mb-5">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input type="text" placeholder="Search batches..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MdGroup size={28} /></div>
            <h3>No batches found</h3>
            <p>Try adjusting your search or create a new batch to get started.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((b: any) => (
              <motion.div key={b.id} variants={itemVariants} className="card p-5 hover:border-primary-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><MdGroup className="text-primary" size={22} /></div>
                    <div>
                      {editingId === b.id ? (
                        <input type="text" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="input-field !py-1 !text-sm" />
                      ) : (
                        <>
                          <h3 className="font-semibold text-neutral-800 text-sm">{b.name}</h3>
                          <p className="text-xs text-neutral-400">{b.department} &bull; {b.year}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {editingId === b.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(b.id)} className="btn btn-primary btn-sm">Save</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(b)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50"><MdEdit size={15} /></button>
                        <button onClick={() => handleDelete(b.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light"><MdDelete size={15} /></button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-neutral-100 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5"><MdPerson size={15} className="text-neutral-400" /> {b.studentCount} Students</span>
                  <span className="flex items-center gap-1.5"><MdSchool size={15} className="text-neutral-400" /> {b.facultyCount} Faculty</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
                  <MdSchedule size={14} className="text-neutral-300" />
                  <span>{b.schedule}</span>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm flex-1" onClick={() => showInfo('Assign Students feature coming soon')}>Assign Students</button>
                  <button className="btn btn-secondary btn-sm flex-1" onClick={() => showInfo('Assign Faculty feature coming soon')}>Assign Faculty</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
