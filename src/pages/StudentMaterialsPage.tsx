import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdLibraryBooks, MdDownload, MdSearch, MdPictureAsPdf, MdInsertDriveFile, MdOndemandVideo, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'

const FILE_ICONS: Record<string, React.ElementType> = { PDF: MdPictureAsPdf, PPT: MdInsertDriveFile, VIDEO: MdOndemandVideo }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StudentMaterialsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['student-materials'],
    queryFn: () => studentDashboardService.getMaterials(),
  })

  const materials = data?.data ?? []
  const filtered = materials.filter((m: { title: string }) => m.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Study Materials</h1>
            <p className="text-neutral-500 text-sm mt-1">Browse and download course materials</p>
          </div>
          <div className="relative w-full max-w-xs">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input type="text" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={'sk' + i} className="card p-5">
                <div className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-md skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="h-3 skeleton rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load materials</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdLibraryBooks size={28} /></div>
            <h3>No materials found</h3>
            <p>Try adjusting your search criteria.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((material: { id: string; title: string; subject: string; type: string; uploadedBy: string; downloads: number }) => {
              const FileIcon = FILE_ICONS[material.type] || MdInsertDriveFile
              return (
                <motion.div key={material.id} variants={itemVariants} className="card p-5 hover:shadow-card-hover">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center shrink-0"><FileIcon className="text-primary" size={20} /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-800 truncate">{material.title}</h3>
                      <p className="text-xs text-neutral-400">{material.subject} &bull; {material.type}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">by {material.uploadedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400">{material.downloads} downloads</span>
                    <button className="btn btn-ghost btn-sm"><MdDownload size={14} /> Download</button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
