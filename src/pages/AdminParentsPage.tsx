import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdPerson, MdAdd, MdEdit, MdDelete, MdLink, MdPeople, MdEmail } from 'react-icons/md'
import { useParentList, useCreateParent, useUpdateParent, useDeleteParent } from '../hooks/useReactQuery'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminParentsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'list' | 'add'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})

  const { data: parents, isLoading, isError, error, refetch } = useParentList()
  const createParent = useCreateParent()
  const updateParent = useUpdateParent()
  const deleteParent = useDeleteParent()

  const parentList = Array.isArray(parents) ? parents : []

  const linkedParents = parentList.filter((p: any) => p.linkedStudent).length

  const filtered = parentList.filter((p: any) => !search || p.fullName?.toLowerCase().includes(search.toLowerCase()) || p.linkedStudent?.toLowerCase().includes(search.toLowerCase()))

  const handleEdit = (p: any) => {
    setEditingId(p.id)
    setEditData({ fullName: p.fullName, email: p.email, phone: p.phone, linkedStudent: p.linkedStudent })
  }

  const handleSaveEdit = (id: string) => {
    updateParent.mutate({ id, data: editData })
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      deleteParent.mutate(id)
    }
  }

  const handleCreate = () => {
    const form = document.getElementById('add-parent-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    createParent.mutate(data)
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
          {Array.from({ length: 4 }).map((_, i) => (
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
          <h3>Error loading parents</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load parents'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Parent Management</h1>
          <p>{parentList.length} registered parents</p>
        </div>
        <button onClick={() => setTab('add')} className="btn btn-primary">
          <MdAdd size={18} /> Add Parent
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdPeople size={24} /></div>
          <div className="stat-value">{parentList.length}</div>
          <div className="stat-label">Total Parents</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdLink size={24} /></div>
          <div className="stat-value">{linkedParents}</div>
          <div className="stat-label">Linked to Students</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-info-light text-info"><MdEmail size={24} /></div>
          <div className="stat-value">{parentList.length - linkedParents}</div>
          <div className="stat-label">Unlinked</div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="card">
        <div className="relative mb-5">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input type="text" placeholder="Search by parent or student name..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        {tab === 'add' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="py-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
                <MdPerson className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Add New Parent</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Fill in the details below to register a new parent</p>
            </div>
            <form id="add-parent-form" className="max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {['fullName', 'email', 'phone', 'address', 'linkedStudent'].map((field) => (
                  <div className="input-group" key={field}>
                    <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</label>
                    <input type="text" name={field} className="input-field" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button type="submit" className="btn btn-primary" disabled={createParent.isPending}>
                  <MdAdd size={18} />{createParent.isPending ? 'Creating...' : 'Create Parent'}
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
                    <th>Parent</th>
                    <th>Email / Phone</th>
                    <th>Linked Student</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-state !py-12">
                          <div className="empty-state-icon"><MdPeople size={28} /></div>
                          <h3>No parents found</h3>
                          <p>Try adjusting your search or add a new parent to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p: any) => (
                      <tr key={p.id}>
                        <td>
                          {editingId === p.id ? (
                            <input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="input-field !py-1.5 !text-sm" />
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0"><MdPerson className="text-primary" size={18} /></div>
                              <span className="font-medium text-neutral-800 text-sm">{p.fullName}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {editingId === p.id ? (
                            <div className="flex flex-col gap-1.5">
                              <input type="text" value={editData.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="input-field !py-1.5 !text-sm" />
                              <input type="text" value={editData.phone || ''} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="input-field !py-1.5 !text-sm" />
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-neutral-700">{p.email}</p>
                              <p className="text-xs text-neutral-400 mt-0.5">{p.phone}</p>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {p.linkedStudent ? (
                              <>
                                <span className="badge badge-info">{p.linkedStudent}</span>
                                <span className="text-xs text-neutral-400">{p.linkedRoll}</span>
                              </>
                            ) : (
                              <span className="badge badge-neutral">Not linked</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {editingId === p.id ? (
                              <>
                                <button onClick={() => handleSaveEdit(p.id)} className="btn btn-primary btn-sm">Save</button>
                                <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(p)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Edit"><MdEdit size={16} /></button>
                                <button onClick={() => handleDelete(p.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete"><MdDelete size={16} /></button>
                                <button className="btn btn-ghost btn-sm !px-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Link to another student"><MdLink size={16} /></button>
                              </>
                            )}
                          </div>
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
