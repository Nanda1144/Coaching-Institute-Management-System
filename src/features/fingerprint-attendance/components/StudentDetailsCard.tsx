import { motion, AnimatePresence } from 'framer-motion'
import { MdPerson, MdBadge, MdSchool, MdAccessTime, MdCheckCircle } from 'react-icons/md'
import type { StudentInfo, FingerprintStatus } from '../types/fingerprint.types'

interface StudentDetailsCardProps {
  student: StudentInfo | null
  status: FingerprintStatus
}

export default function StudentDetailsCard({ student, status }: StudentDetailsCardProps) {
  const show = (status === 'verified') && student !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Student Details</h3>

      <AnimatePresence mode="wait">
        {show ? (
          <motion.div
            key="student"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center border-2 border-white shadow-md"
              >
                <span className="text-xl font-bold text-white">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </motion.div>
              <div>
                <p className="text-lg font-bold text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-500">{student.rollNumber}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MdCheckCircle className="text-emerald-600 text-xl" />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdSchool className="text-gray-400 text-xs" />
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Department</span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{student.department}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdBadge className="text-gray-400 text-xs" />
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Roll Number</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{student.rollNumber}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdAccessTime className="text-gray-400 text-xs" />
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Time</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdCheckCircle className="text-gray-400 text-xs" />
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</span>
                </div>
                <p className="text-sm font-medium text-emerald-600">Present</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <MdPerson className="text-3xl text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">No student detected</p>
            <p className="text-xs text-gray-400 mt-1">Scan a fingerprint to view details</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
