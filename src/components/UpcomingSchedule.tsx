import { motion } from 'framer-motion'
import { MdAccessTime, MdRoom, MdPerson, MdBook } from 'react-icons/md'
import { classSchedules } from '../data/dashboardData'

export default function UpcomingSchedule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Today's Schedule</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {classSchedules.length} classes
        </span>
      </div>

      <div className="space-y-2">
        {classSchedules.map((schedule, index) => (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.06 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center flex-shrink-0 border border-primary/10">
              <MdAccessTime className="text-primary text-xs" />
              <span className="text-[10px] font-semibold text-primary mt-0.5 leading-tight text-center px-1">
                {schedule.time}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MdPerson className="text-gray-400 text-xs flex-shrink-0" />
                <p className="text-sm font-medium text-gray-800 truncate">{schedule.facultyName}</p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <MdBook className="text-gray-400 text-xs flex-shrink-0" />
                <p className="text-xs text-gray-600 truncate">{schedule.subject}</p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <MdRoom className="text-gray-400 text-xs flex-shrink-0" />
                <p className="text-xs text-gray-500">{schedule.classroom}</p>
              </div>
            </div>

            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              {schedule.department}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
