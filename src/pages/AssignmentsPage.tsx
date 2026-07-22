import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAssignment, MdSearch, MdAdd, MdMoreVert } from 'react-icons/md'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate?: string
  status?: string
  subject?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/assignments')
        setAssignments(res.data?.data || [])
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          setError(err?.response?.data?.message || 'Failed to load assignments')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (s?: string) => {
    switch (s) {
      case 'active': return 'badge-success'
      case 'closed': return 'badge-neutral'
      case 'cancelled': return 'badge-danger'
      case 'archived': return 'badge-warning'
      default: return 'badge-info'
    }
  }

  if (loading) return <LoadingSpinner text="Loading assignments..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-neutral-500 text-sm mt-1">Manage faculty assignments and workload</p>
          </div>
          <button className="btn btn-primary">
            <MdAdd size={18} /> New Assignment
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="input-field pl-10"
          />
        </motion.div>

        {error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon bg-danger-light text-danger flex items-center justify-center">
              <span className="text-danger text-xl font-bold">!</span>
            </div>
            <h3>{error}</h3>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Retry
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdAssignment size={28} /></div>
            <h3>{search ? 'No assignments match your search' : 'No assignments found'}</h3>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-3">
            {filtered.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-5 hover:shadow-card-hover group flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md shrink-0">
                    <MdAssignment className="text-white" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-neutral-800 truncate">{a.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{a.description || 'No description'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {a.status && <span className={`badge ${statusColor(a.status)}`}>{a.status}</span>}
                      {a.dueDate && <span className="text-xs text-neutral-400">Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-all shrink-0" aria-label="More options">
                  <MdMoreVert size={18} className="text-neutral-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
