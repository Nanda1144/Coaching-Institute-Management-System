import { motion } from 'framer-motion'
import type { ScheduleEntry } from '../types/studentTimetable.types'

interface MonthlyScheduleProps {
  entries: ScheduleEntry[]
}

const statusColors: Record<string, string> = {
  Scheduled: 'border-l-blue-400',
  Ongoing: 'border-l-emerald-400',
  Completed: 'border-l-gray-300',
  Cancelled: 'border-l-red-400',
}

export default function MonthlySchedule({ entries }: MonthlyScheduleProps) {
  const grouped = entries.reduce<Record<string, ScheduleEntry[]>>((acc, entry) => {
    const key = `${entry.day} - ${entry.date}`
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const dateA = a.split(' - ')[1]
    const dateB = b.split(' - ')[1]
    return dateA.localeCompare(dateB)
  })

  return (
    <div className="space-y-4">
      {sortedKeys.map((key, groupIndex) => {
        const [day, date] = key.split(' - ')
        const entries = grouped[key]
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 text-sm">{day}</span>
                <span className="text-xs text-gray-400">{date}</span>
              </div>
              <span className="text-xs text-gray-400">{entries.length} class{entries.length > 1 ? 'es' : ''}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 px-4 py-3 border-l-4 ${statusColors[entry.status] || 'border-l-transparent'} hover:bg-white/40 transition-colors`}
                >
                  <div className="min-w-[120px]">
                    <p className="text-xs font-medium text-gray-600">{entry.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{entry.subject}</p>
                    <p className="text-xs text-gray-500 truncate">{entry.faculty} &middot; {entry.classroom}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                      entry.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      entry.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' :
                      entry.status === 'Completed' ? 'bg-gray-100 text-gray-500' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.status}
                    </span>
                    <span className={`text-xs font-medium ${
                      entry.attendance === 'Present' ? 'text-emerald-600' :
                      entry.attendance === 'Absent' ? 'text-red-600' :
                      'text-gray-400'
                    }`}>
                      {entry.attendance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
