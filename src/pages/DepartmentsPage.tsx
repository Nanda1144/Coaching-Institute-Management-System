import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdSchool, MdSearch, MdAdd, MdMoreVert } from 'react-icons/md'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'

interface Department {
  id: string
  name: string
  code: string
  facultyCount?: number
  courseCount?: number
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/departments')
        setDepartments(res.data?.data || [])
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          setError(err?.response?.data?.message || 'Failed to load departments')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner text="Loading departments..." />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all academic departments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
          <MdAdd size={18} /> Add Department
        </button>
      </motion.div>

      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search departments..."
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
            <MdSchool size={28} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">{search ? 'No departments match your search' : 'No departments found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <MdSchool className="text-white" size={20} />
                </div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all" aria-label="More options">
                  <MdMoreVert size={18} className="text-gray-400" />
                </button>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">{dept.name}</h3>
              <p className="text-xs font-mono text-gray-400 uppercase mb-3">{dept.code}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span>{dept.facultyCount ?? 0} Faculty</span>
                <span>{dept.courseCount ?? 0} Courses</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
