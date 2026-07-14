import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MdCalendarMonth, MdEditCalendar, MdPlaylistAddCheck, MdWarning } from 'react-icons/md'
import type { TimetableEntry } from '../types/timetable.types'
import ConflictPanel from './ConflictPanel'
import EditScheduleModal from './EditScheduleModal'

interface QuickTimetableActionsProps {
  entries?: TimetableEntry[]
  onEditSave?: (entryId: string, updates: Partial<TimetableEntry>) => void
}

const defaultEntries: TimetableEntry[] = []

const actions = [
  { label: 'Create Timetable', icon: MdPlaylistAddCheck, color: '#3b82f6', bg: '#dbeafe', route: '/timetable/create' },
  { label: 'View Calendar', icon: MdCalendarMonth, color: '#10b981', bg: '#d1fae5', route: '/timetable/calendar' },
  { label: 'Edit Schedule', icon: MdEditCalendar, color: '#8b5cf6', bg: '#ede9fe', route: null, action: 'edit' },
  { label: 'Check Conflicts', icon: MdWarning, color: '#f59e0b', bg: '#fef3c7', route: null, action: 'conflicts' },
]

export default function QuickTimetableActions({ entries = defaultEntries, onEditSave }: QuickTimetableActionsProps) {
  const navigate = useNavigate()
  const [showConflicts, setShowConflicts] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleClick = (action: typeof actions[0]) => {
    if (action.route) {
      navigate(action.route)
    } else if (action.action === 'edit') {
      setShowEditModal(true)
    } else if (action.action === 'conflicts') {
      setShowConflicts(true)
    }
  }

  const handleEditSave = (entryId: string, updates: Partial<TimetableEntry>) => {
    if (onEditSave) {
      onEditSave(entryId, updates)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                whileHover={{ scale: 1.04, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(action)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: action.bg + '60' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: action.bg, color: action.color }}
                >
                  <Icon className="text-xl" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {showConflicts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowConflicts(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <ConflictPanel
                entries={entries}
                onClose={() => setShowConflicts(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditScheduleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        entries={entries}
        onSave={handleEditSave}
      />
    </>
  )
}