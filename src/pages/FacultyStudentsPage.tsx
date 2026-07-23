import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdGroup, MdSearch, MdPerson, MdRefresh, MdCheckCircle, MdCancel, MdHourglassEmpty } from 'react-icons/md'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

const TABS = [
  { key: 'all', label: 'All Students' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
]

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    Promise.all([
      api.get('/students', { params: { batch: 'assigned' } }).catch(() => ({ data: { data: [] } })),
      api.get('/faculty/registration-requests').catch(() => ({ data: { data: [] } })),
    ]).then(([studentsRes, registrationsRes]) => {
      const sRaw = studentsRes.data?.data ?? studentsRes.data ?? []
      setStudents(Array.isArray(sRaw) ? sRaw : Array.isArray(sRaw?.data) ? sRaw.data : [])
      const rRaw = registrationsRes.data?.data ?? registrationsRes.data ?? []
      setRegistrations(Array.isArray(rRaw) ? rRaw : Array.isArray(rRaw?.data) ? rRaw.data : [])
    }).catch((err) => {
      setError(err?.response?.data?.message || err?.message || 'Failed to load data')
    }).finally(() => setLoading(false))
  }, [])

  const handleAction = async (id: string, status: string) => {
    try {
      await api.patch(`/faculty/registration-requests/${id}`, { status })
      setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
      if (status === 'approved') {
        const updated = registrations.find((r) => r.id === id)
        if (updated) setStudents((prev) => [...prev, { ...updated, id: updated.studentId || updated.id, fullName: updated.fullName || updated.name, rollNumber: updated.rollNumber || '-', status: 'active' }])
      }
    } catch { /* silent */ }
  }

  const allItems = activeTab === 'all' ? students : activeTab === 'pending' ? registrations.filter((r) => r.status === 'pending' || !r.status) : activeTab === 'approved' ? [...students, ...registrations.filter((r) => r.status === 'approved')] : []

  const filtered = allItems.filter((s: any) => {
    const name = (s.fullName || s.name || '').toLowerCase()
    const roll = (s.rollNumber || s.rollNo || '').toLowerCase()
    const email = (s.email || '').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || roll.includes(q) || email.includes(q)
  })

  if (loading) return <LoadingSpinner text="Loading students..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-neutral-500 text-sm mt-1">View and manage your students, approve registrations</p>
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
          </div>
          <button onClick={() => window.location.reload()} className="btn btn-ghost btn-sm"><MdRefresh size={16} /> Refresh</button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          {filtered.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon"><MdGroup size={28} /></div>
              <h3>{search ? 'No students found' : 'No students to show'}</h3>
              <p>{search ? 'Try a different search term' : 'No students are assigned to you yet'}</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Roll No</th>
                    <th>Department</th>
                    <th>Batch</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s: any) => {
                    const isRegistration = !!s.studentId
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary-50 flex items-center justify-center"><MdPerson className="text-primary" size={16} /></div>
                            <div><p className="font-medium text-neutral-800">{s.fullName || s.name}</p><p className="text-xs text-neutral-400">{s.email}</p></div>
                          </div>
                        </td>
                        <td className="text-neutral-600 text-sm">{s.email}</td>
                        <td className="text-neutral-600 text-sm">{s.rollNumber || s.rollNo || '-'}</td>
                        <td className="text-neutral-600 text-sm">{s.department || '-'}</td>
                        <td className="text-neutral-600 text-sm">{s.batch || '-'}</td>
                        <td>
                          <span className={`badge ${s.status === 'active' || s.status === 'approved' ? 'badge-success' : s.status === 'rejected' ? 'badge-danger' : s.status === 'hold' ? 'badge-warning' : 'badge-info'}`}>
                            {s.status || 'pending'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {isRegistration && s.status !== 'approved' && (
                              <button onClick={() => handleAction(s.id, 'approved')} className="btn btn-sm btn-success flex items-center gap-1"><MdCheckCircle size={16} /> Approve</button>
                            )}
                            {isRegistration && s.status !== 'rejected' && (
                              <button onClick={() => handleAction(s.id, 'rejected')} className="btn btn-sm btn-danger flex items-center gap-1"><MdCancel size={16} /> Reject</button>
                            )}
                            {isRegistration && (
                              <button onClick={() => handleAction(s.id, 'hold')} className="btn btn-sm btn-ghost flex items-center gap-1"><MdHourglassEmpty size={16} /> Hold</button>
                            )}
                            {!isRegistration && (
                              <span className="text-xs text-neutral-400">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="px-4 py-3 text-sm text-neutral-400 border-t border-neutral-100">Showing {filtered.length} of {allItems.length} records</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
