import { motion } from 'framer-motion'
import { MdEventBusy } from 'react-icons/md'
import EventCard from './EventCard'
import type { CalendarEvent } from '../types/calendar.types'

interface MonthlyViewProps {
  monthDays: Array<{ date: Date; isCurrentMonth: boolean }>
  getEventsForDate: (date: Date) => CalendarEvent[]
  onDragStart: (id: string) => void
}

const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function MonthlyView({ monthDays, getEventsForDate, onDragStart }: MonthlyViewProps) {
  const todayStr = new Date().toDateString()
  const hasEvents = monthDays.some((d) => getEventsForDate(d.date).length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayHeaders.map((day) => (
          <div key={day} className="p-2 text-center">
            <span className="text-xs font-semibold text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {!hasEvents ? (
        <div className="text-center py-12">
          <MdEventBusy className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No events this month</p>
        </div>
      ) : (
        <div className="grid grid-cols-7">
          {monthDays.map(({ date, isCurrentMonth }, i) => {
            const events = getEventsForDate(date)
            const isToday = date.toDateString() === todayStr
            const dayNum = date.getDate()
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.003 }}
                className={`min-h-[90px] border-t border-l border-gray-50 p-1 ${
                  !isCurrentMonth ? 'bg-gray-50/30' : 'hover:bg-gray-50/30 transition-colors'
                } ${isToday ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-primary text-white'
                        : isCurrentMonth
                          ? 'text-gray-700'
                          : 'text-gray-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {events.length > 0 && (
                    <span className="text-[9px] text-gray-400 font-medium">{events.length}</span>
                  )}
                </div>
                <div className="space-y-0.5 max-h-[60px] overflow-y-auto">
                  {events.slice(0, 3).map((event) => (
                    <EventCard key={event.id} event={event} compact onDragStart={onDragStart} />
                  ))}
                  {events.length > 3 && (
                    <div className="text-[9px] text-gray-400 font-medium text-center">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
