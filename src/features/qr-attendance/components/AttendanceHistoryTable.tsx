import { motion } from 'framer-motion'
import { MdPerson, MdAccessTime, MdCheckCircle, MdCancel, MdTimerOff, MdHowToVote } from 'react-icons/md'
import type { AttendanceRecord, QRStatus } from '../types/qrAttendance.types'
import { getInitials, safeUpperFirst } from '../../../utils/unwrap'

interface AttendanceHistoryTableProps {
  records: AttendanceRecord[]
}

const qrStatusConfig: Record<QRStatus, { label: string; icon: typeof MdCheckCircle; color: string; bg: string }> = {
  valid: { label: 'Valid', icon: MdCheckCircle, color: '#10b981', bg: '#d1fae5' },
  invalid: { label: 'Invalid', icon: MdCancel, color: '#ef4444', bg: '#fee2e2' },
  expired: { label: 'Expired', icon: MdTimerOff, color: '#f59e0b', bg: '#fef3c7' },
  attendance_success: { label: 'Success', icon: MdHowToVote, color: '#3b82f6', bg: '#dbeafe' },
}

const attendanceStatusConfig = {
  present: { color: '#10b981', bg: '#d1fae5' },
  absent: { color: '#ef4444', bg: '#fee2e2' },
}

export default function AttendanceHistoryTable({ records }: AttendanceHistoryTableProps) {
  if (records.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Attendance History</h3>
        <div className="text-center py-8">
          <MdPerson className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No attendance records yet</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Attendance History</h3>
        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {records.length} records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Time</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">QR Status</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const qrConfig = qrStatusConfig[record.qrStatus] || { label: 'Unknown', icon: MdCheckCircle, color: '#6b7280', bg: '#f3f4f6' }
              const QrIcon = qrConfig.icon
              const attConfig = attendanceStatusConfig[record.attendanceStatus] || { color: '#6b7280', bg: '#f3f4f6' }
              return (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                        {getInitials(record.studentName)}
                      </div>
                      <span className="text-xs text-gray-800 font-medium">{record.studentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <MdAccessTime className="text-gray-300 text-xs" />
                      <span className="text-xs text-gray-600">{record.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: qrConfig.bg, color: qrConfig.color }}
                    >
                      <QrIcon className="text-xs" />
                      {qrConfig.label}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: attConfig.bg, color: attConfig.color }}
                    >
                      {record.attendanceStatus === 'present' ? <MdCheckCircle className="text-xs" /> : <MdCancel className="text-xs" />}
                      {safeUpperFirst(record.attendanceStatus)}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
