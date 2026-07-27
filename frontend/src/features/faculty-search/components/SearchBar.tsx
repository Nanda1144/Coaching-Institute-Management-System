import { MdSearch, MdClose, MdFilterList } from 'react-icons/md'
import { motion } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  resultCount: number
  onToggleFilters: () => void
  showFilters: boolean
}

export default function SearchBar({ value, onChange, resultCount, onToggleFilters, showFilters }: SearchBarProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search by name, ID, department, email..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          {value && (
            <button onClick={() => onChange('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <MdClose />
            </button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            showFilters
              ? 'bg-primary text-white border-primary shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm'
          }`}
        >
          <MdFilterList className="text-lg" />
          Filters
        </motion.button>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{resultCount} result{resultCount !== 1 ? 's' : ''} found</span>
        {value && (
          <span className="text-gray-400">
            Showing results for "<span className="text-gray-600 font-medium">{value}</span>"
          </span>
        )}
      </div>
    </div>
  )
}
