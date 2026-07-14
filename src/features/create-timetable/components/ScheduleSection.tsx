import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarMonth, MdChevronRight } from 'react-icons/md'
import SearchableSelect from './SearchableSelect'
import TimePickerField from './TimePickerField'
import type { DropdownOption } from '../types/timetableForm.types'

interface ScheduleSectionProps {
  values: { [key: string]: string }
  onChange: (field: string, value: string) => void
  errors: { [key: string]: string }
  dayOptions: DropdownOption[]
  readOnlyFields?: string[]
}

function calculateDuration(start: string, end: string): string {
  if (!start || !end) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  if (diff <= 0) return ''
  const hrs = Math.floor(diff / 60)
  const mins = diff % 60
  if (hrs === 0) return `${mins} min`
  if (mins === 0) return `${hrs} hr`
  return `${hrs} hr ${mins} min`
}

export default function ScheduleSection({ values, onChange, errors, dayOptions, readOnlyFields = [] }: ScheduleSectionProps) {
  const duration = calculateDuration(values.startTime, values.endTime)

  useEffect(() => {
    const d = calculateDuration(values.startTime, values.endTime)
    if (d !== values.duration) {
      onChange('duration', d)
    }
  }, [values.startTime, values.endTime])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <MdCalendarMonth className="text-emerald-500 text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Schedule</h3>
          <p className="text-xs text-gray-500">Day and time slot details</p>
        </div>
        <MdChevronRight className="text-gray-300 ml-auto" />
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchableSelect
            label="Day"
            value={values.day}
            onChange={(v) => onChange('day', v)}
            options={dayOptions}
            error={errors.day}
            required
            placeholder="Select day..."
            disabled={readOnlyFields.includes('day')}
          />
          <TimePickerField
            label="Start Time"
            value={values.startTime}
            onChange={(v) => onChange('startTime', v)}
            error={errors.startTime}
            required
            disabled={readOnlyFields.includes('startTime')}
          />
          <TimePickerField
            label="End Time"
            value={values.endTime}
            onChange={(v) => onChange('endTime', v)}
            error={errors.endTime}
            required
            disabled={readOnlyFields.includes('endTime')}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-500 flex items-center h-[42px]">
              {duration || 'Auto-calculated'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
