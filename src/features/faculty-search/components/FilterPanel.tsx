import { motion, AnimatePresence } from 'framer-motion'
import { MdPerson, MdBadge, MdSchool, MdBusiness, MdBook, MdTimeline, MdCircle, MdWork, MdMale } from 'react-icons/md'
import type { SearchFilters } from '../types/search.types'

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (key: keyof SearchFilters, value: string) => void
  onClear: () => void
  isOpen: boolean
  departmentOptions: string[]
  branchOptions: string[]
  qualificationOptions: string[]
  designationOptions: string[]
  statusOptions: string[]
  genderOptions: string[]
  experienceRanges: { label: string; value: string }[]
}

const filterConfig: { key: keyof SearchFilters; label: string; icon: typeof MdPerson }[] = [
  { key: 'facultyName', label: 'Faculty Name', icon: MdPerson },
  { key: 'facultyId', label: 'Faculty ID', icon: MdBadge },
  { key: 'department', label: 'Department', icon: MdSchool },
  { key: 'branch', label: 'Branch', icon: MdBusiness },
  { key: 'qualification', label: 'Qualification', icon: MdBook },
  { key: 'designation', label: 'Designation', icon: MdWork },
  { key: 'status', label: 'Status', icon: MdCircle },
  { key: 'gender', label: 'Gender', icon: MdMale },
  { key: 'experience', label: 'Experience', icon: MdTimeline },
]

export default function FilterPanel({
  filters, onChange, onClear, isOpen,
  departmentOptions, branchOptions, qualificationOptions,
  designationOptions, statusOptions, genderOptions, experienceRanges,
}: FilterPanelProps) {
  const getOptions = (key: keyof SearchFilters) => {
    if (key === 'department') return departmentOptions
    if (key === 'branch') return branchOptions
    if (key === 'qualification') return qualificationOptions
    if (key === 'designation') return designationOptions
    if (key === 'status') return statusOptions
    if (key === 'gender') return genderOptions
    if (key === 'experience') return experienceRanges.map(r => r.label)
    return []
  }

  const getValue = (key: keyof SearchFilters) => {
    if (key === 'experience') {
      const found = experienceRanges.find(r => r.value === filters.experience)
      return found ? found.label : ''
    }
    return filters[key] as string
  }

  const setValue = (key: keyof SearchFilters, label: string) => {
    if (key === 'experience') {
      const found = experienceRanges.find(r => r.label === label)
      onChange(key, found?.value || '')
    } else {
      onChange(key, label)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Advanced Filters</h3>
              <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600 font-medium">
                Clear All Filters
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {filterConfig.map(cfg => {
                const Icon = cfg.icon
                const isTextInput = cfg.key === 'facultyName' || cfg.key === 'facultyId'
                const currentValue = getValue(cfg.key)
                const options = getOptions(cfg.key)

                return (
                  <div key={cfg.key} className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Icon className="text-gray-400" /> {cfg.label}
                    </label>
                    {isTextInput ? (
                      <input
                        value={currentValue}
                        onChange={e => onChange(cfg.key, e.target.value)}
                        placeholder={`Enter ${cfg.label.toLowerCase()}...`}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <select
                        value={currentValue}
                        onChange={e => setValue(cfg.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">All</option>
                        {options.map(o =>
                          <option key={o} value={o}>{o}</option>
                        )}
                      </select>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
