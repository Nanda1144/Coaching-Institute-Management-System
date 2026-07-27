import { motion } from 'framer-motion'
import { MdBook, MdChevronRight } from 'react-icons/md'
import type { DropdownOption, Errors } from '../types/manualAttendance.types'

interface ClassDetailsSectionProps {
  values: Record<string, string>
  onChange: (field: string, value: string) => void
  errors: Errors
  subjectOptions: DropdownOption[]
  facultyOptions: DropdownOption[]
}

export default function ClassDetailsSection({
  values, onChange, errors, subjectOptions, facultyOptions,
}: ClassDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-accent/5 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
          <MdBook className="text-accent text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Class Details</h3>
          <p className="text-xs text-gray-500">Subject, faculty, date and time</p>
        </div>
        <MdChevronRight className="text-gray-300 ml-auto" />
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={values.subject}
              onChange={(e) => onChange('subject', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                errors.subject
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
              }`}
            >
              {subjectOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Faculty <span className="text-red-500">*</span>
            </label>
            <select
              value={values.faculty}
              onChange={(e) => onChange('faculty', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                errors.faculty
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
              }`}
            >
              {facultyOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {errors.faculty && <p className="text-xs text-red-500">{errors.faculty}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={values.date}
              onChange={(e) => onChange('date', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all ${
                errors.date
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
              }`}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={values.time}
              onChange={(e) => onChange('time', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all ${
                errors.time
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
              }`}
            />
            {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
