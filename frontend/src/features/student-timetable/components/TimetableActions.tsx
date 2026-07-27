import { MdDownload, MdPrint, MdCalendarMonth, MdSearch, MdFilterList } from 'react-icons/md'

interface TimetableActionsProps {
  search: string
  onSearchChange: (value: string) => void
  dayFilter: string
  onDayFilterChange: (value: string) => void
  dayOptions: { value: string; label: string }[]
  onCalendarView: () => void
  onDownloadPdf: () => void
  onPrint: () => void
}

export default function TimetableActions({
  search,
  onSearchChange,
  dayFilter,
  onDayFilterChange,
  dayOptions,
  onCalendarView,
  onDownloadPdf,
  onPrint,
}: TimetableActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-3">
      <div className="flex flex-1 flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search subjects, faculty, classroom..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="relative min-w-[160px]">
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
      <div className="flex gap-2">
        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdDownload className="text-lg" />
          <span className="hidden sm:inline">PDF</span>
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdPrint className="text-lg" />
          <span className="hidden sm:inline">Print</span>
        </button>
        <button
          onClick={onCalendarView}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
        >
          <MdCalendarMonth className="text-lg" />
          <span className="hidden sm:inline">Calendar</span>
        </button>
      </div>
    </div>
  )
}
