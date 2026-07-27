import { motion, type Variants } from 'framer-motion'
import { MdSearch, MdRefresh, MdFilterList, MdClose, MdArrowDropDown, MdDateRange } from 'react-icons/md'
import type { AttendanceFilterState } from '../types/attendance.types'

interface AttendanceFiltersProps {
  filters: AttendanceFilterState
  onFilterChange: (key: keyof AttendanceFilterState, value: string) => void
  onReset: () => void
  departmentOptions: { value: string; label: string }[]
}

const filterVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.3, ease: 'easeOut' as const },
  }),
}

export default function AttendanceFilters({ filters, onFilterChange, onReset, departmentOptions }: AttendanceFiltersProps) {
  const hasActiveFilters = filters.search || filters.department || filters.date

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4"
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

        <motion.div
          custom={1}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full sm:w-auto min-w-[160px]"
        >
          <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
          <select
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
          >
            {departmentOptions.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </motion.div>

        <motion.div
          custom={2}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full sm:w-auto min-w-[160px]"
        >
          <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
          />
        </motion.div>

        <motion.button
          custom={3}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.03, backgroundColor: '#f8fafc' }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-gray-800 transition-all shadow-sm"
        >
          <motion.div
            animate={hasActiveFilters ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MdRefresh className="text-base" />
          </motion.div>
          Reset
        </motion.button>
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 flex items-center gap-2 text-xs text-gray-500"
        >
          <MdFilterList className="text-sm text-primary" />
          <span>
            Filtering by
            {filters.search && <span className="font-medium text-gray-700"> &ldquo;{filters.search}&rdquo;</span>}
            {filters.department && <span className="font-medium text-gray-700"> {filters.department}</span>}
            {filters.date && <span className="font-medium text-gray-700"> {filters.date}</span>}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="ml-1 text-red-500 hover:text-red-600 font-medium"
          >
            Clear
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
