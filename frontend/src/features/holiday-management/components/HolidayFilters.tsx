import { motion } from 'framer-motion'
import { MdSearch, MdRefresh } from 'react-icons/md'
import type { HolidayFilters as FilterType } from '../types/holiday.types'

interface HolidayFiltersProps {
  filters: FilterType
  onFilterChange: (key: keyof FilterType, value: string) => void
  onReset: () => void
  departmentOptions: string[]
  monthOptions: { value: string; label: string }[]
  typeOptions: { value: string; label: string }[]
}

export default function HolidayFilters({
  filters, onFilterChange, onReset, departmentOptions, monthOptions, typeOptions,
}: HolidayFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search holidays..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
        <select
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          {departmentOptions.map((d) => (
            <option key={d} value={d === 'All Departments' ? '' : d}>{d}</option>
          ))}
        </select>
        <select
          value={filters.month}
          onChange={(e) => onFilterChange('month', e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          {typeOptions.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
        >
          <MdRefresh className="text-base" />
          Reset
        </motion.button>
      </div>
    </motion.div>
  )
}
