import { MdVisibility, MdEdit, MdDelete, MdBookOnline } from 'react-icons/md'
import { motion } from 'framer-motion'

interface FacultyActionsProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onAssignCourse: () => void
}

export default function FacultyActions({ onView, onEdit, onDelete, onAssignCourse }: FacultyActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onView}
        title="View"
        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <MdVisibility className="text-lg" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onEdit}
        title="Edit"
        className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
      >
        <MdEdit className="text-lg" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDelete}
        title="Delete"
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <MdDelete className="text-lg" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAssignCourse}
        title="Assign Course"
        className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
      >
        <MdBookOnline className="text-lg" />
      </motion.button>
    </div>
  )
}
