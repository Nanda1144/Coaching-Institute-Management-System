import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdLibraryBooks, MdDownload, MdSearch, MdPictureAsPdf, MdInsertDriveFile, MdOndemandVideo } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const FILE_ICONS: Record<string, React.ElementType> = {
  PDF: MdPictureAsPdf,
  PPT: MdInsertDriveFile,
  VIDEO: MdOndemandVideo,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ParentMaterialsPage() {
  const [search, setSearch] = useState('')
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-materials'],
    queryFn: () => parentDashboardService.getMaterials(),
  })
  const materials = response?.data ?? []
  const filtered = materials.filter((m: any) => m.title.toLowerCase().includes(search.toLowerCase()))

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-64" />
          </div>
          <div className="skeleton h-10 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={'sk' + i} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <h1 className="gradient-text text-3xl font-bold">Study Materials</h1>
            <p className="text-neutral-500 mt-1">Course materials for your child&apos;s subjects</p>
          </div>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load study materials. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="gradient-text text-3xl font-bold">Study Materials</h1>
          <p className="text-neutral-500 mt-1">Course materials for your child&apos;s subjects</p>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 pr-3 py-2 w-48"
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><MdLibraryBooks size={24} /></div>
          <p className="text-neutral-500">No materials found</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((m: any) => {
            const FileIcon = FILE_ICONS[m.type] || MdInsertDriveFile
            return (
              <motion.div key={m.id} className="card p-5" variants={itemVariants}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <FileIcon className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 truncate">{m.title}</h3>
                    <p className="text-xs text-neutral-400">{m.subject} &bull; {m.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs text-neutral-400">{m.downloads} downloads</span>
                  <button className="btn btn-ghost btn-sm">
                    <MdDownload size={14} /> Download
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
