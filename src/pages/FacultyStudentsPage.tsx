import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdGroup, MdSearch, MdPerson } from 'react-icons/md'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

interface Student {
  id: string
  fullName: string
  email: string
  rollNumber: string
  department: string
  batch: string
  section: string
  status: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get('/students', { params: { batch: 'assigned' } })
      .then((res) => {
        const data = res.data?.data || res.data || []
        setStudents(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || 'Failed to load students')
        setStudents([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter((s) => {
    const matchesSearch = !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) || s.rollNumber?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return <LoadingSpinner text="Loading students..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-neutral-500 text-sm mt-1">View your assigned students</p>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="p-4 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger">{error}</motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="input-group flex-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
              </div>
            </div>
            <div className="input-group w-36">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select-field">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          {filtered.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon"><MdGroup size={28} /></div>
              <h3>No students found</h3>
              <p>{search ? 'Try a different search term' : 'No students are assigned to you yet'}</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Department</th>
                    <th>Batch</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-primary-50 flex items-center justify-center"><MdPerson className="text-primary" size={16} /></div>
                          <div><p className="font-medium text-neutral-800">{student.fullName}</p><p className="text-xs text-neutral-400">{student.email}</p></div>
                        </div>
                      </td>
                      <td className="text-neutral-600">{student.rollNumber}</td>
                      <td className="text-neutral-600">{student.department}</td>
                      <td className="text-neutral-600">{student.batch}</td>
                      <td>
                        <span className={`badge ${student.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{student.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 text-sm text-neutral-400 border-t border-neutral-100">Showing {filtered.length} of {students.length} students</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
