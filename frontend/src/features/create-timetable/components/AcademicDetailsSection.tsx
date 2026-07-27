import { motion } from 'framer-motion'
import { MdSchool, MdChevronRight } from 'react-icons/md'
import SearchableSelect from './SearchableSelect'
import type { DropdownOption } from '../types/timetableForm.types'

interface AcademicDetailsSectionProps {
  values: { [key: string]: string }
  onChange: (field: string, value: string) => void
  errors: { [key: string]: string }
  academicYearOptions: DropdownOption[]
  semesterOptions: DropdownOption[]
  departmentOptions: DropdownOption[]
  courseOptions: DropdownOption[]
  batchOptions: DropdownOption[]
  sectionOptions: DropdownOption[]
  readOnlyFields?: string[]
}

export default function AcademicDetailsSection({
  values, onChange, errors,
  academicYearOptions, semesterOptions, departmentOptions,
  courseOptions, batchOptions, sectionOptions,
  readOnlyFields = [],
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
          <SearchableSelect
            label="Academic Year"
            value={values.academicYear}
            onChange={(v) => onChange('academicYear', v)}
            options={academicYearOptions}
            error={errors.academicYear}
            required
            placeholder="Select academic year..."
            disabled={readOnlyFields.includes('academicYear')}
          />
          <SearchableSelect
            label="Semester"
            value={values.semester}
            onChange={(v) => onChange('semester', v)}
            options={semesterOptions}
            error={errors.semester}
            required
            placeholder="Select semester..."
            disabled={readOnlyFields.includes('semester')}
          />
          <SearchableSelect
            label="Department"
            value={values.department}
            onChange={(v) => onChange('department', v)}
            options={departmentOptions}
            error={errors.department}
            required
            placeholder="Select department..."
            disabled={readOnlyFields.includes('department')}
          />
          <SearchableSelect
            label="Course"
            value={values.course}
            onChange={(v) => onChange('course', v)}
            options={courseOptions}
            error={errors.course}
            required
            placeholder="Select course..."
            disabled={readOnlyFields.includes('course')}
          />
          <SearchableSelect
            label="Batch"
            value={values.batch}
            onChange={(v) => onChange('batch', v)}
            options={batchOptions}
            error={errors.batch}
            required
            placeholder="Select batch..."
            disabled={readOnlyFields.includes('batch')}
          />
          <SearchableSelect
            label="Section"
            value={values.section}
            onChange={(v) => onChange('section', v)}
            options={sectionOptions}
            error={errors.section}
            required
            placeholder="Select section..."
            disabled={readOnlyFields.includes('section')}
          />
        </div>
      </div>
    </motion.div>
  )
}
