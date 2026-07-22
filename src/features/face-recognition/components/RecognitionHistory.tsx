import { motion } from 'framer-motion'
import { MdPerson, MdAccessTime, MdCheckCircle, MdCancel } from 'react-icons/md'
import type { RecognitionRecord } from '../types/faceRecognition.types'
import { confidenceColor, confidenceBg } from '../data/faceRecognitionData'
import { getInitials } from '../../../utils/unwrap'

interface RecognitionHistoryProps {
  records: RecognitionRecord[]
}

export default function RecognitionHistory({ records }: RecognitionHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Recognition History</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {records.length} records
        </span>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8">
          <MdPerson className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No recognition history</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Student</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Time</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Confidence</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => {
                const color = confidenceColor(record.confidence)
                const bg = confidenceBg(record.confidence)
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-[8px] font-bold text-primary">
                          {record.studentName !== 'Unknown'
                            ? getInitials(record.studentName)
                            : '?'}
                        </div>
                        <span className="text-xs text-gray-800 font-medium">{record.studentName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdAccessTime className="text-gray-400 text-xs" />
                        <span className="text-xs text-gray-600">{record.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: bg, color }}
                      >
                        {record.confidence}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {record.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <MdCheckCircle className="text-xs" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <MdCancel className="text-xs" />
                          Failed
                        </span>
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
