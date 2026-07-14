import { motion, AnimatePresence } from 'framer-motion'
import { MdCheckCircle, MdClose, MdWarning } from 'react-icons/md'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  formValues: { [key: string]: string }
}

const summarySections = [
  {
    title: 'Academic Details',
    fields: [
      { key: 'academicYear', label: 'Academic Year' },
      { key: 'semester', label: 'Semester' },
      { key: 'department', label: 'Department' },
      { key: 'course', label: 'Course' },
      { key: 'batch', label: 'Batch' },
      { key: 'section', label: 'Section' },
    ],
  },
  {
    title: 'Class Details',
    fields: [
      { key: 'subject', label: 'Subject' },
      { key: 'faculty', label: 'Faculty' },
      { key: 'classroom', label: 'Classroom' },
      { key: 'building', label: 'Building' },
      { key: 'floor', label: 'Floor' },
    ],
  },
  {
    title: 'Schedule',
    fields: [
      { key: 'day', label: 'Day' },
      { key: 'startTime', label: 'Start Time' },
      { key: 'endTime', label: 'End Time' },
      { key: 'duration', label: 'Duration' },
    ],
  },
  {
    title: 'Additional Details',
    fields: [
      { key: 'status', label: 'Status' },
      { key: 'recurringClass', label: 'Recurring' },
      { key: 'remarks', label: 'Remarks' },
    ],
  },
]

export default function ConfirmModal({ isOpen, onClose, onConfirm, formValues }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-[520px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MdCheckCircle className="text-emerald-500 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Confirm Timetable</h3>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <MdClose className="text-gray-500 text-lg" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Please review the timetable details before saving.
              </p>

              {summarySections.map((section) => {
                const hasAnyValue = section.fields.some(
                  (f) => formValues[f.key] && formValues[f.key].trim()
                )
                if (!hasAnyValue) return null
                return (
                  <div key={section.title} className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                      {section.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {section.fields.map((field) => {
                        const val = formValues[field.key]
                        if (!val || !val.trim()) return null
                        return (
                          <div key={field.key} className="flex justify-between">
                            <span className="text-xs text-gray-500">{field.label}</span>
                            <span className="text-xs font-medium text-gray-800 text-right truncate max-w-[140px]">
                              {field.key === 'startTime' || field.key === 'endTime'
                                ? new Date(`2000-01-01T${val}`).toLocaleTimeString('en-US', {
                                    hour: '2-digit', minute: '2-digit', hour12: true,
                                  })
                                : val}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <MdWarning />
                This timetable entry will be added to the system. Verify all details before confirming.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                Confirm & Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
