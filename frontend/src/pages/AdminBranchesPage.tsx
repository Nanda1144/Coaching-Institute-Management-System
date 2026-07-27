import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdSearch, MdBusiness, MdAdd, MdEdit, MdDelete, MdPeople, MdSchool, MdAttachMoney,
  MdCheckCircle, MdBlock, MdBarChart, MdTrendingUp, MdDateRange
} from 'react-icons/md'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import {
  useBranchList, useBranchAnalytics, useBranchAdmissionsTrend,
  useBranchRevenueTrend, useBranchAttendanceTrend,
  useCreateBranch, useUpdateBranch, useDeleteBranch, useToggleBranchStatus,
} from '../hooks/useReactQuery'
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function AdminBranchesPage() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})
  const [tab, setTab] = useState<'list' | 'analytics'>('list')

  const { data: branches, isLoading, isError, error, refetch } = useBranchList()
  const { isLoading: analyticsLoading } = useBranchAnalytics()
  const { data: admissionsTrend } = useBranchAdmissionsTrend()
  const { data: revenueTrend } = useBranchRevenueTrend()
  const { data: attendanceTrend } = useBranchAttendanceTrend()
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch()
  const deleteBranch = useDeleteBranch()
  const toggleStatus = useToggleBranchStatus()

  const branchList = Array.isArray(branches) ? branches : []
  const filtered = branchList.filter((b: any) => b.branchName?.toLowerCase().includes(search.toLowerCase()))

  const totalStudents = branchList.reduce((s: number, b: any) => s + (b.studentCount || 0), 0)
  const totalFaculty = branchList.reduce((s: number, b: any) => s + (b.facultyCount || 0), 0)
  const activeBranches = branchList.filter((b: any) => b.status === 'active').length

  const handleCreate = () => {
    const form = document.getElementById('create-branch-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    createBranch.mutate(data)
    setShowCreate(false)
  }

  const handleEdit = (b: any) => {
    setEditingId(b.id)
    setEditData({ branchName: b.branchName || '', branchCode: b.branchCode || '', city: b.city || '', contactNumber: b.contactNumber || '' })
  }

  const handleSaveEdit = (id: string) => {
    updateBranch.mutate({ id, data: editData })
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this branch permanently?')) deleteBranch.mutate(id)
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    toggleStatus.mutate({ id, status: newStatus })
  }

  const loading = isLoading || analyticsLoading

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div><div className="skeleton h-9 w-64 mb-2" /><div className="skeleton h-4 w-32" /></div>
          <div className="skeleton h-10 w-36 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (<div key={'sk' + i} className="skeleton h-28 rounded-xl" />))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (<div key={'sk' + i} className="skeleton h-44 rounded-xl" />))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon !bg-danger-light !text-danger">!</div>
          <h3>Error loading branches</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load branches'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Branch Management</h1>
          <p>{branchList.length} branches ({activeBranches} active)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab(tab === 'list' ? 'analytics' : 'list')} className="btn btn-secondary">
            <MdBarChart size={18} /> {tab === 'list' ? 'Analytics' : 'List'}
          </button>
          <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
            <MdAdd size={18} /> {showCreate ? 'Cancel' : 'Add Branch'}
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdBusiness size={24} /></div>
          <div className="stat-value">{branchList.length}</div>
          <div className="stat-label">Total Branches</div>
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
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdBusiness className="text-primary" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Add New Branch</h3>
              <p className="text-xs text-neutral-500">Enter branch details</p>
            </div>
          </div>
          <form id="create-branch-form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {['branchName', 'branchCode', 'address', 'city', 'state', 'contactPerson', 'contactNumber', 'email', 'maximumCapacity'].map((f) => (
                <div className="input-group" key={f}>
                  <label>{f.replace(/^./, (s) => s.toUpperCase()).replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input type={f === 'maximumCapacity' ? 'number' : 'text'} name={f} className="input-field" required={['branchName', 'branchCode', 'address', 'city', 'state', 'contactPerson', 'contactNumber'].includes(f)} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="btn btn-primary" disabled={createBranch.isPending}>
                {createBranch.isPending ? 'Creating...' : 'Create Branch'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {tab === 'list' ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="card">
          <div className="relative mb-5">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input type="text" placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MdBusiness size={28} /></div>
              <h3>No branches found</h3>
              <p>Try adjusting your search or add a new branch.</p>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((b: any) => (
                <motion.div key={b.id} variants={itemVariants} className="card p-5 hover:border-primary-200 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><MdBusiness className="text-primary" size={22} /></div>
                      <div>
                        {editingId === b.id ? (
                          <input type="text" value={editData.branchName || ''} onChange={(e) => setEditData({ ...editData, branchName: e.target.value })} className="input-field !py-1 !text-sm" />
                        ) : (
                          <>
                            <h3 className="font-semibold text-neutral-800 text-sm">{b.branchName}</h3>
                            <p className="text-xs text-neutral-400">{b.branchCode} &bull; {b.city}</p>
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
                          <button onClick={() => handleToggleStatus(b.id, b.status)} className="btn btn-ghost btn-sm !px-1.5" title={b.status === 'active' ? 'Deactivate' : 'Activate'}>
                            {b.status === 'active' ? <MdBlock size={15} className="text-warning" /> : <MdCheckCircle size={15} className="text-success" />}
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light"><MdDelete size={15} /></button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-4 mb-4 border-b border-neutral-100 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5"><MdPeople size={15} className="text-neutral-400" /> {b.studentCount || 0} Students</span>
                    <span className="flex items-center gap-1.5"><MdSchool size={15} className="text-neutral-400" /> {b.facultyCount || 0} Faculty</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <p className="flex items-center gap-1.5"><MdAttachMoney size={14} className="text-neutral-300" /> {b.contactPerson || 'N/A'}</p>
                    <p className="flex items-center gap-1.5"><MdDateRange size={14} className="text-neutral-300" /> Capacity: {b.maximumCapacity || 'Unlimited'}</p>
                  </div>

                  <div className="mt-3">
                    <span className={`badge ${b.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center"><MdTrendingUp className="text-primary" size={20} /></div>
                <div>
                  <h3 className="font-semibold text-neutral-800 text-sm">Admissions Trend</h3>
                  <p className="text-xs text-neutral-400">Monthly new admissions</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Array.isArray(admissionsTrend) ? admissionsTrend : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a0a0a0" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a0a0a0" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center"><MdAttachMoney className="text-success" size={20} /></div>
                <div>
                  <h3 className="font-semibold text-neutral-800 text-sm">Revenue Trend</h3>
                  <p className="text-xs text-neutral-400">Monthly fee collection</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={Array.isArray(revenueTrend) ? revenueTrend : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a0a0a0" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a0a0a0" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-info-light flex items-center justify-center"><MdPeople className="text-info" size={20} /></div>
                <div>
                  <h3 className="font-semibold text-neutral-800 text-sm">Attendance Trend</h3>
                  <p className="text-xs text-neutral-400">Monthly attendance %</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={Array.isArray(attendanceTrend) ? attendanceTrend : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a0a0a0" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a0a0a0" domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center"><MdBusiness className="text-purple-500" size={20} /></div>
                <div>
                  <h3 className="font-semibold text-neutral-800 text-sm">Branch Distribution</h3>
                  <p className="text-xs text-neutral-400">Students per branch</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={branchList.map((b: any) => ({ name: b.branchName || b.branchCode, value: b.studentCount || 0 }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                    {branchList.map((_: any, idx: number) => (<Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
