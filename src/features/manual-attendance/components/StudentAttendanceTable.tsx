import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdClose, MdCheckCircle, MdCancel, MdSchedule, MdNightlight, MdEventBusy, MdPerson, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import type { StudentAttendance } from '../types/manualAttendance.types'
import { statusColors } from '../data/manualAttendanceData'

interface StudentAttendanceTableProps {
  students: StudentAttendance[]
  onStatusChange: (id: string, status: StudentAttendance['status']) => void
  onRemarkChange: (id: string, remark: string) => void
  onBulkStatusChange: (ids: string[], status: StudentAttendance['status']) => void
}

const statusOptions = [
  { key: 'present', label: 'Present', icon: MdCheckCircle, color: '#10b981' },
  { key: 'absent', label: 'Absent', icon: MdCancel, color: '#ef4444' },
  { key: 'late', label: 'Late', icon: MdSchedule, color: '#f59e0b' },
  { key: 'half-day', label: 'Half-Day', icon: MdNightlight, color: '#6366f1' },
  { key: 'leave', label: 'Leave', icon: MdEventBusy, color: '#3b82f6' },
]

const ROWS_PER_PAGE = 10

export default function StudentAttendanceTable({
  students, onStatusChange, onRemarkChange, onBulkStatusChange,
}: StudentAttendanceTableProps) {
  const [search, setSearch] = useState('')
  const [rollFilter, setRollFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...students]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.studentName.toLowerCase().includes(q))
    }
    if (rollFilter) {
      result = result.filter((s) => s.rollNumber.toLowerCase().includes(rollFilter.toLowerCase()))
    }
    return result
  }, [students, search, rollFilter])

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE)
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE
    return filtered.slice(start, start + ROWS_PER_PAGE)
  }, [filtered, currentPage])

  const allSelected = paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id))
  const someSelected = paginated.some((s) => selectedIds.has(s.id))

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginated.forEach((s) => next.delete(s.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginated.forEach((s) => next.add(s.id))
        return next
      })
    }
  }

  const handleMarkAll = (status: StudentAttendance['status']) => {
    students.forEach((s) => onStatusChange(s.id, status))
  }

  const handleBulkMark = (status: StudentAttendance['status']) => {
    if (selectedIds.size === 0) return
    onBulkStatusChange(Array.from(selectedIds), status)
    setSelectedIds(new Set())
  }

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
          <MdPerson className="text-emerald-600 text-lg" />
        </div>
        <h3 className="font-semibold text-gray-800">Student Attendance</h3>
        <span className="ml-auto text-xs font-medium text-gray-500 bg-white/60 px-3 py-1 rounded-full">
          {students.length} students
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <MdClose />
              </button>
            )}
          </div>
          <div className="relative w-full sm:w-44">
            <input
              type="text"
              placeholder="Filter by roll no..."
              value={rollFilter}
              onChange={(e) => { setRollFilter(e.target.value); setCurrentPage(1) }}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 mr-1">Mark All:</span>
          {statusOptions.map((opt) => (
            <motion.button
              key={opt.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMarkAll(opt.key as StudentAttendance['status'])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
              style={{ borderColor: statusColors[opt.key]?.border || '#e5e7eb', color: opt.color, backgroundColor: statusColors[opt.key]?.bg || '#f9fafb' }}
            >
              <opt.icon className="text-xs" />
              {opt.label}
            </motion.button>
          ))}

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <span className="text-xs text-gray-500">{selectedIds.size} selected</span>
              {statusOptions.map((opt) => (
                <motion.button
                  key={`bulk-${opt.key}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkMark(opt.key as StudentAttendance['status'])}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border"
                  style={{ borderColor: opt.color + '40', color: opt.color, backgroundColor: opt.color + '10' }}
                >
                  <opt.icon className="text-[10px]" />
                  {opt.label}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 py-3 px-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer"
                  />
                </th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Photo</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Roll No</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Student Name</th>
                <th className="text-center py-3 px-1 text-gray-500 font-medium text-xs" colSpan={5}>Attendance</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Remarks</th>
              </tr>
              <tr className="border-b border-gray-50">
                <th />
                <th colSpan={3} />
                {statusOptions.map((opt) => (
                  <th key={opt.key} className="text-center py-1 px-1">
                    <div className="flex flex-col items-center gap-0.5" style={{ color: opt.color }}>
                      <opt.icon className="text-sm" />
                      <span className="text-[9px] font-medium">{opt.label}</span>
                    </div>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <MdPerson className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No students found</p>
                  </td>
                </tr>
              ) : (
                paginated.map((student, index) => {
                  const initials = getInitials(student.studentName)
                  
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-gray-50 hover:bg-white/50 transition-colors group ${
                        selectedIds.has(student.id) ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-2.5 px-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(student.id)}
                          onChange={() => toggleSelect(student.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-[10px] font-bold text-primary border border-white/50">
                          {initials}
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-xs font-mono font-medium text-gray-700">{student.rollNumber}</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-xs text-gray-800 font-medium">{student.studentName}</span>
                      </td>
                      {statusOptions.map((opt) => {
                        const isActive = student.status === opt.key
                        const colors = statusColors[opt.key]
                        return (
                          <td key={opt.key} className="py-2.5 px-1 text-center">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onStatusChange(student.id, isActive ? null : opt.key as StudentAttendance['status'])}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all mx-auto ${
                                isActive
                                  ? 'shadow-sm'
                                  : 'hover:bg-gray-100'
                              }`}
                              style={{
                                backgroundColor: isActive ? colors.bg : 'transparent',
                                border: isActive ? `1.5px solid ${colors.border}` : '1.5px solid transparent',
                              }}
                            >
                              <opt.icon
                                className="text-sm"
                                style={{ color: isActive ? opt.color : '#d1d5db' }}
                              />
                            </motion.button>
                          </td>
                        )
                      })}
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={student.remarks}
                          onChange={(e) => onRemarkChange(student.id, e.target.value)}
                          placeholder="--"
                          className="w-20 px-2 py-1 rounded-lg border border-gray-200 bg-white/60 text-[11px] text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages} ({filtered.length} total)
            </span>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                <MdChevronLeft className="text-gray-600" />
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                    page === currentPage
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                <MdChevronRight className="text-gray-600" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
