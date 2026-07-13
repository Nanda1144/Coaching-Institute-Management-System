import { motion } from 'framer-motion'
import { MdAdd, MdDelete, MdSave } from 'react-icons/md'

interface AssignmentActionsProps {
  onAssign: () => void
  onRemoveAll: () => void
  onSave: () => void
  canAssign: boolean
  hasSubjects: boolean
}

export default function AssignmentActions({ onAssign, onRemoveAll, onSave, canAssign, hasSubjects }: AssignmentActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Configure the assignment details and click Assign to add subjects
        </div>
        <div className="flex items-center gap-2">
          {hasSubjects && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRemoveAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 text-sm font-medium hover:bg-red-50 transition-all shadow-sm"
            >
              <MdDelete className="text-lg" />
              Remove All
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAssign}
            disabled={!canAssign}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdAdd className="text-lg" />
            Assign
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            disabled={!hasSubjects}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdSave className="text-lg" />
            Save
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
