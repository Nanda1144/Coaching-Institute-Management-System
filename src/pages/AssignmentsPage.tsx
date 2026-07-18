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
      case 'active': return 'bg-emerald-100 text-emerald-700'
      case 'closed': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'archived': return 'bg-amber-100 text-amber-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  if (loading) return <LoadingSpinner text="Loading assignments..." />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
          <p className="text-sm text-gray-500 mt-1">Manage faculty assignments and workload</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
          <MdAdd size={18} /> New Assignment
        </button>
      </motion.div>

      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assignments..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-3">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-sm">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <MdAssignment size={28} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">{search ? 'No assignments match your search' : 'No assignments found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 hover:shadow-lg transition-all group flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md shrink-0">
                  <MdAssignment className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-800 truncate">{a.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{a.description || 'No description'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {a.status && <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${statusColor(a.status)}`}>{a.status}</span>}
                    {a.dueDate && <span className="text-xs text-gray-400">Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all shrink-0" aria-label="More options">
                <MdMoreVert size={18} className="text-gray-400" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
