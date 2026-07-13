import { motion } from 'framer-motion'
import { MdEdit, MdBookOnline, MdPrint } from 'react-icons/md'

interface ProfileActionsProps {
  onEdit: () => void
  onAssignCourse: () => void
  onPrint: () => void
}

export default function ProfileActions({ onEdit, onAssignCourse, onPrint }: ProfileActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all flex-1"
        >
          <MdEdit className="text-lg" />
          Edit Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAssignCourse}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm flex-1"
        >
          <MdBookOnline className="text-lg" />
          Assign Course
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrint}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm flex-1"
        >
          <MdPrint className="text-lg" />
          Print Profile
        </motion.button>
      </div>
    </motion.div>
  )
}
