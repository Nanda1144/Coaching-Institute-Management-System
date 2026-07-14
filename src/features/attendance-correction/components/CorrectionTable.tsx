import { motion } from 'framer-motion'
import { MdVisibility, MdCheckCircle, MdCancel, MdAccessTime, MdDescription } from 'react-icons/md'
import type { CorrectionRequest, ApprovalStatus, AttendanceStatus } from '../types/attendanceCorrection.types'

interface CorrectionTableProps {
  requests: CorrectionRequest[]
  onView: (req: CorrectionRequest) => void
  onApprove: (req: CorrectionRequest) => void
  onReject: (req: CorrectionRequest) => void
}

const approvalStyles: Record<ApprovalStatus, { color: string; bg: string; label: string }> = {
  pending: { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
  approved: { color: '#10b981', bg: '#d1fae5', label: 'Approved' },
  rejected: { color: '#ef4444', bg: '#fee2e2', label: 'Rejected' },
}

const statusStyles: Record<AttendanceStatus, { color: string; bg: string }> = {
  present: { color: '#10b981', bg: '#d1fae5' },
  absent: { color: '#ef4444', bg: '#fee2e2' },
  late: { color: '#f59e0b', bg: '#fef3c7' },
  leave: { color: '#3b82f6', bg: '#dbeafe' },
}

export default function CorrectionTable({ requests, onView, onApprove, onReject }: CorrectionTableProps) {
  if (requests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-8 text-center"
      >
        <MdDescription className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No correction requests found</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent">
              {['Request ID', 'Student', 'Date', 'Current', 'Requested', 'Reason', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left py-3.5 px-3 text-gray-500 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const as = approvalStyles[req.approvalStatus]
              const cs = statusStyles[req.currentStatus]
              const rs = statusStyles[req.requestedStatus]
              return (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <span className="text-xs font-mono font-medium text-primary">{req.id}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-[8px] font-bold text-primary flex-shrink-0">
                        {req.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-800 font-medium truncate max-w-[120px]">{req.studentName}</p>
                        <p className="text-[9px] text-gray-400">{req.rollNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <MdAccessTime className="text-gray-300 text-xs" />
                      <span className="text-xs text-gray-600 whitespace-nowrap">{req.attendanceDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap" style={{ backgroundColor: cs.bg, color: cs.color }}>
                      {req.currentStatus.charAt(0).toUpperCase() + req.currentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap" style={{ backgroundColor: rs.bg, color: rs.color }}>
                      {req.requestedStatus.charAt(0).toUpperCase() + req.requestedStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-xs text-gray-600 truncate max-w-[150px]">{req.reason}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap" style={{ backgroundColor: as.bg, color: as.color }}>
                      {req.approvalStatus === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      {req.approvalStatus === 'approved' && <MdCheckCircle className="text-xs" />}
                      {req.approvalStatus === 'rejected' && <MdCancel className="text-xs" />}
                      {as.label}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => onView(req)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                        title="View"
                      >
                        <MdVisibility className="text-sm" />
                      </motion.button>
                      {req.approvalStatus === 'pending' && (
                        <>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => onApprove(req)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                            title="Approve"
                          >
                            <MdCheckCircle className="text-sm" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => onReject(req)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Reject"
                          >
                            <MdCancel className="text-sm" />
                          </motion.button>
                        </>
                      )}
                    </div>
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
