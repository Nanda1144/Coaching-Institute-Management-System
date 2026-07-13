import { motion } from 'framer-motion'
import { MdMeetingRoom } from 'react-icons/md'
import type { DaySchedule } from '../types/profile.types'

interface WeeklyTimetableProps {
  timetable: DaySchedule[]
}

export default function WeeklyTimetable({ timetable }: WeeklyTimetableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Weekly Timetable</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase w-24">Day</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">09:00 - 10:00</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">10:00 - 11:00</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">11:00 - 12:00</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">12:00 - 13:00</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">14:00 - 15:00</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">15:00 - 16:00</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((day, i) => (
              <motion.tr
                key={day.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
              >
                <td className="py-2.5 px-3 font-medium text-gray-700">{day.day}</td>
                {day.slots.map((slot, si) => (
                  <td key={si} className={`py-2.5 px-3 ${slot.subject === 'Lunch Break' ? 'bg-amber-50/50' : ''} ${slot.subject === 'Free Period' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {slot.subject === 'Lunch Break' ? (
                      <span className="text-amber-700 font-medium text-xs">Lunch Break</span>
                    ) : slot.subject === 'Free Period' ? (
                      <span className="text-gray-400 italic">—</span>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-gray-700">{slot.subject}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                          <MdMeetingRoom className="text-[10px]" />
                          {slot.room}
                        </p>
                      </div>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
