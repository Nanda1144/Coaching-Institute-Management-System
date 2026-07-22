import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdPerson, MdAdd, MdEdit, MdDelete, MdPictureAsPdf, MdCreditCard, MdGroup, MdSchool, MdPeopleAlt } from 'react-icons/md'
import { useStudentList, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useReactQuery'

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
  const [showAssignBatch, setShowAssignBatch] = useState<string | null>(null)
  const [showAssignParent, setShowAssignParent] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})

  const { data: students, isLoading, isError, error, refetch } = useStudentList()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()

  const studentList = Array.isArray(students) ? students : []
  const departments = [...new Set(studentList.map((s: any) => s.department))]

  const activeStudents = studentList.filter((s: any) => s.status === 'Active').length
  const inactiveStudents = studentList.filter((s: any) => s.status === 'Inactive').length

  const filtered = studentList.filter((s: any) => {
    const matchSearch = !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) || s.rollNumber?.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'all' || s.department === filterDept
    return matchSearch && matchDept
  })

  const handleEdit = (s: any) => {
    setEditingId(s.id)
    setEditData({ fullName: s.fullName, rollNumber: s.rollNumber, email: s.email, department: s.department, batch: s.batch, year: s.year, parentName: s.parentName || '' })
  }

  const handleSaveEdit = (id: string) => {
    updateStudent.mutate({ id, data: editData })
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent.mutate(id)
    }
  }

  const handleCreate = () => {
    const form = document.getElementById('add-student-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    createStudent.mutate(data)
    setTab('list')
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
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <div className="skeleton h-10 w-full" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-14 mx-4 mb-2" />
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
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
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
                {['fullName', 'rollNumber', 'email', 'department', 'batch', 'year', 'parentName', 'phone', 'address'].map((field) => (
                  <div className="input-group" key={field}>
                    <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</label>
                    <input type="text" name={field} className="input-field" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button type="submit" className="btn btn-primary" disabled={createStudent.isPending}>
                  <MdAdd size={18} />{createStudent.isPending ? 'Creating...' : 'Create Student'}
                </button>
                <button type="button" onClick={() => setTab('list')} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Department</th>
                    <th>Batch</th>
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
                          {editingId === s.id ? (
                            <input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="input-field !py-1.5 !text-sm" />
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0"><MdPerson className="text-primary" size={18} /></div>
                              <div>
                                <p className="font-medium text-neutral-800 text-sm">{s.fullName}</p>
                                <p className="text-xs text-neutral-400">{s.email}</p>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="font-mono text-xs text-neutral-600">{s.rollNumber}</td>
                        <td><span className="text-sm text-neutral-700">{s.department}</span></td>
                        <td><span className="text-sm text-neutral-700">{s.batch}</span></td>
                        <td className="text-center">
                          <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Inactive' ? 'badge-neutral' : 'badge-warning'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-1.5">
                            {editingId === s.id ? (
                              <>
                                <button onClick={() => handleSaveEdit(s.id)} className="btn btn-primary btn-sm">Save</button>
                                <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(s)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Edit"><MdEdit size={16} /></button>
                                <button onClick={() => handleDelete(s.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete"><MdDelete size={16} /></button>
                                <button onClick={() => setShowAssignBatch(showAssignBatch === s.id ? null : s.id)} className="btn btn-ghost btn-sm !px-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50" title="Assign Batch"><MdGroup size={16} /></button>
                                <button onClick={() => setShowAssignParent(showAssignParent === s.id ? null : s.id)} className="btn btn-ghost btn-sm !px-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Assign Parent"><MdPerson size={16} /></button>
                                <button className="btn btn-ghost btn-sm !px-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Documents"><MdPictureAsPdf size={16} /></button>
                                <button className="btn btn-ghost btn-sm !px-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" title="ID Card"><MdCreditCard size={16} /></button>
                              </>
                            )}
                          </div>
                          {(showAssignBatch === s.id || showAssignParent === s.id) && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="mt-2">
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
