import { motion } from 'framer-motion'
import { MdSchedule, MdCheckCircle, MdCancel, MdRemoveRedEye } from 'react-icons/md'
import type { ScheduleEntry } from '../types/studentTimetable.types'

interface DailyScheduleProps {
  entries: ScheduleEntry[]
}

const statusStyles: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  Ongoing: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Completed: 'bg-gray-100 text-gray-500 border-gray-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function DailySchedule({ entries }: DailyScheduleProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-10 text-center">
        <p className="text-gray-400 text-sm">No classes scheduled for today.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const [start] = entry.time.split(' - ')

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="flex items-stretch gap-3 group"
          >
            <div className="flex flex-col items-center w-14 pt-1 flex-shrink-0">
              <MdSchedule className="text-lg text-primary/60" />
              <span className="text-[10px] text-gray-400 font-medium mt-0.5">{start}</span>
            </div>
            <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-xl border border-white/30 shadow-sm p-3.5 hover:shadow-md transition-all group-hover:border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{entry.subject}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {entry.faculty} &middot; {entry.classroom}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${statusStyles[entry.status] || ''}`}>
                    {entry.status}
                  </span>
                  <span className={`text-xs font-medium ${entry.attendance === 'Present' ? 'text-emerald-600' : entry.attendance === 'Absent' ? 'text-red-600' : 'text-gray-400'}`}>
                    {entry.attendance === 'Present' ? <MdCheckCircle className="inline mr-0.5" /> : entry.attendance === 'Absent' ? <MdCancel className="inline mr-0.5" /> : <MdRemoveRedEye className="inline mr-0.5" />} {entry.attendance}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{entry.time}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
