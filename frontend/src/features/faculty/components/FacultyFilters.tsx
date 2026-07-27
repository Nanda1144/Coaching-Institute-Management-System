import { MdSearch, MdFilterList, MdClose } from 'react-icons/md'
import type { FilterConfig } from '../types/faculty.types'

interface FacultyFiltersProps {
  filters: FilterConfig
  setFilter: (key: keyof FilterConfig, value: string) => void
  resetFilters: () => void
  departmentOptions: string[]
  branchOptions: string[]
  statusOptions: readonly string[]
  experienceRanges: { label: string; value: string }[]
}

export default function FacultyFilters({
  filters,
  setFilter,
  resetFilters,
  departmentOptions,
  branchOptions,
  statusOptions,
  experienceRanges,
}: FacultyFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, email, ID or department..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <MdClose />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MdFilterList className="text-lg" />
          <span className="font-medium">Filters:</span>
        </div>

        <select
          value={filters.department}
          onChange={e => setFilter('department', e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          <option value="">All Departments</option>
          {departmentOptions.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filters.branch}
          onChange={e => setFilter('branch', e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          <option value="">All Branches</option>
          {branchOptions.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={e => setFilter('status', e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          <option value="">All Status</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.experience}
          onChange={e => setFilter('experience', e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          {experienceRanges.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
