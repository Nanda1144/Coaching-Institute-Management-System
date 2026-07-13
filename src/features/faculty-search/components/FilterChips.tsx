import { motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import type { SearchFilters } from '../types/search.types'

interface FilterChipsProps {
  filters: SearchFilters
  onRemove: (key: keyof SearchFilters) => void
}

const labels: Record<keyof SearchFilters, string> = {
  facultyName: 'Name',
  facultyId: 'ID',
  department: 'Department',
  branch: 'Branch',
  qualification: 'Qualification',
  experience: 'Experience',
  status: 'Status',
  designation: 'Designation',
  gender: 'Gender',
}

export default function FilterChips({ filters, onRemove }: FilterChipsProps) {
  const active = Object.entries(filters).filter(([, v]) => v !== '') as [keyof SearchFilters, string][]

  if (active.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {active.map(([key, value]) => (
        <motion.span
          key={key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
        >
          {labels[key]}: {value}
          <button onClick={() => onRemove(key)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
            <MdClose className="text-xs" />
          </button>
        </motion.span>
      ))}
    </div>
  )
}
