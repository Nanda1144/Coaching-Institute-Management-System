import { motion } from 'framer-motion'
import { MdVisibility, MdEdit, MdArrowUpward, MdArrowDownward, MdCheckCircle, MdCancel, MdSchedule, MdEventBusy } from 'react-icons/md'
import type { HistoryRecord, SortConfig, SortField } from '../types/attendanceHistory.types'

interface AttendanceHistoryTableProps {
  records: HistoryRecord[]
  sortConfig: SortConfig
  onSort: (field: SortField) => void
  onView: (record: HistoryRecord) => void
  onEdit: (record: HistoryRecord) => void
}

const statusStyles: Record<string, { color: string; bg: string; icon: typeof MdCheckCircle }> = {
  present: { color: '#10b981', bg: '#d1fae5', icon: MdCheckCircle },
  absent: { color: '#ef4444', bg: '#fee2e2', icon: MdCancel },
  late: { color: '#f59e0b', bg: '#fef3c7', icon: MdSchedule },
  leave: { color: '#3b82f6', bg: '#dbeafe', icon: MdEventBusy },
}

const methodLabels: Record<string, string> = {
  manual: 'Manual',
  face: 'Face',
  fingerprint: 'Fingerprint',
  qr: 'QR Code',
}

const columns: { key: SortField | 'actions'; label: string; sortable: boolean; flex: string }[] = [
  { key: 'date', label: 'Date', sortable: true, flex: 'flex-[1.2]' },
  { key: 'studentName', label: 'Student', sortable: true, flex: 'flex-[1.8]' },
  { key: 'rollNumber', label: 'Roll No', sortable: true, flex: 'flex-[1.2]' },
  { key: 'department', label: 'Department', sortable: true, flex: 'flex-[1.5]' },
  { key: 'status', label: 'Status', sortable: true, flex: 'flex-[1]' },
  { key: 'method', label: 'Method', sortable: true, flex: 'flex-[1]' },
  { key: 'faculty', label: 'Faculty', sortable: true, flex: 'flex-[1.5]' },
  { key: 'time', label: 'Time', sortable: true, flex: 'flex-[1]' },
  { key: 'actions', label: 'Actions', sortable: false, flex: 'flex-[1.2]' },
]

export default function AttendanceHistoryTable({ records, sortConfig, onSort, onView, onEdit }: AttendanceHistoryTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="flex items-center px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent">
            {columns.map((col) => (
              <div
                key={col.key === 'actions' ? 'actions' : col.key}
                className={`${col.flex} flex items-center gap-1 ${
                  col.sortable ? 'cursor-pointer select-none hover:text-gray-800' : ''
                } text-gray-500 text-xs font-medium uppercase tracking-wider transition-colors`}
                onClick={() => col.sortable && col.key !== 'actions' && onSort(col.key)}
              >
                {col.label}
                {col.sortable && col.key !== 'actions' && (
                  <span className="inline-flex flex-col leading-none ml-0.5">
                    <MdArrowUpward
                      className={`text-[8px] -mb-0.5 ${
                        sortConfig.field === col.key && sortConfig.direction === 'asc'
                          ? 'text-primary'
                          : 'text-gray-300'
                      }`}
                    />
                    <MdArrowDownward
                      className={`text-[8px] ${
                        sortConfig.field === col.key && sortConfig.direction === 'desc'
                          ? 'text-primary'
                          : 'text-gray-300'
                      }`}
                    />
                  </span>
                )}
              </div>
            ))}
          </div>

          {records.map((record, index) => {
            const st = statusStyles[record.status]
            const StatusIcon = st.icon
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.025 }}
                className="flex items-center px-5 py-3 border-b border-gray-50 hover:bg-white/50 transition-colors group"
              >
                <div className="flex-[1.2] text-xs text-gray-700 tabular-nums">{record.date}</div>
                <div className="flex-[1.8] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-[8px] font-bold text-primary flex-shrink-0">
                    {record.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-xs text-gray-800 font-medium truncate">{record.studentName}</span>
                </div>
                <div className="flex-[1.2] text-xs text-gray-600">{record.rollNumber}</div>
                <div className="flex-[1.5] text-xs text-gray-600 truncate">{record.department}</div>
                <div className="flex-[1]">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: st.bg, color: st.color }}
                  >
                    <StatusIcon className="text-xs" />
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
                <div className="flex-[1] text-xs text-gray-600 capitalize">{methodLabels[record.method] || record.method}</div>
                <div className="flex-[1.5] text-xs text-gray-600 truncate">{record.faculty}</div>
                <div className="flex-[1] text-xs text-gray-600 tabular-nums">{record.time}</div>
                <div className="flex-[1.2] flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onView(record)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                    title="View"
                  >
                    <MdVisibility className="text-sm" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(record)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                    title="Edit"
                  >
                    <MdEdit className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
