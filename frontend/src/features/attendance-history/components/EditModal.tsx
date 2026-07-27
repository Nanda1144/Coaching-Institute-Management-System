import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdSave } from 'react-icons/md'
import type { HistoryRecord, AttendanceStatus, AttendanceMethod } from '../types/attendanceHistory.types'
import Toast from '../../../components/Toast'

interface EditModalProps {
  record: HistoryRecord | null
  onClose: () => void
  onSave: (record: HistoryRecord) => void
}

export default function EditModal({ record, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<HistoryRecord | null>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (record) setForm({ ...record })
  }, [record])

  const handleSave = () => {
    if (!form) return
    onSave(form)
    setShowToast(true)
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  if (!form || !record) return null

  return (
    <AnimatePresence>
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
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <MdSave className="text-amber-600 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Edit Attendance</h3>
                <p className="text-[10px] text-gray-500">{record.studentName}</p>
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
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'time', label: 'Time', type: 'time' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof HistoryRecord] as string}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as AttendanceStatus })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Method</label>
                <select
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value as AttendanceMethod })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                >
                  <option value="manual">Manual</option>
                  <option value="face">Face Recognition</option>
                  <option value="fingerprint">Fingerprint</option>
                  <option value="qr">QR Code</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Faculty</label>
              <input
                type="text"
                value={form.faculty}
                onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                <MdSave className="text-lg" />
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>

        <Toast
          message={`Attendance updated for ${form.studentName}`}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </motion.div>
    </AnimatePresence>
  )
}
