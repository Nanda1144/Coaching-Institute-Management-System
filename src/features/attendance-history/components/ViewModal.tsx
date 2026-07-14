import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdPerson, MdBadge, MdSchool, MdBook, MdAccessTime, MdCheckCircle } from 'react-icons/md'
import type { HistoryRecord } from '../types/attendanceHistory.types'

interface ViewModalProps {
  record: HistoryRecord | null
  onClose: () => void
}

export default function ViewModal({ record, onClose }: ViewModalProps) {
  return (
    <AnimatePresence>
      {record && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MdPerson className="text-primary text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Attendance Details</h3>
                  <p className="text-[10px] text-gray-500">Record ID: {record.id}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MdClose />
              </motion.button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-lg font-bold text-primary">
                    {record.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800">{record.studentName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MdBadge className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-500">{record.rollNumber}</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                      record.status === 'absent' ? 'bg-red-50 text-red-600' :
                      record.status === 'late' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <MdCheckCircle className="text-xs" />
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MdSchool, label: 'Department', value: record.department },
                  { icon: MdSchool, label: 'Course', value: record.course },
                  { icon: MdBook, label: 'Subject', value: record.subject },
                  { icon: MdPerson, label: 'Faculty', value: record.faculty },
                  { icon: MdAccessTime, label: 'Date', value: record.date },
                  { icon: MdAccessTime, label: 'Time', value: record.time },
                ].map((field) => (
                  <div key={field.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <field.icon className="text-gray-400 text-xs" />
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{field.label}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{field.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-xs text-gray-500">Attendance Method</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium capitalize">
                  {record.method}
                </span>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
