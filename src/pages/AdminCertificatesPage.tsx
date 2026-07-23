import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdSearch, MdSchool, MdAdd, MdEdit, MdDelete, MdDownload, MdPreview, MdMilitaryTech, MdCalendarToday
} from 'react-icons/md'
import {
  useCertificateList, useCreateCertificate, useUpdateCertificate, useDeleteCertificate,
} from '../hooks/useReactQuery'
import { useToast } from '../contexts/ToastContext'
import certificateService from '../services/certificate/certificate.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminCertificatesPage() {
  const { showInfo } = useToast()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})
  const [previewId, setPreviewId] = useState<string | null>(null)

  const { data: certificates, isLoading, isError, error, refetch } = useCertificateList()
  const createCert = useCreateCertificate()
  const updateCert = useUpdateCertificate()
  const deleteCert = useDeleteCertificate()

  const certList = Array.isArray(certificates) ? certificates : []

  const filtered = certList.filter((c: any) =>
    c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateNumber?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    const form = document.getElementById('create-cert-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    createCert.mutate(data)
    setShowCreate(false)
  }

  const handleEdit = (c: any) => {
    setEditingId(c.id)
    setEditData({ studentName: c.studentName || '', courseName: c.courseName || '', grade: c.grade || '' })
  }

  const handleSaveEdit = (id: string) => {
    updateCert.mutate({ id, data: editData })
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this certificate?')) deleteCert.mutate(id)
  }

  const handleDownload = async (id: string) => {
    try {
      await certificateService.download(id, 'pdf')
      showInfo('Certificate download started')
    } catch {
      showInfo('Failed to download certificate')
    }
  }

  if (isLoading) {
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
          {Array.from({ length: 6 }).map((_, i) => (<div key={'sk' + i} className="skeleton h-52 rounded-xl" />))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon !bg-danger-light !text-danger">!</div>
          <h3>Error loading certificates</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load certificates'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Certificate Management</h1>
          <p>{certList.length} certificates issued</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
          <MdAdd size={18} /> {showCreate ? 'Cancel' : 'Issue Certificate'}
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdSchool size={24} /></div>
          <div className="stat-value">{certList.length}</div>
          <div className="stat-label">Total Issued</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdMilitaryTech size={24} /></div>
          <div className="stat-value">{certList.filter((c: any) => c.status === 'active').length}</div>
          <div className="stat-label">Active</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-info-light text-info"><MdDownload size={24} /></div>
          <div className="stat-value">{certList.filter((c: any) => c.status === 'revoked').length}</div>
          <div className="stat-label">Revoked</div>
        </motion.div>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="card mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdMilitaryTech className="text-primary" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Issue New Certificate</h3>
              <p className="text-xs text-neutral-500">Enter certificate details</p>
            </div>
          </div>
          <form id="create-cert-form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {[
                { name: 'studentId', label: 'Student ID (UUID)', type: 'text' },
                { name: 'studentName', label: 'Student Name', type: 'text' },
                { name: 'courseName', label: 'Course Name', type: 'text' },
                { name: 'grade', label: 'Grade', type: 'text' },
                { name: 'completionDate', label: 'Completion Date', type: 'date' },
                { name: 'templateName', label: 'Template Name', type: 'text' },
                { name: 'templateStyle', label: 'Template Style (classic/modern/minimal)', type: 'text' },
                { name: 'issueDate', label: 'Issue Date', type: 'date' },
              ].map((f) => (
                <div className="input-group" key={f.name}>
                  <label>{f.label}</label>
                  <input type={f.type} name={f.name} className="input-field" required={['studentId', 'studentName', 'courseName'].includes(f.name)} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="btn btn-primary" disabled={createCert.isPending}>
                {createCert.isPending ? 'Issuing...' : 'Issue Certificate'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="card">
        <div className="relative mb-5">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input type="text" placeholder="Search by student, course, or certificate number..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MdSchool size={28} /></div>
            <h3>No certificates found</h3>
            <p>Try adjusting your search or issue a new certificate.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c: any) => (
              <motion.div key={c.id} variants={itemVariants} className="card p-5 hover:border-primary-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><MdMilitaryTech className="text-primary" size={22} /></div>
                    <div>
                      {editingId === c.id ? (
                        <input type="text" value={editData.studentName || ''} onChange={(e) => setEditData({ ...editData, studentName: e.target.value })} className="input-field !py-1 !text-sm" />
                      ) : (
                        <>
                          <h3 className="font-semibold text-neutral-800 text-sm">{c.studentName}</h3>
                          <p className="text-xs text-neutral-400">{c.certificateNumber || `#${c.id?.slice(0, 8)}`}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {editingId === c.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(c.id)} className="btn btn-primary btn-sm">Save</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleDownload(c.id)} className="btn btn-ghost btn-sm !px-1.5 text-success hover:bg-success-light" title="Download PDF">
                          <MdDownload size={15} />
                        </button>
                        <button onClick={() => setPreviewId(previewId === c.id ? null : c.id)} className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Preview">
                          <MdPreview size={15} />
                        </button>
                        <button onClick={() => handleEdit(c)} className="btn btn-ghost btn-sm !px-1.5 text-neutral-500 hover:text-blue-500" title="Edit">
                          <MdEdit size={15} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete">
                          <MdDelete size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pb-3 mb-3 border-b border-neutral-100">
                  <p className="text-sm text-neutral-600">
                    <span className="text-neutral-400">Course: </span>{c.courseName || '-'}
                  </p>
                  <p className="text-sm text-neutral-600">
                    <span className="text-neutral-400">Grade: </span>
                    <span className={c.grade === 'A' || c.grade === 'A+' ? 'text-success font-semibold' : 'text-neutral-600'}>{c.grade || 'N/A'}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><MdCalendarToday size={13} /> {c.completionDate ? new Date(c.completionDate).toLocaleDateString() : 'N/A'}</span>
                  <span className={`badge ${c.status === 'active' ? 'badge-success' : c.status === 'revoked' ? 'badge-danger' : 'badge-warning'}`}>
                    {c.status || 'active'}
                  </span>
                </div>

                {previewId === c.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wide">Preview</p>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary-600">Certificate of Completion</p>
                      <p className="text-base font-semibold mt-2">{c.studentName}</p>
                      <p className="text-xs text-neutral-500 mt-1">has completed {c.courseName}</p>
                      <p className="text-xs text-neutral-400 mt-1">Grade: {c.grade || 'N/A'}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
