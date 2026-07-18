import { motion } from 'framer-motion'
import { MdAccessTime, MdBook, MdPerson, MdRoom, MdGroup, MdCheckCircle, MdSchedule, MdCancel, MdPlayCircle } from 'react-icons/md'
import type { TimetableEntry } from '../types/timetable.types'
import { getFacultyName } from '../../../utils/unwrap'

interface TodayTimetableProps {
  entries: TimetableEntry[]
  error?: string | null
}

const statusConfig: Record<string, { label: string; icon: typeof MdCheckCircle; color: string; bg: string }> = {
  ongoing: { label: 'Ongoing', icon: MdPlayCircle, color: '#10b981', bg: '#d1fae5' },
  scheduled: { label: 'Scheduled', icon: MdSchedule, color: '#3b82f6', bg: '#dbeafe' },
  completed: { label: 'Completed', icon: MdCheckCircle, color: '#6b7280', bg: '#f3f4f6' },
  cancelled: { label: 'Cancelled', icon: MdCancel, color: '#ef4444', bg: '#fee2e2' },
}

export default function TodayTimetable({ entries, error }: TodayTimetableProps) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-8 text-center"
      >
        <MdCancel className="text-4xl text-red-400 mx-auto mb-3" />
        <p className="text-gray-800 font-medium mb-1">Failed to load timetable</p>
        <p className="text-sm text-gray-500">{error}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Today's Timetable</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {entries.length} classes
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10">
          <MdSchedule className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No classes scheduled for today</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Time</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Course</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Subject</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Faculty</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Classroom</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Batch</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => {
                const status = statusConfig[entry.status] || { label: 'Unknown', icon: MdSchedule, color: '#6b7280', bg: '#f3f4f6' }
                const StatusIcon = status.icon
                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-gray-50 hover:bg-white/50 transition-colors group"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdAccessTime className="text-gray-400 text-xs" />
                        <span className="text-gray-700 text-xs font-medium">{entry.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-gray-700 text-xs">{entry.course}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdBook className="text-gray-400 text-xs" />
                        <span className="text-gray-700 text-xs">{entry.subject}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdPerson className="text-gray-400 text-xs" />
                        <span className="text-gray-700 text-xs">{getFacultyName(entry.faculty) || (typeof entry.faculty === 'string' ? entry.faculty : 'Unknown')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdRoom className="text-gray-400 text-xs" />
                        <span className="text-gray-700 text-xs">{entry.classroom}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <MdGroup className="text-gray-400 text-xs" />
                        <span className="text-gray-700 text-xs">{entry.batch}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        <StatusIcon className="text-xs" />
                        {status.label}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
