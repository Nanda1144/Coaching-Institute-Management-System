import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdPerson, MdAdd, MdEdit, MdDelete, MdCreditCard, MdGroup, MdSchool, MdPeopleAlt, MdClose, MdViewModule, MdTableView, MdArrowBack } from 'react-icons/md'
import { useStudentList, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useReactQuery'
import api from '../services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [tab, setTab] = useState<'list' | 'add'>('list')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showAssignBatch, setShowAssignBatch] = useState<string | null>(null)
  const [showAssignParent, setShowAssignParent] = useState<string | null>(null)
  const [showIdCard, setShowIdCard] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deptOptions, setDeptOptions] = useState<string[]>([])

  useEffect(() => {
    api.get('/references/departments').then((res) => {
      const depts: any[] = res.data?.data ?? []
      setDeptOptions(depts.map((d: any) => d.name))
    }).catch(() => {})
  }, [])

  const { data: students, isLoading, isError, error, refetch } = useStudentList()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()

  const studentList = Array.isArray(students) ? students : []
  const departments = [...new Set(studentList.map((s: any) => s.department))]

  const activeStudents = studentList.filter((s: any) => s.status?.toLowerCase() === 'active').length
  const inactiveStudents = studentList.filter((s: any) => s.status?.toLowerCase() === 'inactive').length

  const filtered = studentList.filter((s: any) => {
    const matchSearch = !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) || s.rollNumber?.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'all' || s.department === filterDept
    return matchSearch && matchDept
  })

  const handleEdit = (s: any) => {
    toggleExpand(s.id)
    setEditData({ fullName: s.fullName, rollNumber: s.rollNumber, email: s.email, department: s.department, batch: s.batch, year: s.year, parentName: s.parentName || '', status: s.status || 'Active' })
  }

  const toggleExpand = (id: string) => {
    if (editingId === id) { setEditingId(null); return }
    setEditingId(id)
    setShowAssignBatch(null); setShowAssignParent(null); setShowIdCard(null)
  }

  const handleSaveEdit = (id: string) => {
    updateStudent.mutate({ id, data: editData }, { onSuccess: () => { setEditingId(null); setEditData({}) } })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent.mutate(id)
    }
  }

  const handleCreate = () => {
    const form = document.getElementById('add-student-form') as HTMLFormElement
    if (!form) return
    const data: Record<string, unknown> = {}
    const errors: Record<string, string> = {}
    for (const [key, value] of new FormData(form).entries()) {
      if (value !== '') data[key] = value
    }
    const phone = String(data.phone || '')
    if (phone && phone.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits'
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    createStudent.mutate(data, {
      onSuccess: () => setTab('list'),
    })
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
          <div className="p-4 border-b border-neutral-100">
            <div className="skeleton h-10 w-full" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={'sk' + i} className="skeleton h-14 mx-4 mb-2" />
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
          <h3>Error loading students</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load students'}</p>
          <div className="flex gap-2">
            <button onClick={() => window.history.back()} className="btn btn-ghost"><MdArrowBack size={16} /> Back</button>
            <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Student Management</h1>
          <p>{studentList.length} total students</p>
        </div>
        <button onClick={() => setTab('add')} className="btn btn-primary">
          <MdAdd size={18} /> Add Student
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdSchool size={24} /></div>
          <div className="stat-value">{studentList.length}</div>
          <div className="stat-label">Total Students</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdPeopleAlt size={24} /></div>
          <div className="stat-value">{activeStudents}</div>
          <div className="stat-label">Active Students</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-neutral-100 text-neutral-500"><MdPerson size={24} /></div>
          <div className="stat-value">{inactiveStudents}</div>
          <div className="stat-label">Inactive Students</div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input type="text" placeholder="Search by name or roll number..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="select-field sm:w-48">
            <option value="all">All Departments</option>
            {departments.map((d: any) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 self-stretch">
            <button className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`} onClick={() => setViewMode('grid')} title="Grid view"><MdViewModule size={18} /></button>
            <button className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`} onClick={() => setViewMode('list')} title="List view"><MdTableView size={18} /></button>
          </div>
        </div>

        {tab === 'add' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="py-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
                <MdPerson className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Add New Student</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Fill in the details below to register a new student</p>
            </div>
            <form id="add-student-form" className="max-w-3xl mx-auto" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {['fullName', 'rollNumber', 'email', 'batch', 'year', 'parentName', 'phone', 'address'].map((field) => (
                  <div className="input-group" key={field}>
                    <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      name={field}
                      className={`input-field${formErrors[field] ? ' !border-danger !ring-danger/20' : ''}`}
                      maxLength={field === 'phone' ? 10 : undefined}
                      onChange={() => { if (formErrors[field]) setFormErrors({ ...formErrors, [field]: '' }) }}
                    />
                    {formErrors[field] && <p className="text-xs text-danger mt-1">{formErrors[field]}</p>}
                  </div>
                ))}
                <div className="input-group">
                  <label>Department</label>
                  <select name="department" className={`select-field${formErrors.department ? ' !border-danger !ring-danger/20' : ''}`} onChange={() => { if (formErrors.department) setFormErrors({ ...formErrors, department: '' }) }}>
                    <option value="">Select department...</option>
                    {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {formErrors.department && <p className="text-xs text-danger mt-1">{formErrors.department}</p>}
                </div>
              </div>
              <p className="text-xs text-neutral-400 text-center mb-4">Roll number, email, and phone must be unique across all students.</p>
              <div className="flex items-center justify-center gap-3">
                <button type="submit" className="btn btn-primary" disabled={createStudent.isPending}>
                  <MdAdd size={18} />{createStudent.isPending ? 'Creating...' : 'Create Student'}
                </button>
                <button type="button" onClick={() => setTab('list')} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full">
                <div className="empty-state !py-12">
                  <div className="empty-state-icon"><MdPerson size={28} /></div>
                  <h3>No students found</h3>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              </div>
            ) : (
              filtered.map((s: any) => (
                <motion.div key={s.id} variants={itemVariants} className="card overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {s.profileImage ? (
                        <img src={s.profileImage} alt={s.fullName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0"><MdPerson className="text-primary" size={20} /></div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-800 text-sm truncate">{s.fullName}</p>
                        <p className="text-xs text-neutral-400 truncate">{s.rollNumber}</p>
                      </div>
                      <span className={`badge ml-auto ${s.status?.toLowerCase() === 'active' ? 'badge-success' : s.status?.toLowerCase() === 'inactive' ? 'badge-neutral' : 'badge-warning'}`}>{s.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 mb-3">
                      <div><span className="text-neutral-400">Dept:</span> {s.department || '—'}</div>
                      <div><span className="text-neutral-400">Batch:</span> {s.batch || '—'}</div>
                      <div className="col-span-2"><span className="text-neutral-400">Email:</span> {s.email || '—'}</div>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-neutral-100">
                      <button onClick={() => handleEdit(s)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Edit"><MdEdit size={15} /></button>
                      <button onClick={() => handleDelete(s.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete"><MdDelete size={15} /></button>
                      <button onClick={() => { setShowIdCard(showIdCard === s.id ? null : s.id); setShowAssignBatch(null); setShowAssignParent(null) }} className="btn btn-ghost btn-sm !px-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" title="ID Card"><MdCreditCard size={15} /></button>
                    </div>
                  </div>
                  {(showIdCard === s.id || editingId === s.id) && (
                    <motion.div
                      key={showIdCard === s.id ? 'idcard' : 'edit'}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top"
                    >
                      {showIdCard === s.id && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-indigo-700">ID Card</p>
                              <button onClick={() => setShowIdCard(null)} className="text-indigo-400 hover:text-indigo-600"><MdClose size={14} /></button>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-indigo-100">
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-50">
                                {s.profileImage ? (
                                  <img src={s.profileImage} alt={s.fullName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">{s.fullName?.charAt(0)?.toUpperCase() || 'S'}</div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-neutral-800 truncate">{s.fullName}</p>
                                  <p className="text-[9px] text-indigo-500">{s.rollNumber}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-[9px]">
                                <div><span className="text-neutral-400">Dept:</span> <span className="font-medium text-neutral-700">{s.department || '—'}</span></div>
                                <div><span className="text-neutral-400">Batch:</span> <span className="font-medium text-neutral-700">{s.batch || '—'}</span></div>
                                <div className="col-span-2"><span className="text-neutral-400">Email:</span> <span className="font-medium text-neutral-700">{s.email || '—'}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {editingId === s.id && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                            <p className="text-xs font-semibold text-blue-700 mb-2">Edit {s.fullName}</p>
                            <input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="input-field !text-sm mb-2" placeholder="Full name" />
                            <select className="select-field !text-sm mb-2" value={(editData.status || s.status || 'Active')?.toLowerCase() === 'active' ? 'Active' : 'Inactive'} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => handleSaveEdit(s.id)} className="btn btn-primary btn-sm flex-1">Save</button>
                              <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="table-container min-w-[640px] sm:min-w-0">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th className="hidden sm:table-cell">Department</th>
                    <th className="hidden md:table-cell">Batch</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state !py-12">
                          <div className="empty-state-icon"><MdPerson size={28} /></div>
                          <h3>No students found</h3>
                          <p>Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s: any) => (
                      <tr key={s.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0"><MdPerson className="text-primary" size={18} /></div>
                            <div>
                              <p className="font-medium text-neutral-800 text-sm">{s.fullName}</p>
                              <p className="text-xs text-neutral-400">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="font-mono text-xs text-neutral-600">{s.rollNumber}</span></td>
                        <td className="hidden sm:table-cell"><span className="text-sm text-neutral-700">{s.department}</span></td>
                        <td className="hidden md:table-cell"><span className="text-sm text-neutral-700">{s.batch}</span></td>
                        <td className="text-center">
                          <span className={`badge ${s.status?.toLowerCase() === 'active' ? 'badge-success' : s.status?.toLowerCase() === 'inactive' ? 'badge-neutral' : 'badge-warning'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleEdit(s)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Edit"><MdEdit size={16} /></button>
                            <button onClick={() => handleDelete(s.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete"><MdDelete size={16} /></button>
                            <button onClick={() => { setShowAssignBatch(showAssignBatch === s.id ? null : s.id); setShowAssignParent(null); setShowIdCard(null) }} className="btn btn-ghost btn-sm !px-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50" title="Assign Batch"><MdGroup size={16} /></button>
                            <button onClick={() => { setShowAssignParent(showAssignParent === s.id ? null : s.id); setShowAssignBatch(null); setShowIdCard(null) }} className="btn btn-ghost btn-sm !px-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Assign Parent"><MdPerson size={16} /></button>
                            <button onClick={() => { setShowIdCard(showIdCard === s.id ? null : s.id); setShowAssignBatch(null); setShowAssignParent(null) }} className="btn btn-ghost btn-sm !px-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" title="ID Card"><MdCreditCard size={16} /></button>
                          </div>
                          {(showAssignBatch === s.id || showAssignParent === s.id || showIdCard === s.id || editingId === s.id) && (
                            <motion.div
                              key={showIdCard === s.id ? 'idcard' : showAssignBatch === s.id ? 'batch' : showAssignParent === s.id ? 'parent' : 'edit'}
                              initial={{ opacity: 0, height: 0, scale: 0.95 }}
                              animate={{ opacity: 1, height: 'auto', scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="mt-2 origin-top"
                            >
                              {showIdCard === s.id && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg max-w-xs mx-auto">
                                  <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-indigo-700">Student ID Card</p>
                                    <button onClick={() => setShowIdCard(null)} className="text-indigo-400 hover:text-indigo-600"><MdClose size={16} /></button>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-inner">
                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-indigo-50">
                                      {s.profileImage ? (
                                        <img src={s.profileImage} alt={s.fullName} className="w-12 h-12 rounded-full object-cover shrink-0 shadow-md" />
                                      ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                                          {s.fullName?.charAt(0)?.toUpperCase() || 'S'}
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="font-bold text-sm text-neutral-800 truncate">{s.fullName}</p>
                                        <p className="text-[10px] text-indigo-500 font-medium">{s.rollNumber}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                      <div><span className="text-neutral-400">Dept:</span> <span className="font-medium text-neutral-700">{s.department || '—'}</span></div>
                                      <div><span className="text-neutral-400">Batch:</span> <span className="font-medium text-neutral-700">{s.batch || '—'}</span></div>
                                      <div><span className="text-neutral-400">Email:</span> <span className="font-medium text-neutral-700 truncate block">{s.email || '—'}</span></div>
                                      <div><span className="text-neutral-400">Year:</span> <span className="font-medium text-neutral-700">{s.year || '—'}</span></div>
                                    </div>
                                  </div>
                                  <p className="text-[8px] text-indigo-400 text-center mt-2">Institution ID Card · Valid for current academic year</p>
                                </div>
                              )}
                              {showAssignBatch === s.id && (
                                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                                  <p className="text-xs font-semibold text-purple-700 mb-2">Assign Batch for {s.fullName}</p>
                                  <select className="select-field !text-xs bg-white mb-2">
                                    <option>Select batch...</option>
                                    <option>CSE-A</option><option>CSE-B</option><option>CSE-C</option>
                                  </select>
                                  <button className="btn btn-sm !bg-purple-600 !text-white hover:!bg-purple-700" onClick={() => { updateStudent.mutate({ id: s.id, data: { batch: 'CSE-A' } }); setShowAssignBatch(null) }}>Save</button>
                                </div>
                              )}
                              {showAssignParent === s.id && (
                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                                  <p className="text-xs font-semibold text-amber-700 mb-2">Link Parent for {s.fullName}</p>
                                  <select className="select-field !text-xs bg-white mb-2">
                                    <option>Select parent...</option>
                                    <option>{s.parentName}</option>
                                    <option>Other parent...</option>
                                  </select>
                                  <button className="btn btn-sm !bg-amber-600 !text-white hover:!bg-amber-700" onClick={() => setShowAssignParent(null)}>Link</button>
                                </div>
                              )}
                              {editingId === s.id && (
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 max-w-sm mx-auto">
                                  <p className="text-xs font-semibold text-blue-700 mb-2">Edit {s.fullName}</p>
                                  <div className="space-y-2">
                                    <input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="input-field !text-sm" placeholder="Full name" />
                                    <select className="select-field !text-sm" value={(editData.status || s.status || 'Active')?.toLowerCase() === 'active' ? 'Active' : 'Inactive'} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                                      <option value="Active">Active</option>
                                      <option value="Inactive">Inactive</option>
                                    </select>
                                  </div>
                                  <div className="flex gap-2 mt-3">
                                    <button onClick={() => handleSaveEdit(s.id)} className="btn btn-primary btn-sm flex-1">Save</button>
                                    <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
