import { motion } from 'framer-motion'
import type { ScheduleEntry } from '../types/studentTimetable.types'
import { getFacultyName } from '../../../utils/unwrap'

interface WeeklyScheduleProps {
  entries: ScheduleEntry[]
}

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:15 AM - 12:15 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM']

const statusColors: Record<string, string> = {
  Scheduled: 'border-blue-300 bg-blue-50/50',
  Ongoing: 'border-emerald-300 bg-emerald-50/50',
  Completed: 'border-gray-200 bg-gray-50/50',
  Cancelled: 'border-red-300 bg-red-50/50',
}

export default function WeeklySchedule({ entries }: WeeklyScheduleProps) {
  const getEntry = (day: string, time: string) =>
    entries.find((e) => e.day === day && e.time === time)

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-28">Time</th>
              {dayOrder.map((day) => (
                <th key={day} className="text-center px-3 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-[140px]">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {timeSlots.map((time, rowIndex) => (
              <motion.tr
                key={time}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                className="hover:bg-white/40 transition-colors"
              >
                <td className="px-3 py-3 text-gray-600 font-medium text-xs whitespace-nowrap">{time}</td>
                {dayOrder.map((day) => {
                  const entry = getEntry(day, time)
                  return (
                    <td key={day} className="px-2 py-2 text-center">
                      {entry ? (
                        <div className={`rounded-lg border p-2 ${statusColors[entry.status] || 'border-gray-100 bg-gray-50/30'}`}>
                          <p className="font-semibold text-gray-800 text-[11px] leading-tight">{entry.subject}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{typeof entry.faculty === 'string' ? entry.faculty.split(' ').pop() : getFacultyName(entry.faculty)}</p>
                          <p className="text-[10px] text-gray-400">{entry.classroom}</p>
                          <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            entry.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                            entry.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' :
                            entry.status === 'Completed' ? 'bg-gray-100 text-gray-500' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-200 text-xs">—</span>
                      )}
                    </td>
                  )
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
