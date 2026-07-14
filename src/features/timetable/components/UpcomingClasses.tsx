import { motion } from 'framer-motion'
import { MdAccessTime, MdBook, MdPerson, MdRoom, MdGroup, MdCalendarMonth, MdEventNote } from 'react-icons/md'
import type { UpcomingClass } from '../types/timetable.types'

interface UpcomingClassesProps {
  classes: UpcomingClass[]
  error?: string | null
}

export default function UpcomingClasses({ classes, error }: UpcomingClassesProps) {
  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-5 text-center">
        <MdEventNote className="text-3xl text-red-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Upcoming Classes</h3>
        <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
          Next 5 days
        </span>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-8">
          <MdCalendarMonth className="text-3xl text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No upcoming classes found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex flex-col items-center justify-center flex-shrink-0 border border-accent/10">
                <MdCalendarMonth className="text-accent text-xs" />
                <span className="text-[9px] font-semibold text-accent mt-0.5 leading-tight text-center px-1">
                  {item.day?.slice(0, 3)}
                </span>
                <span className="text-[8px] text-gray-500 -mt-0.5">{item.date.slice(-2)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <MdBook className="text-gray-400 text-xs flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-800 truncate">{item.subject}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MdPerson className="text-gray-400 text-xs flex-shrink-0" />
                  <p className="text-xs text-gray-600 truncate">{item.faculty}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <div className="flex items-center gap-1">
                    <MdAccessTime className="text-gray-400 text-[10px]" />
                    <span className="text-[10px] text-gray-500">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdRoom className="text-gray-400 text-[10px]" />
                    <span className="text-[10px] text-gray-500">{item.classroom}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdGroup className="text-gray-400 text-[10px]" />
                    <span className="text-[10px] text-gray-500">{item.batch}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md flex-shrink-0">
                {item.course}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
