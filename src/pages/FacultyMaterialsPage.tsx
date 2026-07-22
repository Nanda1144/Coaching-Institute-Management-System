import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdLibraryBooks, MdUpload, MdDelete, MdDownload, MdSearch, MdPictureAsPdf, MdInsertDriveFile, MdOndemandVideo, MdErrorOutline } from 'react-icons/md'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

interface Material {
  id: string
  title: string
  description: string
  materialType: string
  fileUrl: string
  uploadedBy: string
  createdAt: string
  downloads: number
}

const FILE_ICONS: Record<string, React.ElementType> = {
  PDF: MdPictureAsPdf,
  PPT: MdInsertDriveFile,
  DOC: MdInsertDriveFile,
  VIDEO: MdOndemandVideo,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FacultyMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/materials')
      .then((res) => {
        const data = res.data?.data || res.data || []
        setMaterials(Array.isArray(data) ? data : [])
        setError(null)
      })
      .catch((err) => {
        const message = err?.response?.data?.message || err?.message || 'Failed to load materials'
        setError(message)
        setMaterials([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = materials.filter((m) => !search || m.title?.toLowerCase().includes(search.toLowerCase()))

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
          <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
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
            <button className="btn btn-primary">
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
                const FileIcon = FILE_ICONS[material.materialType] || MdInsertDriveFile
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
                      <button className="btn btn-ghost btn-sm"><MdDownload size={14} /> Download</button>
                      <button className="btn btn-ghost btn-sm text-danger ml-auto"><MdDelete size={14} /> Delete</button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
