import { motion } from 'framer-motion'
import type { FacultyScheduleEntry } from '../types/facultyTimetable.types'

interface FacultyScheduleTableProps {
  entries: FacultyScheduleEntry[]
  view: 'daily' | 'weekly' | 'monthly'
}

const statusStyles: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Ongoing: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-gray-100 text-gray-500',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function FacultyScheduleTable({ entries, view }: FacultyScheduleTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-10 text-center">
        <p className="text-gray-400 text-sm">No entries found for this period.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {(view === 'weekly' || view === 'monthly') && (
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  {view === 'weekly' ? 'Day' : 'Date'}
                </th>
              )}
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Course</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subject</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Batch</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Classroom</th>
              <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="hover:bg-white/50 transition-colors"
              >
                {(view === 'weekly' || view === 'monthly') && (
                  <td className="px-4 py-3.5 text-gray-700 font-medium whitespace-nowrap">
                    {view === 'weekly' ? entry.day : entry.date}
                  </td>
                )}
                <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{entry.time}</td>
                <td className="px-4 py-3.5 text-gray-600">{entry.course}</td>
                <td className="px-4 py-3.5 text-gray-800 font-medium">{entry.subject}</td>
                <td className="px-4 py-3.5 text-gray-600">{entry.batch}</td>
                <td className="px-4 py-3.5 text-gray-600">{entry.classroom}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyles[entry.status] || 'bg-gray-100 text-gray-600'}`}>
                    {entry.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
