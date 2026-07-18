import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdHistory } from 'react-icons/md'
import AttendanceHistoryFilters from '../components/AttendanceHistoryFilters'
import FilterChips from '../components/FilterChips'
import AttendanceHistoryTable from '../components/AttendanceHistoryTable'
import Pagination from '../components/Pagination'
import ViewModal from '../components/ViewModal'
import EditModal from '../components/EditModal'
import ExportMenu from '../components/ExportMenu'
import AttendanceHistorySkeleton from '../components/AttendanceHistorySkeleton'
import EmptyState from '../components/EmptyState'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import { initialFilters, ITEMS_PER_PAGE } from '../data/attendanceHistoryData'
import { normalizeHistoryRecordList } from '../../../utils/normalizers'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { HistoryRecord, HistoryFilters, SortConfig, SortField } from '../types/attendanceHistory.types'

export default function AttendanceHistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [filters, setFilters] = useState<HistoryFilters>(initialFilters)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [viewRecord, setViewRecord] = useState<HistoryRecord | null>(null)
  const [editRecord, setEditRecord] = useState<HistoryRecord | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const fetchRecords = useCallback(async (f: HistoryFilters) => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {}
      if (f.search) params.search = f.search
      if (f.department) params.department = f.department
      if (f.course) params.course = f.course
      if (f.batch) params.batch = f.batch
      if (f.status) params.status = f.status
      if (f.method) params.method = f.method
      if (f.dateFrom) params.dateFrom = f.dateFrom
      if (f.dateTo) params.dateTo = f.dateTo
      params.sortBy = 'date'
      params.sortOrder = 'desc'
      params.page = 1
      params.limit = 100

      const res = await attendanceService.getAll(params)
      setRecords(normalizeHistoryRecordList(res))
    } catch {
      setToastMessage('Failed to load attendance records')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords(filters)
  }, [])

  const handleFilterChange = useCallback((key: keyof HistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const handleSave = useCallback(async (updated: HistoryRecord) => {
    try {
      await attendanceService.update(updated.id, updated as unknown as Record<string, unknown>)
      setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setToastMessage('Record updated successfully')
      setShowToast(true)
    } catch {
      setToastMessage('Failed to update record')
      setShowToast(true)
    }
  }, [])

  const filtered = useMemo(() => {
    let result = [...records]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.rollNumber.toLowerCase().includes(q)
      )
    }
    if (filters.department) result = result.filter((r) => r.department === filters.department)
    if (filters.course) result = result.filter((r) => r.course === filters.course)
    if (filters.batch) result = result.filter((r) => r.batch === filters.batch)
    if (filters.status) result = result.filter((r) => r.status === filters.status)
    if (filters.method) result = result.filter((r) => r.method === filters.method)
    if (filters.dateFrom) result = result.filter((r) => r.date >= filters.dateFrom)
    if (filters.dateTo) result = result.filter((r) => r.date <= filters.dateTo)

    result.sort((a, b) => {
      const aVal = String(a[sortConfig.field] ?? '')
      const bVal = String(b[sortConfig.field] ?? '')
      const cmp = aVal.localeCompare(bVal)
      return sortConfig.direction === 'asc' ? cmp : -cmp
    })

    return result
  }, [records, filters, sortConfig])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <AttendanceNavBar />
        <div className="h-8 w-64 bg-gray-100/60 rounded-xl animate-pulse" />
        <AttendanceHistorySkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AttendanceNavBar />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>
          <p className="text-sm text-gray-500 mt-1">
            View, search, and manage all attendance records across departments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportMenu records={filtered} />
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
            <MdHistory className="text-primary" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </motion.div>

      <AttendanceHistoryFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

      <FilterChips filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

      {paginated.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <AttendanceHistoryTable
            records={paginated}
            sortConfig={sortConfig}
            onSort={handleSort}
            onView={setViewRecord}
            onEdit={setEditRecord}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ViewModal record={viewRecord} onClose={() => setViewRecord(null)} />
      <EditModal record={editRecord} onClose={() => setEditRecord(null)} onSave={handleSave} />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
