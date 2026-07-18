import { motion, AnimatePresence } from 'framer-motion'
import { MdPerson, MdBadge, MdSchool, MdGroup, MdAccessTime } from 'react-icons/md'
import type { RecognizedStudent, RecognitionStatusType } from '../types/faceRecognition.types'
import { getInitials } from '../../../utils/unwrap'

interface StudentInfoCardProps {
  student: RecognizedStudent | null
  status: RecognitionStatusType
}

export default function StudentInfoCard({ student, status }: StudentInfoCardProps) {
  const show = (status === 'detected' || status === 'marked') && student !== null


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Student Information</h3>

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
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-white shadow-md"
              >
                <span className="text-xl font-bold text-primary">{getInitials(student.name)}</span>
              </motion.div>
              <div>
                <p className="text-lg font-bold text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-500">{student.rollNumber}</p>
              </div>
              {status === 'marked' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MdSchool, label: 'Department', value: student.department },
                { icon: MdGroup, label: 'Batch', value: student.batch },
                { icon: MdBadge, label: 'Roll Number', value: student.rollNumber },
                { icon: MdAccessTime, label: 'Time', value: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
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
            <p className="text-xs text-gray-400 mt-1">Capture an image to recognize student</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
