import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { MdClose, MdWarning } from 'react-icons/md'
import { facultyList as initialFacultyList, departmentOptions, branchOptions, statusOptions, experienceRanges } from '../data/facultyData'
import { useFacultyFilters } from '../hooks/useFacultyFilters'
import { useFacultySort } from '../hooks/useFacultySort'
import { useFacultyPagination } from '../hooks/useFacultyPagination'
import FacultyHeader from '../components/FacultyHeader'
import FacultyFilters from '../components/FacultyFilters'
import FacultyTable from '../components/FacultyTable'
import FacultyPagination from '../components/FacultyPagination'
import Toast from '../../../components/Toast'

export default function FacultyListPage() {
  const navigate = useNavigate()
  const [facultyList, setFacultyList] = useState(initialFacultyList)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const { filters, setFilter, resetFilters, filteredFaculty } = useFacultyFilters(facultyList)
  const { sortConfig, requestSort, sortedFaculty } = useFacultySort(filteredFaculty)
  const { currentPage, totalPages, paginatedItems, goToPage, pageSize } = useFacultyPagination(sortedFaculty)

  const showToastMsg = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
  }

  const handleExportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(sortedFaculty)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faculty-list-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToastMsg('CSV exported successfully')
  }

  const handleExportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(sortedFaculty)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Faculty')
    XLSX.writeFile(wb, `faculty-list-${new Date().toISOString().slice(0, 10)}.xlsx`)
    showToastMsg('XLSX exported successfully')
  }

  const handleDelete = () => {
    if (deleteTarget && deleteReason.trim()) {
      setFacultyList(prev => prev.filter(f => f.id !== deleteTarget))
      showToastMsg(`Faculty member ${deleteTarget} deleted. Reason: ${deleteReason}`)
      setDeleteTarget(null)
      setDeleteReason('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <FacultyHeader onAdd={() => navigate('/faculty/add')} onExportCSV={handleExportCSV} onExportXLSX={handleExportXLSX} />

      <FacultyFilters
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        departmentOptions={departmentOptions}
        branchOptions={branchOptions}
        statusOptions={statusOptions}
        experienceRanges={experienceRanges}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
      >
        <FacultyTable
          faculty={paginatedItems}
          sortConfig={sortConfig}
          requestSort={requestSort}
          onView={(id) => navigate(`/faculty/profile/${id}`)}
          onEdit={(id) => navigate(`/faculty/edit/${id}`)}
          onDelete={(id) => setDeleteTarget(id)}
          onAssignCourse={(id) => navigate(`/faculty/assign?id=${id}`)}
        />
        <FacultyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedFaculty.length}
          pageSize={pageSize}
          goToPage={goToPage}
        />
      </motion.div>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <MdWarning className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
                <button onClick={() => { setDeleteTarget(null); setDeleteReason('') }} className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors">
                  <MdClose className="text-gray-400 text-xl" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Are you sure you want to delete faculty member <span className="font-semibold text-gray-800">{deleteTarget}</span>? Please provide a reason.
              </p>
              <textarea
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deletion..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all resize-none mb-4"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setDeleteTarget(null); setDeleteReason('') }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!deleteReason.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 text-sm text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </motion.div>
  )
}
