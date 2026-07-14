import { motion } from 'framer-motion'
import { MdFilterList } from 'react-icons/md'
import { EVENT_TYPE_CONFIG } from '../types/calendar.types'
import type { CalendarFilters, EventType } from '../types/calendar.types'

interface CalendarSidebarProps {
  filters: CalendarFilters
  onToggleFilter: (key: keyof CalendarFilters, value: string) => void
  isOpen: boolean
  onToggle: () => void
  departmentOptions: string[]
  facultyOptions: string[]
  courseOptions: string[]
  batchOptions: string[]
  classroomOptions: string[]
}

function FilterGroup({ label, options, selected, onToggle }: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{label}:</span>
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs cursor-pointer transition-colors ${
            selected.includes(opt) ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="hidden"
          />
          <span className={`w-2 h-2 rounded-full ${selected.includes(opt) ? 'bg-primary' : 'bg-gray-300'}`} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}

export default function CalendarSidebar({
  filters, onToggleFilter, isOpen, onToggle,
  departmentOptions, facultyOptions, courseOptions, batchOptions, classroomOptions,
}: CalendarSidebarProps) {
  const eventTypes = Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]

  return (
    <div className="w-full">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 transition-all shadow-sm"
      >
        <MdFilterList className="text-lg" />
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4 mt-3"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Types:</span>
              {eventTypes.map(([type, config]) => (
                <span key={type} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-600 bg-white/50 border border-gray-100">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                  {config.label}
                </span>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-200 hidden lg:block" />

            <FilterGroup label="Department" options={departmentOptions} selected={filters.departments} onToggle={(v) => onToggleFilter('departments', v)} />

            <div className="w-px h-6 bg-gray-200 hidden lg:block" />

            <FilterGroup label="Faculty" options={facultyOptions} selected={filters.faculties} onToggle={(v) => onToggleFilter('faculties', v)} />

            <div className="w-px h-6 bg-gray-200 hidden lg:block" />

            <FilterGroup label="Course" options={courseOptions} selected={filters.courses} onToggle={(v) => onToggleFilter('courses', v)} />

            <div className="w-px h-6 bg-gray-200 hidden lg:block" />

            <FilterGroup label="Batch" options={batchOptions} selected={filters.batches} onToggle={(v) => onToggleFilter('batches', v)} />

            <div className="w-px h-6 bg-gray-200 hidden lg:block" />

            <FilterGroup label="Classroom" options={classroomOptions} selected={filters.classrooms} onToggle={(v) => onToggleFilter('classrooms', v)} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
