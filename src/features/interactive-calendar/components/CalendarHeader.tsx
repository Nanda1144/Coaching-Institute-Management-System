import { motion } from 'framer-motion'
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdViewModule, MdSearch, MdClose } from 'react-icons/md'
import type { CalendarView } from '../types/calendar.types'

interface CalendarHeaderProps {
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onNavigate: (direction: 'prev' | 'next' | 'today') => void
  headerLabel: string
  search: string
  onSearchChange: (value: string) => void
}

const views: { key: CalendarView; icon: typeof MdViewDay; label: string }[] = [
  { key: 'daily', icon: MdViewDay, label: 'Day' },
  { key: 'weekly', icon: MdViewWeek, label: 'Week' },
  { key: 'monthly', icon: MdViewModule, label: 'Month' },
]

export default function CalendarHeader({ view, onViewChange, onNavigate, headerLabel, search, onSearchChange }: CalendarHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('prev')}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <MdChevronLeft className="text-lg" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('today')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <MdToday className="text-base" />
            Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('next')}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <MdChevronRight className="text-lg" />
          </motion.button>
          <h2 className="text-lg font-bold text-gray-800 ml-2 min-w-[180px]">{headerLabel}</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-[200px]">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
            {search && (
              <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100">
                <MdClose className="text-gray-400 text-sm" />
              </button>
            )}
          </div>

          <div className="flex bg-gray-100 rounded-xl p-0.5">
            {views.map((v) => {
              const Icon = v.icon
              const isActive = view === v.key
              return (
                <motion.button
                  key={v.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewChange(v.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="hidden sm:inline">{v.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
