import { motion, type Variants } from 'framer-motion'
import { MdSearch, MdRefresh, MdClose, MdArrowDropDown, MdDateRange } from 'react-icons/md'
import type { HistoryFilters } from '../types/attendanceHistory.types'
import { filterOptions } from '../data/attendanceHistoryData'

interface AttendanceHistoryFiltersProps {
  filters: HistoryFilters
  onFilterChange: (key: keyof HistoryFilters, value: string) => void
  onReset: () => void
}

const filterVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
}

const filterFields: { key: keyof HistoryFilters; label: string; options: { value: string; label: string }[]; icon?: boolean }[] = [
  { key: 'department', label: 'Department', options: filterOptions.departments },
  { key: 'course', label: 'Course', options: filterOptions.courses },
  { key: 'batch', label: 'Batch', options: filterOptions.batches },
  { key: 'status', label: 'Status', options: filterOptions.statuses },
  { key: 'method', label: 'Method', options: filterOptions.methods },
]

export default function AttendanceHistoryFilters({ filters, onFilterChange, onReset }: AttendanceHistoryFiltersProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <motion.div
          custom={0}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="relative flex-1 w-full sm:max-w-xs min-w-[180px]"
        >
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, roll number..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          {filters.search && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <MdClose />
            </motion.button>
          )}
        </motion.div>

        {filterFields.slice(0, 3).map((field, i) => (
          <motion.div
            key={field.key}
            custom={i + 1}
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full sm:w-auto min-w-[150px]"
          >
            <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
            <select
              value={filters[field.key]}
              onChange={(e) => onFilterChange(field.key as keyof HistoryFilters, e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </motion.div>
        ))}

        <motion.button
          custom={4}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-gray-800 transition-all shadow-sm"
        >
          <motion.div animate={hasActiveFilters ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.4 }}>
            <MdRefresh className="text-base" />
          </motion.div>
          Reset
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        {filterFields.slice(3).map((field, i) => (
          <motion.div
            key={field.key}
            custom={i + 5}
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full sm:w-auto min-w-[150px]"
          >
            <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
            <select
              value={filters[field.key]}
              onChange={(e) => onFilterChange(field.key as keyof HistoryFilters, e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </motion.div>
        ))}

        <motion.div
          custom={7}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full sm:w-auto min-w-[150px]"
        >
          <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
            title="From date"
          />
        </motion.div>

        <motion.div
          custom={8}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full sm:w-auto min-w-[150px]"
        >
          <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
            title="To date"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
