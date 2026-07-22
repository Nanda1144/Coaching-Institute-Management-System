import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdLibraryBooks, MdUpload, MdDelete, MdDownload, MdSearch, MdPictureAsPdf, MdInsertDriveFile, MdOndemandVideo, MdErrorOutline, MdClose, MdImage, MdAudiotrack, MdArchive } from 'react-icons/md'
import materialService from '../services/material/material.service'
import facultyService from '../services/faculty/faculty.service'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'

interface Material {
  id: string
  title: string
  description: string
  materialType: string
  fileUrl: string
  uploadedBy: string
  createdAt: string
  downloads: number
  course?: string
  subject?: string
  batch?: string
}

const FILE_ICONS: Record<string, React.ElementType> = {
  PDF: MdPictureAsPdf,
  PPT: MdInsertDriveFile,
  DOC: MdInsertDriveFile,
  DOCX: MdInsertDriveFile,
  VIDEO: MdOndemandVideo,
  NOTES: MdLibraryBooks,
  IMAGE: MdImage,
  AUDIO: MdAudiotrack,
  ZIP: MdArchive,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

const materialTypeOptions = ['PDF', 'PPT', 'DOC', 'DOCX', 'VIDEO', 'NOTES', 'IMAGE', 'AUDIO', 'ZIP']

export default function FacultyMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [facultyId, setFacultyId] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    materialType: 'PDF',
    file: null as File | null,
  })

  const fetchMaterials = async () => {
    setLoading(true)
    setError(null)
    try {
      let fid = facultyId
      if (!fid) {
        try {
          const profileRes = await facultyService.getProfile()
          const raw = profileRes?.data || profileRes
          fid = raw?.facultyId || raw?.id || ''
          if (fid) setFacultyId(fid)
        } catch { /* ignore */ }
      }
      let data: Material[] = []
      if (fid) {
        const res = await materialService.getByFaculty(fid)
        const items = (res as any)?.data?.data || (res as any)?.data || res || []
        data = Array.isArray(items) ? items : []
      } else {
        const res = await materialService.getAll({ limit: 100 })
        const items = (res as any)?.data?.data || (res as any)?.data || res || []
        data = Array.isArray(items) ? items : []
      }
      setMaterials(data)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load materials'
      setError(message)
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      setToastMessage('Please provide a title and select a file')
      setShowToast(true)
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('materialType', uploadForm.materialType)
      await materialService.create(Object.fromEntries(formData) as any)
      setShowUploadModal(false)
      setUploadForm({ title: '', description: '', materialType: 'PDF', file: null })
      setToastMessage('Material uploaded successfully')
      setShowToast(true)
      fetchMaterials()
    } catch (err: any) {
      setToastMessage(err?.response?.data?.message || err?.message || 'Upload failed')
      setShowToast(true)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return
    try {
      await materialService.delete(id)
      setMaterials((prev) => prev.filter((m) => m.id !== id))
      setToastMessage('Material deleted')
      setShowToast(true)
    } catch (err: any) {
      setToastMessage(err?.response?.data?.message || 'Delete failed')
      setShowToast(true)
    }
  }

  const handleDownload = async (material: Material) => {
    try {
      window.open(material.fileUrl, '_blank')
      await materialService.recordDownload(material.id, {})
    } catch { /* ignore */ }
  }

  const filtered = materials.filter((m) => !search || m.title?.toLowerCase().includes(search.toLowerCase()) || m.description?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSpinner text="Loading materials..." />

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-50 flex items-center justify-center">
            <MdErrorOutline className="text-danger" size={28} />
          </div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Failed to load materials</h2>
          <p className="text-sm text-neutral-500 mb-4">{error}</p>
          <button onClick={fetchMaterials} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Study Materials</h1>
            <p className="text-neutral-500 text-sm mt-1">Upload and manage study materials</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input type="text" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-48" />
            </div>
            <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
              <MdUpload size={18} /> Upload
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          {filtered.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon"><MdLibraryBooks size={28} /></div>
              <h3>{search ? 'No matching materials' : 'No materials uploaded yet'}</h3>
              <p>{search ? 'Try a different search' : 'Upload your first study material'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((material) => {
                const FileIcon = FILE_ICONS[material.materialType?.toUpperCase()] || MdInsertDriveFile
                return (
                  <motion.div
                    key={material.id}
                    variants={itemVariants}
                    className="card p-5 hover:shadow-card-hover group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
                        <FileIcon className="text-primary" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-800 truncate">{material.title}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">{material.materialType} &bull; {material.downloads || 0} downloads</p>
                      </div>
                    </div>
                    {material.description && <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{material.description}</p>}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                      <button onClick={() => handleDownload(material)} className="btn btn-ghost btn-sm"><MdDownload size={14} /> Download</button>
                      <button onClick={() => handleDelete(material.id)} className="btn btn-ghost btn-sm text-danger ml-auto"><MdDelete size={14} /> Delete</button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </motion.div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => !uploading && setShowUploadModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Upload Material</h2>
              <button onClick={() => !uploading && setShowUploadModal(false)} className="text-neutral-400 hover:text-neutral-600"><MdClose size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="input-group">
                <label>Title *</label>
                <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Material title" />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={uploadForm.description} onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))} className="input-field min-h-[80px]" placeholder="Optional description" />
              </div>
              <div className="input-group">
                <label>Material Type</label>
                <select value={uploadForm.materialType} onChange={(e) => setUploadForm((f) => ({ ...f, materialType: e.target.value }))} className="select-field">
                  {materialTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>File *</label>
                <input type="file" onChange={(e) => setUploadForm((f) => ({ ...f, file: e.target.files?.[0] || null }))} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} disabled={uploading} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleUpload} disabled={uploading || !uploadForm.file || !uploadForm.title} className="btn btn-primary flex-1">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  )
}
