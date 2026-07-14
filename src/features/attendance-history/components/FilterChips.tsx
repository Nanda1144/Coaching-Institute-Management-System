import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdFilterList } from 'react-icons/md'
import type { HistoryFilters } from '../types/attendanceHistory.types'

interface FilterChipsProps {
  filters: HistoryFilters
  onFilterChange: (key: keyof HistoryFilters, value: string) => void
  onReset: () => void
}

const chipLabels: Record<keyof HistoryFilters, string> = {
  search: 'Search',
  department: 'Department',
  course: 'Course',
  batch: 'Batch',
  status: 'Status',
  method: 'Method',
  dateFrom: 'From',
  dateTo: 'To',
}

export default function FilterChips({ filters, onFilterChange, onReset }: FilterChipsProps) {
  const active = Object.entries(filters).filter(([, v]) => v !== '') as [keyof HistoryFilters, string][]

  if (active.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-2 flex-wrap"
    >
      <MdFilterList className="text-primary text-sm flex-shrink-0" />
      <AnimatePresence>
        {active.map(([key, value]) => (
          <motion.span
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
          >
            {chipLabels[key]}: {value.length > 18 ? value.slice(0, 18) + '...' : value}
            <button
              onClick={() => onFilterChange(key, '')}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <MdClose className="text-xs" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="text-[10px] text-red-500 hover:text-red-600 font-medium ml-1"
      >
        Clear all
      </motion.button>
    </motion.div>
  )
}
