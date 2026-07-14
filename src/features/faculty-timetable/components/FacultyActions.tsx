import { MdSearch, MdFilterList } from 'react-icons/md'

interface FacultyActionsProps {
  search: string
  onSearchChange: (value: string) => void
  dayFilter: string
  onDayFilterChange: (value: string) => void
  dayOptions: { value: string; label: string }[]
}

export default function FacultyActions({
  search, onSearchChange, dayFilter, onDayFilterChange, dayOptions,
}: FacultyActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-3">
      <div className="relative flex-1">
        <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search subjects, courses, batches..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
      </div>
      <div className="relative min-w-[180px]">
        <MdFilterList className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <select
          value={dayFilter}
          onChange={(e) => onDayFilterChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 appearance-none transition-all"
        >
          {dayOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
