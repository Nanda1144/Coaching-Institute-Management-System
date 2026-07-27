import { motion } from 'framer-motion'
import { MdSchool, MdChevronRight } from 'react-icons/md'
import type { DropdownOption, Errors } from '../types/manualAttendance.types'

interface AcademicDetailsSectionProps {
  values: Record<string, string>
  onChange: (field: string, value: string) => void
  errors: Errors
  departmentOptions: DropdownOption[]
  courseOptions: DropdownOption[]
  semesterOptions: DropdownOption[]
  batchOptions: DropdownOption[]
  sectionOptions: DropdownOption[]
}

export default function AcademicDetailsSection({
  values, onChange, errors,
  departmentOptions, courseOptions, semesterOptions, batchOptions, sectionOptions,
}: AcademicDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <MdSchool className="text-primary text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Academic Details</h3>
          <p className="text-xs text-gray-500">Course and batch information</p>
        </div>
        <MdChevronRight className="text-gray-300 ml-auto" />
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{ key: 'department', label: 'Department', ops: departmentOptions },
            { key: 'course', label: 'Course', ops: courseOptions },
            { key: 'semester', label: 'Semester', ops: semesterOptions },
            { key: 'batch', label: 'Batch', ops: batchOptions },
            { key: 'section', label: 'Section', ops: sectionOptions },
          ].map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <select
                value={values[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                  errors[field.key]
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
                }`}
              >
                {field.ops.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors[field.key] && <p className="text-xs text-red-500">{errors[field.key]}</p>}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
