import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { MdClose, MdWarning } from 'react-icons/md'
import type { Faculty } from '../types/faculty.types'
import facultyService from '../../../services/faculty/faculty.service'
import { normalizeFacultyList } from '../../../utils/normalizers'
const statusOptions = ['Active', 'Inactive', 'On Leave'] as const
const experienceRanges = [
  { label: 'All', value: '' },
  { label: '0-5 Years', value: '0-5' },
  { label: '6-10 Years', value: '6-10' },
  { label: '11-15 Years', value: '11-15' },
  { label: '15+ Years', value: '15+' },
]
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
  const [facultyList, setFacultyList] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await facultyService.getAll()
        setFacultyList(normalizeFacultyList(result))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load faculty')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const departmentOptions = useMemo(() => [...new Set(facultyList.map(f => f.department).filter(Boolean))], [facultyList])
  const branchOptions = useMemo(() => [...new Set(facultyList.map(f => f.branch).filter(Boolean))], [facultyList])

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

  const handleDelete = async () => {
    if (deleteTarget && deleteReason.trim()) {
      try {
        await facultyService.delete(deleteTarget)
        setFacultyList(prev => prev.filter(f => f.id !== deleteTarget))
        showToastMsg(`Faculty member ${deleteTarget} deleted. Reason: ${deleteReason}`)
      } catch (err) {
        showToastMsg(err instanceof Error ? err.message : 'Failed to delete faculty')
      }
      setDeleteTarget(null)
      setDeleteReason('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <FacultyHeader onAdd={() => navigate('/dashboard/faculty/add')} onExportCSV={handleExportCSV} onExportXLSX={handleExportXLSX} />

      <FacultyFilters
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        departmentOptions={departmentOptions}
        branchOptions={branchOptions}
        statusOptions={statusOptions}
        experienceRanges={experienceRanges}
      />

      {sortedFaculty.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Faculty Found</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            {facultyList.length === 0
              ? 'No faculty members have been added yet. Add your first faculty member to get started.'
              : 'No faculty members match your current filter criteria. Try adjusting your filters.'}
          </p>
          {facultyList.length === 0 && (
            <button
              onClick={() => navigate('/dashboard/faculty/add')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              Add Faculty Member
            </button>
          )}
        </motion.div>
      ) : (
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
            onView={(id) => navigate(`/dashboard/faculty/profile/${id}`)}
            onEdit={(id) => navigate(`/dashboard/faculty/edit/${id}`)}
            onDelete={(id) => setDeleteTarget(id)}
            onAssignCourse={(id) => navigate(`/dashboard/faculty/assign?id=${id}`)}
          />
          <FacultyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedFaculty.length}
            pageSize={pageSize}
            goToPage={goToPage}
          />
        </motion.div>
      )}

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
