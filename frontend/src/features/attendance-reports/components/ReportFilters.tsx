import { motion, type Variants } from 'framer-motion'
import { MdRefresh, MdArrowDropDown, MdDateRange, MdAssessment } from 'react-icons/md'
import type { ReportFilters as ReportFiltersType } from '../types/attendanceReports.types'
import { filterOptions } from '../data/attendanceReportsData'

interface ReportFiltersProps {
  filters: ReportFiltersType
  onFilterChange: (key: keyof ReportFiltersType, value: string) => void
  onReset: () => void
}

const variants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
}

const fields: { key: keyof ReportFiltersType; label: string; options: { value: string; label: string }[] }[] = [
  { key: 'department', label: 'Department', options: filterOptions.departments },
  { key: 'course', label: 'Course', options: filterOptions.courses },
  { key: 'batch', label: 'Batch', options: filterOptions.batches },
]

export default function ReportFilters({ filters, onFilterChange, onReset }: ReportFiltersProps) {
  const hasActive = filters.department || filters.course || filters.batch || filters.dateFrom || filters.dateTo

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        {fields.map((field, i) => (
          <motion.div
            key={field.key}
            custom={i}
            variants={variants}
            initial="hidden"
            animate="visible"
            className="relative w-full sm:w-auto min-w-[160px]"
          >
            <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
            <select
              value={filters[field.key]}
              onChange={(e) => onFilterChange(field.key, e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </motion.div>
        ))}

        <motion.div
          custom={3}
          variants={variants}
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
          custom={4}
          variants={variants}
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

        <motion.div
          custom={5}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="relative w-full sm:w-auto min-w-[160px]"
        >
          <MdAssessment className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
          <MdArrowDropDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl" />
          <select
            value={filters.reportType}
            onChange={(e) => onFilterChange('reportType', e.target.value)}
            className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-gradient-to-r from-primary/5 to-transparent text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/30"
          >
            {filterOptions.reportTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </motion.div>

        <motion.button
          custom={6}
          variants={variants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
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
