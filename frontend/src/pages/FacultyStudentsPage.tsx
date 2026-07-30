import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdGroup, MdSearch, MdPerson, MdRefresh, MdCheckCircle, MdCancel,
  MdViewModule, MdTableView, MdClose, MdInfo,
  MdSchool, MdEmail, MdPhone, MdMessage, MdBook,
} from 'react-icons/md'
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
  { key: 'rejected', label: 'Rejected' },
]

const STATUS_BADGE: Record<string, string> = {
  active: 'badge-success',
  approved: 'badge-success',
  rejected: 'badge-danger',
  hold: 'badge-warning',
  pending: 'badge-info',
}

function getStatusBadge(status: string): string {
  return STATUS_BADGE[status?.toLowerCase()] || 'badge-info'
}

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const [modal, setModal] = useState<{ type: 'approve' | 'reject'; request: any } | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15

  const loadData = () => {
    setLoading(true)
    setError('')
    Promise.all([
      api.get('/students', { params: { batch: 'assigned' } }).catch((e) => { console.warn('Failed to load assigned students:', e); return { data: { data: [] } } }),
      api.get('/faculty/registration-requests').catch((e) => { console.warn('Failed to load registration requests:', e); return { data: { data: [] } } }),
      api.get('/faculty/batches').catch((e) => { console.warn('Failed to load batches:', e); return { data: { data: [] } } }),
    ]).then(([studentsRes, registrationsRes, batchesRes]) => {
      const sRaw = studentsRes.data?.data ?? studentsRes.data ?? []
      setStudents(Array.isArray(sRaw) ? sRaw : Array.isArray(sRaw?.data) ? sRaw.data : [])
      const rRaw = registrationsRes.data?.data ?? registrationsRes.data ?? []
      setRegistrations(Array.isArray(rRaw) ? rRaw : Array.isArray(rRaw?.data) ? rRaw.data : [])
      const bRaw = batchesRes.data?.data ?? batchesRes.data ?? []
      setBatches(Array.isArray(bRaw) ? bRaw : Array.isArray(bRaw?.data) ? bRaw.data : [])
    }).catch((err) => {
      setError(err?.response?.data?.message || err?.message || 'Failed to load data')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => { setPage(1) }, [search, activeTab])

  const openApprove = (request: any) => {
    setSelectedBatchId(request.batchId || request.batchId || (batches.length > 0 ? batches[0].id : ''))
    setModal({ type: 'approve', request })
  }

  const openReject = (request: any) => {
    setRejectReason(request.remarks || '')
    setModal({ type: 'reject', request })
  }

  const confirmAction = async () => {
    if (!modal) return
    setActionLoading(true)
    try {
      const body: any = { status: modal.type === 'approve' ? 'APPROVED' : 'REJECTED' }
      if (modal.type === 'approve' && selectedBatchId) {
        body.batchId = selectedBatchId
      }
      if (modal.type === 'reject' && rejectReason.trim()) {
        body.remarks = rejectReason.trim()
      }
      const res = await api.patch(`/faculty/registration-requests/${modal.request.id}`, body)
      const updated = res.data?.data || modal.request
      setRegistrations((prev) => prev.map((r) => r.id === modal.request.id ? { ...r, ...updated, status: modal.type === 'approve' ? 'approved' : 'rejected', remarks: modal.type === 'reject' ? rejectReason.trim() : r.remarks } : r))
      if (modal.type === 'approve') {
        const r = modal.request
        setStudents((prev) => [...prev, {
          ...r,
          id: updated.studentId || updated.id || r.studentId || r.id,
          fullName: r.fullName || r.name,
          rollNumber: updated.rollNumber || r.rollNumber || '-',
          department: r.department,
          batch: batches.find((b) => b.id === selectedBatchId)?.batchName || r.batch || '',
          batchId: selectedBatchId,
          status: 'active',
        }])
      }
      setModal(null)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  const allItems = (() => {
    switch (activeTab) {
      case 'pending': return registrations.filter((r) => r.status === 'PENDING' || r.status === 'pending' || !r.status)
      case 'approved': return [
        ...students,
        ...registrations.filter((r) => r.status === 'APPROVED' || r.status === 'approved'),
      ]
      case 'rejected': return registrations.filter((r) => r.status === 'REJECTED' || r.status === 'rejected')
      default: return [...students, ...registrations.filter((r) => r.status === 'PENDING' || r.status === 'pending' || !r.status)]
    }
  })()

  const deduped = allItems.filter((item, index, self) => {
    const key = item.id || item.email || ''
    return index === self.findIndex((t) => (t.id || t.email || '') === key)
  })

  const filtered = deduped.filter((s: any) => {
    const name = (s.fullName || s.name || '').toLowerCase()
    const roll = (s.rollNumber || s.rollNo || '').toLowerCase()
    const email = (s.email || '').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || roll.includes(q) || email.includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isRegistration = (s: any) => !!s.studentId || !!s.preferredFacultyId

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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 p-0.5 bg-neutral-100 rounded-lg">
              <button className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`} onClick={() => setViewMode('list')} title="List view"><MdTableView size={18} /></button>
              <button className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`} onClick={() => setViewMode('grid')} title="Grid view"><MdViewModule size={18} /></button>
            </div>
            <button onClick={loadData} className="btn btn-ghost btn-sm"><MdRefresh size={16} /> Refresh</button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          {paginated.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon"><MdGroup size={28} /></div>
              <h3>{search ? 'No students found' : 'No students to show'}</h3>
              <p>{search ? 'Try a different search term' : 'No students are assigned to you yet'}</p>
            </div>
          ) : viewMode === 'list' ? (
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
                  {paginated.map((s: any) => {
                    const reg = isRegistration(s)
                    return (
                      <tr key={s.id + (s.studentId || '')}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary-50 flex items-center justify-center"><MdPerson className="text-primary" size={16} /></div>
                            <div>
                              <p className="font-medium text-neutral-800">{s.fullName || s.name}</p>
                              {s.remarks && (s.status === 'REJECTED' || s.status === 'rejected') && (
                                <p className="text-xs text-danger mt-0.5 flex items-center gap-1"><MdInfo size={12} /> {s.remarks}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-neutral-600 text-sm">{s.email}</td>
                        <td className="text-neutral-600 text-sm">{s.rollNumber || s.rollNo || '-'}</td>
                        <td className="text-neutral-600 text-sm">{s.department || '-'}</td>
                        <td className="text-neutral-600 text-sm">{s.batch || '-'}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(s.status)}`}>{s.status || 'pending'}</span>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {reg && (s.status === 'PENDING' || s.status === 'pending' || !s.status) && (
                              <>
                                <button onClick={() => openApprove(s)} className="btn btn-sm btn-success flex items-center gap-1"><MdCheckCircle size={16} /> Approve</button>
                                <button onClick={() => openReject(s)} className="btn btn-sm btn-danger flex items-center gap-1"><MdCancel size={16} /> Reject</button>
                              </>
                            )}
                            {reg && (s.status !== 'PENDING' && s.status !== 'pending' && s.status) && (
                              <span className="text-xs text-neutral-400">Processed</span>
                            )}
                            {!reg && (
                              <span className="text-xs text-neutral-400">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-4 py-3 text-sm text-neutral-400 border-t border-neutral-100">
                <span>Showing {paginated.length} of {filtered.length} records</span>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-ghost btn-sm px-3">Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50'}`}>{p}</button>
                    ))}
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-ghost btn-sm px-3">Next</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((s: any) => {
                const reg = isRegistration(s)
                const pending = s.status === 'PENDING' || s.status === 'pending' || !s.status
                return (
                  <motion.div
                    key={s.id + (s.studentId || '')}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {(s.fullName || s.name || 'S').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-800">{s.fullName || s.name}</p>
                          <p className="text-xs text-neutral-400 flex items-center gap-1"><MdEmail size={12} /> {s.email}</p>
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(s.status)}`}>{s.status || 'pending'}</span>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-600 mb-4">
                      <p className="flex items-center gap-2"><MdSchool size={14} className="text-neutral-400" /> {s.department || '-'}</p>
                      <p className="flex items-center gap-2"><MdBook size={14} className="text-neutral-400" /> Batch: {s.batch || '-'}</p>
                      <p className="flex items-center gap-2"><MdPhone size={14} className="text-neutral-400" /> Roll: {s.rollNumber || s.rollNo || '-'}</p>
                    </div>
                    {s.remarks && (
                      <div className="mb-3 p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 flex items-start gap-1.5">
                        <MdMessage size={14} className="mt-0.5 shrink-0 text-neutral-400" />
                        <span>{s.remarks}</span>
                      </div>
                    )}
                    {reg && pending && (
                      <div className="flex gap-2 pt-3 border-t border-neutral-100">
                        <button onClick={() => openApprove(s)} className="flex-1 btn btn-sm btn-success flex items-center justify-center gap-1"><MdCheckCircle size={15} /> Approve</button>
                        <button onClick={() => openReject(s)} className="flex-1 btn btn-sm btn-danger flex items-center justify-center gap-1"><MdCancel size={15} /> Reject</button>
                      </div>
                    )}
                    {reg && !pending && (
                      <div className="pt-3 border-t border-neutral-100 text-center text-xs text-neutral-400">Already processed</div>
                    )}
                    {!reg && (
                      <div className="pt-3 border-t border-neutral-100 text-center text-xs text-success font-medium flex items-center justify-center gap-1"><MdCheckCircle size={14} /> Enrolled</div>
                    )}
                  </motion.div>
                )
              })}
              {totalPages > 1 && (
                <div className="col-span-full flex items-center justify-center gap-2 pt-4">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-ghost btn-sm px-3">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50'}`}>{p}</button>
                  ))}
                  <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-ghost btn-sm px-3">Next</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-800">
                  {modal.type === 'approve' ? 'Approve Registration' : 'Reject Registration'}
                </h2>
                <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400"><MdClose size={20} /></button>
              </div>

              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-neutral-50">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center"><MdPerson className="text-primary-600" size={18} /></div>
                <div>
                  <p className="font-medium text-neutral-800">{modal.request.fullName || modal.request.name}</p>
                  <p className="text-xs text-neutral-500">{modal.request.email}</p>
                </div>
              </div>

              {modal.type === 'approve' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Assign to Batch</label>
                    {batches.length > 0 ? (
                      <select
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        className="select-field w-full"
                      >
                        {batches.map((b: any) => (
                          <option key={b.id} value={b.id}>{b.batchName || b.name} ({b.batchCode || b.code || ''})</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-amber-600">You have no assigned batches. Student will be created without batch assignment.</p>
                    )}
                  </div>
                  <button
                    onClick={confirmAction}
                    disabled={actionLoading}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Processing...' : <><MdCheckCircle size={18} /> Approve & Assign</>}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Rejection Reason</label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide a reason for rejection..."
                      rows={3}
                      className="input-field w-full resize-none"
                    />
                    <p className="text-xs text-neutral-400 mt-1">This reason will be sent to the student.</p>
                  </div>
                  <button
                    onClick={confirmAction}
                    disabled={actionLoading}
                    className="btn btn-danger w-full flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Processing...' : <><MdCancel size={18} /> Reject{rejectReason.trim() ? ' with Reason' : ''}</>}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
