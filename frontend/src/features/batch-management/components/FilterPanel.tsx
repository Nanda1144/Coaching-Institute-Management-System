import { MdClose } from 'react-icons/md'

interface FilterPanelProps {
  courseFilter: string
  setCourseFilter: (v: string) => void
  facultyFilter: string
  setFacultyFilter: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  scheduleFilter: string
  setScheduleFilter: (v: string) => void
  clearFilters: () => void
  courseOptions: string[]
  facultyOptions: string[]
  statusOptions: string[]
  scheduleOptions: string[]
}

export default function FilterPanel({
  courseFilter, setCourseFilter,
  facultyFilter, setFacultyFilter,
  statusFilter, setStatusFilter,
  scheduleFilter, setScheduleFilter,
  clearFilters,
  courseOptions, facultyOptions, statusOptions, scheduleOptions,
}: FilterPanelProps) {
  return (
    <div className="flex items-end gap-3 flex-wrap py-3">
      <FilterSelect label="Course" value={courseFilter} onChange={setCourseFilter} options={courseOptions} allLabel="All Courses" />
      <FilterSelect label="Faculty" value={facultyFilter} onChange={setFacultyFilter} options={facultyOptions} allLabel="All Faculty" />
      <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} allLabel="All Status" />
      <FilterSelect label="Schedule" value={scheduleFilter} onChange={setScheduleFilter} options={scheduleOptions} allLabel="All Schedules" />
      <button className="btn btn-ghost btn-sm flex items-center gap-1.5 text-xs" onClick={clearFilters}>
        <MdClose size={14} /> Clear Filters
      </button>
    </div>
  )
}

function FilterSelect({
  label, value, onChange, options, allLabel,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  allLabel: string
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[150px]">
      <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{label}</label>
      <select className="select-field py-2 text-xs" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}
