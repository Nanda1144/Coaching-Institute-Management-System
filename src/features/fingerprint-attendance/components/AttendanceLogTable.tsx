import { motion } from 'framer-motion'
import { MdPerson, MdAccessTime, MdCheckCircle, MdCancel, MdSchedule } from 'react-icons/md'
import type { AttendanceLogEntry } from '../types/fingerprint.types'
import { getInitials, safeUpperFirst } from '../../../utils/unwrap'

interface AttendanceLogTableProps {
  entries: AttendanceLogEntry[]
}

const statusIcon = {
  present: MdCheckCircle,
  absent: MdCancel,
  late: MdSchedule,
}

const statusColor = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
}

const statusBg = {
  present: '#d1fae5',
  absent: '#fee2e2',
  late: '#fef3c7',
}

export default function AttendanceLogTable({ entries }: AttendanceLogTableProps) {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Today&apos;s Attendance Log</h3>
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
        <h3 className="font-semibold text-gray-800">Today&apos;s Attendance Log</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {entries.length} records
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Time</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Verification</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const StatusIcon = statusIcon[entry.status] || MdCheckCircle
              return (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold"
                        style={{
                          background: entry.verificationResult === 'matched'
                            ? 'linear-gradient(135deg, #10b98120, #05966920)'
                            : 'linear-gradient(135deg, #ef444420, #dc262620)',
                          color: entry.verificationResult === 'matched' ? '#059669' : '#dc2626',
                        }}
                      >
                        {getInitials(entry.studentName, '?')}
                      </div>
                      <span className="text-xs text-gray-800 font-medium">{entry.studentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <MdAccessTime className="text-gray-300 text-xs" />
                      <span className="text-xs text-gray-600">{entry.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: statusBg[entry.status], color: statusColor[entry.status] }}
                    >
                      <StatusIcon className="text-xs" />
                      {safeUpperFirst(entry.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        entry.verificationResult === 'matched'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {entry.verificationResult === 'matched' ? (
                        <><MdCheckCircle className="text-xs" /> Matched</>
                      ) : (
                        <><MdCancel className="text-xs" /> Failed</>
                      )}
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
