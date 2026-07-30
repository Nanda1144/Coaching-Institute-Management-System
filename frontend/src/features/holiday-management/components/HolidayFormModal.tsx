import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdPreview, MdSave, MdAnnouncement, MdCalendarMonth } from 'react-icons/md'
import type { Holiday, HolidayType } from '../types/holiday.types'
import { HOLIDAY_TYPE_CONFIG } from '../types/holiday.types'

function getDateStr(h: Holiday | null): string {
  if (!h) return ''
  const d = (h as any).startDate || (h as any).date || h.date
  if (!d) return ''
  try {
    return typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

interface HolidayFormModalProps {
  isOpen: boolean
  holiday: Holiday | null
  onClose: () => void
  onSave: (data: Partial<Holiday>, status: 'draft' | 'upcoming') => void
}

const typeOptions: { value: string; label: string }[] = [
  { value: 'national', label: 'National' },
  { value: 'festival', label: 'Festival' },
  { value: 'academic', label: 'Academic' },
  { value: 'event', label: 'Event' },
]

const departmentOptions = [
  'All Departments', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Electronics', 'Mechanical', 'Civil', 'English', 'Biotechnology', 'Business Administration',
]

function getDayName(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' })
  } catch {
    return ''
  }
}

export default function HolidayFormModal({ isOpen, holiday, onClose, onSave }: HolidayFormModalProps) {
  const isEditing = !!holiday
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<HolidayType>('national')
  const [department, setDepartment] = useState('All Departments')
  const [description, setDescription] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (holiday) {
      setName((holiday as any).holidayName || holiday.name || '')
      setDate(getDateStr(holiday))
      setType((holiday as any).holidayType || holiday.type || 'national')
      setDepartment(
        Array.isArray((holiday as any).applicableDepartments)
          ? (holiday as any).applicableDepartments[0]
          : (holiday as any).department || holiday.department || 'All Departments'
      )
      setDescription(holiday.description || '')
    } else {
      setName('')
      setDate('')
      setType('national')
      setDepartment('All Departments')
      setDescription('')
    }
    setShowPreview(false)
  }, [holiday, isOpen])

  const dayName = useMemo(() => getDayName(date), [date])
  const cfg = HOLIDAY_TYPE_CONFIG[type]

  const previewData = useMemo((): Partial<Holiday> | null => {
    if (!name || !date) return null
    return { name, date, day: dayName, type, department, description }
  }, [name, date, dayName, type, department, description])

  const handleSave = async (status: 'draft' | 'upcoming') => {
    if (!name.trim()) return
    if (!date) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        id: holiday?.id,
        holidayName: name.trim(),
        name: name.trim(),
        startDate: date,
        date,
        day: dayName,
        holidayType: type,
        type,
        department,
        applicableDepartments: [department],
        description: description.trim(),
      }
      await onSave(payload as any, status)
    } finally {
      setSaving(false)
    }
  }

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Edit Holiday' : 'Create Holiday'}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter holiday name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as HolidayType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  >
                    {typeOptions.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter holiday description"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                />
              </div>

              <AnimatePresence>
                {showPreview && previewData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MdPreview className="text-primary" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cfg?.bg }}>
                          <MdCalendarMonth className="text-lg" style={{ color: cfg?.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{previewData.name}</p>
                          <p className="text-xs text-gray-500">{formattedDate} ({previewData.day})</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: cfg?.bg, color: cfg?.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg?.color }} />
                          {cfg?.label}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600">
                          Upcoming
                        </span>
                      </div>
                      {previewData.description && (
                        <p className="text-[11px] text-gray-500">{previewData.description}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MdPreview className="text-base" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving || !name.trim() || !date}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdSave className="text-base" />
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave('upcoming')}
                  disabled={saving || !name.trim() || !date}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAnnouncement className="text-base" />
                  {isEditing ? 'Update' : 'Save & Announce'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
