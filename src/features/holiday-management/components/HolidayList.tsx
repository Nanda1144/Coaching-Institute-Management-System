import { motion } from 'framer-motion'
import { MdCalendarMonth, MdVisibility, MdSchool } from 'react-icons/md'
import type { Holiday, HolidayType } from '../types/holiday.types'
import { HOLIDAY_TYPE_CONFIG } from '../types/holiday.types'

interface HolidayListProps {
  holidays: Holiday[]
}

export default function HolidayList({ holidays }: HolidayListProps) {
  if (holidays.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-8 text-center"
      >
        <MdCalendarMonth className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No holidays match your filters</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Holiday List</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {holidays.length} holidays
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">Holiday Name</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">Date</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">Day</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">Type</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">Department</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs">Status</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h, index) => {
              const cfg = HOLIDAY_TYPE_CONFIG[h.type as HolidayType] || HOLIDAY_TYPE_CONFIG.national
              const date = new Date(h.date)
              const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <motion.tr
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <span className="text-gray-800 text-xs font-medium">{h.name}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{h.description}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700 text-xs">{formatted}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700 text-xs">{h.day}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <MdSchool className="text-gray-400 text-[10px]" />
                      <span className="text-gray-600 text-xs">{h.department}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        h.status === 'upcoming'
                          ? 'bg-blue-50 text-blue-600'
                          : h.status === 'ongoing'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {h.status === 'upcoming' ? 'Upcoming' : h.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Holiday details: ${h.name}\nDate: ${formatted}\nType: ${cfg.label}\nDepartment: ${h.department}\nStatus: ${h.status}\n\n${h.description}`)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors ml-auto"
                    >
                      <MdVisibility className="text-xs" />
                      Details
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
