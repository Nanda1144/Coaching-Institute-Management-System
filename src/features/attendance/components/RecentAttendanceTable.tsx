import { motion } from 'framer-motion'
import { MdPerson, MdBadge, MdSchool, MdAccessTime, MdFingerprint, MdCheckCircle, MdCancel, MdSchedule, MdEventBusy } from 'react-icons/md'
import type { AttendanceRecord } from '../types/attendance.types'
import { statusConfig, methodConfig } from '../data/attendanceData'

interface RecentAttendanceTableProps {
  records: AttendanceRecord[]
  error?: string | null
}

export default function RecentAttendanceTable({ records, error }: RecentAttendanceTableProps) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-8 text-center"
      >
        <MdCancel className="text-4xl text-red-400 mx-auto mb-3" />
        <p className="text-gray-800 font-medium mb-1">Failed to load attendance records</p>
        <p className="text-sm text-gray-500">{error}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Recent Attendance</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {records.length} records
        </span>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-10">
          <MdEventBusy className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No attendance records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Student Name</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Roll No</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Department</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Status</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Time</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Method</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => {
                const status = statusConfig[record.status]
                const method = methodConfig[record.method] ?? { color: '#6b7280', bg: '#f3f4f6' }
                const StatusIcon = record.status === 'present' ? MdCheckCircle
                  : record.status === 'absent' ? MdCancel
                  : record.status === 'late' ? MdSchedule
                  : MdEventBusy

                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdPerson className="text-gray-400 text-xs flex-shrink-0" />
                        <span className="text-gray-700 text-xs font-medium truncate max-w-[140px]">{record.studentName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdBadge className="text-gray-400 text-xs flex-shrink-0" />
                        <span className="text-gray-600 text-xs">{record.rollNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdSchool className="text-gray-400 text-xs flex-shrink-0" />
                        <span className="text-gray-600 text-xs truncate max-w-[120px]">{record.department}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        <StatusIcon className="text-xs" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdAccessTime className="text-gray-400 text-xs flex-shrink-0" />
                        <span className="text-gray-600 text-xs">{record.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {record.method !== '--' ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: method.bg, color: method.color }}
                        >
                          <MdFingerprint className="text-xs" />
                          {record.method}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">--</span>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
