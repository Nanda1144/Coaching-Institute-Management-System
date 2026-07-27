import { motion } from 'framer-motion'
import { MdBook, MdChevronRight } from 'react-icons/md'
import SearchableSelect from './SearchableSelect'
import type { DropdownOption } from '../types/timetableForm.types'

interface ClassDetailsSectionProps {
  values: { [key: string]: string }
  onChange: (field: string, value: string) => void
  errors: { [key: string]: string }
  subjectOptions: DropdownOption[]
  facultyOptions: DropdownOption[]
  classroomOptions: DropdownOption[]
  buildingOptions: DropdownOption[]
  floorOptions: DropdownOption[]
  readOnlyFields?: string[]
}

export default function ClassDetailsSection({
  values, onChange, errors,
  subjectOptions, facultyOptions, classroomOptions, buildingOptions, floorOptions,
  readOnlyFields = [],
}: ClassDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
          <MdBook className="text-accent text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Class Details</h3>
          <p className="text-xs text-gray-500">Subject, faculty and classroom information</p>
        </div>
        <MdChevronRight className="text-gray-300 ml-auto" />
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchableSelect
            label="Subject"
            value={values.subject}
            onChange={(v) => onChange('subject', v)}
            options={subjectOptions}
            error={errors.subject}
            required
            placeholder="Select subject..."
            disabled={readOnlyFields.includes('subject')}
          />
          <SearchableSelect
            label="Faculty"
            value={values.faculty}
            onChange={(v) => onChange('faculty', v)}
            options={facultyOptions}
            error={errors.faculty}
            required
            placeholder="Select faculty..."
            disabled={readOnlyFields.includes('faculty')}
          />
          <SearchableSelect
            label="Classroom"
            value={values.classroom}
            onChange={(v) => onChange('classroom', v)}
            options={classroomOptions}
            error={errors.classroom}
            required
            placeholder="Select classroom..."
            disabled={readOnlyFields.includes('classroom')}
          />
          <SearchableSelect
            label="Building"
            value={values.building}
            onChange={(v) => onChange('building', v)}
            options={buildingOptions}
            error={errors.building}
            required
            placeholder="Select building..."
            disabled={readOnlyFields.includes('building')}
          />
          <SearchableSelect
            label="Floor"
            value={values.floor}
            onChange={(v) => onChange('floor', v)}
            options={floorOptions}
            error={errors.floor}
            required
            placeholder="Select floor..."
            disabled={readOnlyFields.includes('floor')}
          />
        </div>
      </div>
    </motion.div>
  )
}
