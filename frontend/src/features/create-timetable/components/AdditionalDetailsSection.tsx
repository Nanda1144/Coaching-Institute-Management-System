import { motion } from 'framer-motion'
import { MdSettings, MdChevronRight } from 'react-icons/md'
import SearchableSelect from './SearchableSelect'
import type { DropdownOption } from '../types/timetableForm.types'

interface AdditionalDetailsSectionProps {
  values: { [key: string]: string }
  onChange: (field: string, value: string) => void
  errors: { [key: string]: string }
  statusOptions: DropdownOption[]
  recurringOptions: DropdownOption[]
  readOnlyFields?: string[]
}

export default function AdditionalDetailsSection({
  values, onChange, errors, statusOptions, recurringOptions, readOnlyFields = [],
}: AdditionalDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
          <MdSettings className="text-purple-500 text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Additional Details</h3>
          <p className="text-xs text-gray-500">Remarks, status and recurrence</p>
        </div>
        <MdChevronRight className="text-gray-300 ml-auto" />
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            {readOnlyFields.includes('remarks') ? (
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-500 min-h-[42px]">
                {values.remarks || 'No remarks'}
              </div>
            ) : (
              <textarea
                value={values.remarks}
                onChange={(e) => onChange('remarks', e.target.value)}
                rows={3}
                placeholder="Any additional notes or remarks..."
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.remarks
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
                }`}
              />
            )}
            {errors.remarks && <p className="text-xs text-red-500 mt-1">{errors.remarks}</p>}
          </div>
          <SearchableSelect
            label="Status"
            value={values.status}
            onChange={(v) => onChange('status', v)}
            options={statusOptions}
            error={errors.status}
            required
            placeholder="Select status..."
            disabled={readOnlyFields.includes('status')}
          />
          <SearchableSelect
            label="Recurring Class"
            value={values.recurringClass}
            onChange={(v) => onChange('recurringClass', v)}
            options={recurringOptions}
            error={errors.recurringClass}
            placeholder="Select recurrence..."
            disabled={readOnlyFields.includes('recurringClass')}
          />
        </div>
      </div>
    </motion.div>
  )
}
