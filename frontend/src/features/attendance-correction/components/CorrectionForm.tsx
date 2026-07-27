import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdSend, MdPerson, MdBadge, MdSchool, MdBook, MdDateRange, MdTextFields, MdAttachFile, MdClose } from 'react-icons/md'
import { filterOptions, attendanceStatuses } from '../data/attendanceCorrectionData'
import type { RequestFormData } from '../types/attendanceCorrection.types'

interface CorrectionFormProps {
  onSubmit: (data: RequestFormData) => void
}

const initialForm: RequestFormData = {
  studentName: '', rollNumber: '', department: '', subject: '',
  attendanceDate: '', currentStatus: 'present', requestedStatus: 'present',
  reason: '', attachment: null,
}

export default function CorrectionForm({ onSubmit }: CorrectionFormProps) {
  const [form, setForm] = useState<RequestFormData>(initialForm)
  const [fileName, setFileName] = useState<string | null>(null)

  const update = useCallback((key: keyof RequestFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.studentName || !form.rollNumber || !form.department || !form.subject || !form.attendanceDate || !form.reason) return
    onSubmit(form)
    setForm(initialForm)
    setFileName(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      update('attachment', file.name)
    }
  }

  const canSubmit = form.studentName && form.rollNumber && form.department && form.subject && form.attendanceDate && form.reason

  const fields: { key: keyof RequestFormData; label: string; icon: typeof MdPerson; type: 'text' | 'select' | 'date'; options?: { value: string; label: string }[] }[] = [
    { key: 'studentName', label: 'Student Name', icon: MdPerson, type: 'text' },
    { key: 'rollNumber', label: 'Roll Number', icon: MdBadge, type: 'text' },
    { key: 'department', label: 'Department', icon: MdSchool, type: 'select', options: filterOptions.departments.filter(d => d.value) },
    { key: 'subject', label: 'Subject', icon: MdBook, type: 'select', options: filterOptions.subjects.map(s => ({ value: s, label: s })) },
    { key: 'attendanceDate', label: 'Attendance Date', icon: MdDateRange, type: 'date' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <MdSend className="text-amber-600 text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Request Correction</h3>
          <p className="text-xs text-gray-500">Submit attendance correction request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field) => {
            const Icon = field.icon
            return (
              <div key={field.key}>
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">{field.label}</label>
                {field.type === 'select' ? (
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <select
                      value={form[field.key] as string}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type={field.type}
                      value={form[field.key] as string}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                )}
              </div>
            )
          })}

          <div>
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Current Status</label>
            <select
              value={form.currentStatus}
              onChange={(e) => update('currentStatus', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            >
              {(attendanceStatuses as { value: string; label: string }[]).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Requested Status</label>
            <select
              value={form.requestedStatus}
              onChange={(e) => update('requestedStatus', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            >
              {(attendanceStatuses as { value: string; label: string }[]).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Reason</label>
          <div className="relative">
            <MdTextFields className="absolute left-3 top-3 text-gray-400 text-sm" />
            <textarea
              value={form.reason}
              onChange={(e) => update('reason', e.target.value)}
              placeholder="Explain why you are requesting this correction..."
              rows={3}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Attachment (optional)</label>
          <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all">
            <MdAttachFile className="text-gray-400 text-lg" />
            {fileName ? (
              <span className="text-gray-700 font-medium flex-1 truncate">{fileName}</span>
            ) : (
              <span className="flex-1">Upload supporting document...</span>
            )}
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            {fileName && (
              <button type="button" onClick={() => { setFileName(null); update('attachment', '') }} className="text-gray-400 hover:text-red-500">
                <MdClose />
              </button>
            )}
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <motion.button
            whileHover={canSubmit ? { scale: 1.03 } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            type="submit"
            disabled={!canSubmit}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium shadow-md transition-all ${
              canSubmit ? 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <MdSend className="text-lg" />
            Submit Request
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => { setForm(initialForm); setFileName(null) }}
            className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
