import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdSave, MdUndo, MdEdit, MdAccessTime, MdBook, MdPerson, MdMeetingRoom, MdGroup } from 'react-icons/md'
import type { TimetableEntry } from '../types/timetable.types'
import { getFacultyName } from '../../../utils/unwrap'

interface EditScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  entries: TimetableEntry[]
  onSave: (entryId: string, updates: Partial<TimetableEntry>) => void
}

const statusOptions = ['ongoing', 'scheduled', 'completed', 'cancelled'] as const

export default function EditScheduleModal({ isOpen, onClose, entries, onSave }: EditScheduleModalProps) {
  const [editEntries, setEditEntries] = useState<TimetableEntry[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [activeEditId, setActiveEditId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setEditEntries(entries.map(e => ({ ...e })))
      setSavedIds(new Set())
      setActiveEditId(null)
    }
  }, [isOpen, entries])

  const handleFieldChange = useCallback((entryId: string, field: keyof TimetableEntry, value: string) => {
    setEditEntries(prev =>
      prev.map(e => (e.id === entryId ? { ...e, [field]: value } : e))
    )
    setSavedIds(prev => {
      const next = new Set(prev)
      next.delete(entryId)
      return next
    })
  }, [])

  const handleSaveEntry = useCallback((entryId: string) => {
    const entry = editEntries.find(e => e.id === entryId)
    if (!entry) return
    onSave(entryId, entry)
    setSavedIds(prev => new Set(prev).add(entryId))
    setActiveEditId(null)
  }, [editEntries, onSave])

  const handleResetEntry = useCallback((entryId: string) => {
    const original = entries.find(e => e.id === entryId)
    if (!original) return
    setEditEntries(prev =>
      prev.map(e => (e.id === entryId ? { ...original } : e))
    )
    setSavedIds(prev => {
      const next = new Set(prev)
      next.delete(entryId)
      return next
    })
  }, [entries])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-8 px-4 bg-black/20 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                  <MdEdit className="text-purple-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Edit Schedule</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Make inline edits to today&apos;s schedule entries
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="text-xl" />
              </motion.button>
            </div>

            <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
              {editEntries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No schedule entries available to edit.</p>
                </div>
              ) : (
                editEntries.map((entry, index) => {
                  const isEditing = activeEditId === entry.id
                  const isSaved = savedIds.has(entry.id)

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`rounded-xl border transition-all ${
                        isEditing
                          ? 'border-purple-300 bg-purple-50/40 shadow-md'
                          : isSaved
                          ? 'border-green-200 bg-green-50/30'
                          : 'border-gray-200 bg-white/60 hover:border-gray-300'
                      }`}
                    >
                      {isEditing ? (
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-purple-600 font-medium">{entry.id}</span>
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSaveEntry(entry.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium shadow-sm"
                              >
                                <MdSave /> Save
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleResetEntry(entry.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                              >
                                <MdUndo /> Reset
                              </motion.button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <MdAccessTime /> Time
                              </label>
                              <input
                                value={entry.time}
                                onChange={(e) => handleFieldChange(entry.id, 'time', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <MdBook /> Subject
                              </label>
                              <input
                                value={entry.subject}
                                onChange={(e) => handleFieldChange(entry.id, 'subject', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <MdPerson /> Faculty
                              </label>
                              <input
                                value={typeof entry.faculty === 'object' ? getFacultyName(entry.faculty) : entry.faculty}
                                onChange={(e) => handleFieldChange(entry.id, 'faculty', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <MdMeetingRoom /> Classroom
                              </label>
                              <input
                                value={entry.classroom}
                                onChange={(e) => handleFieldChange(entry.id, 'classroom', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <MdGroup /> Batch
                              </label>
                              <input
                                value={entry.batch}
                                onChange={(e) => handleFieldChange(entry.id, 'batch', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                Status
                              </label>
                              <select
                                value={entry.status}
                                onChange={(e) => handleFieldChange(entry.id, 'status', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              >
                                {statusOptions.map((s) => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                Course
                              </label>
                              <input
                                value={entry.course}
                                onChange={(e) => handleFieldChange(entry.id, 'course', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                Department
                              </label>
                              <input
                                value={entry.department}
                                onChange={(e) => handleFieldChange(entry.id, 'department', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/50 transition-colors"
                          onClick={() => setActiveEditId(entry.id)}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSaved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {isSaved ? <MdSave className="text-sm" /> : <MdEdit className="text-sm" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">{entry.subject}</span>
                              {isSaved && (
                                <span className="text-[10px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                  Saved
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                              <span>{entry.time}</span>
                              <span className="text-gray-300">|</span>
                              <span>{getFacultyName(entry.faculty) || 'Unknown'}</span>
                              <span className="text-gray-300">|</span>
                              <span>{entry.classroom}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md">
                            {entry.id}
                          </span>
                          <motion.span
                            animate={{ x: isEditing ? 5 : 0 }}
                            className="text-gray-300 text-sm"
                          >
                            <MdEdit />
                          </motion.span>
                        </div>
                      )}
                    </motion.div>
                  )
                })
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-xs text-gray-500">
                {savedIds.size} of {editEntries.length} entries saved
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md"
              >
                Done Editing
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}