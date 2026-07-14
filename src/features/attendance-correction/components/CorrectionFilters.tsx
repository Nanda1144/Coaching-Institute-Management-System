import { motion, type Variants } from 'framer-motion'
import { MdSearch, MdRefresh, MdArrowDropDown, MdDateRange, MdClose } from 'react-icons/md'
import type { CorrectionFilters as Filters } from '../types/attendanceCorrection.types'
import { filterOptions } from '../data/attendanceCorrectionData'

interface CorrectionFiltersProps {
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  onReset: () => void
}

const variants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
}

export default function CorrectionFilters({ filters, onFilterChange, onReset }: CorrectionFiltersProps) {
  const hasActive = filters.search || filters.department || filters.status || filters.date

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <motion.div
          custom={0} variants={variants} initial="hidden" animate="visible"
          className="relative flex-1 w-full sm:max-w-xs min-w-[180px]"
        >
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text" placeholder="Search by name, roll, ID..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          {filters.search && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <MdClose />
            </motion.button>
          )}
        </motion.div>

        <motion.div custom={1} variants={variants} initial="hidden" animate="visible"
          className="relative w-full sm:w-auto min-w-[160px]"
        >
          <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
          <select value={filters.department} onChange={(e) => onFilterChange('department', e.target.value)}
            className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
          >
            {filterOptions.departments.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </motion.div>

        <motion.div custom={2} variants={variants} initial="hidden" animate="visible"
          className="relative w-full sm:w-auto min-w-[140px]"
        >
          <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
          >
            {filterOptions.statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </motion.div>

        <motion.div custom={3} variants={variants} initial="hidden" animate="visible"
          className="relative w-full sm:w-auto min-w-[150px]"
        >
          <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
          <input type="date" value={filters.date} onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
          />
        </motion.div>

        <motion.button custom={4} variants={variants} initial="hidden" animate="visible"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-gray-800 transition-all shadow-sm"
        >
          <motion.div animate={hasActive ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.4 }}>
            <MdRefresh className="text-base" />
          </motion.div>
          Reset
        </motion.button>
      </div>
    </motion.div>
  )
}
