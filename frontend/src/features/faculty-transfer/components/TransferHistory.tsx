import { motion } from 'framer-motion'
import { MdHistory, MdSwapHoriz, MdCheckCircle, MdPending, MdCancel, MdHourglassEmpty } from 'react-icons/md'
import type { TransferRecord } from '../types/transfer.types'

interface TransferHistoryProps {
  records: TransferRecord[]
}

const statusStyles: Record<string, { bg: string; text: string; icon: typeof MdCheckCircle }> = {
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: MdCheckCircle },
  Approved: { bg: 'bg-blue-50', text: 'text-blue-700', icon: MdHourglassEmpty },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: MdPending },
  Rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: MdCancel },
}

export default function TransferHistory({ records }: TransferHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-4"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <MdHistory className="text-primary text-lg" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Transfer History</h3>
          <p className="text-xs text-gray-500">{records.length} record{records.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Transfer ID</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Faculty</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Old Branch</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">New Branch</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const style = statusStyles[r.status] || statusStyles.Pending
              const StatusIcon = style.icon
              return (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-xs text-gray-500">{r.id}</td>
                  <td className="py-3 px-3 font-medium text-gray-800">{r.facultyName}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <MdSwapHoriz className="text-gray-300" />
                      {r.oldBranch}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-primary">{r.newBranch}</td>
                  <td className="py-3 px-3 text-gray-500">{r.date}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                      <StatusIcon className="text-sm" />
                      {r.status}
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
