import { motion } from 'framer-motion'
import { MdEventBusy } from 'react-icons/md'
import EventCard from './EventCard'
import { timeSlots } from '../data/calendarData'
import type { CalendarEvent } from '../types/calendar.types'

interface WeeklyViewProps {
  weekDays: Date[]
  getEventsForDate: (date: Date) => CalendarEvent[]
  onDragStart: (id: string) => void
}

export default function WeeklyView({ weekDays, getEventsForDate, onDragStart }: WeeklyViewProps) {
  const todayStr = new Date().toDateString()
  const hasEvents = weekDays.some((d) => getEventsForDate(d).length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-gray-100">
            <div className="p-2" />
            {weekDays.map((d, i) => {
              const isToday = d.toDateString() === todayStr
              return (
                <div key={'sk' + i} className={`p-2 text-center border-l border-gray-50 ${isToday ? 'bg-primary/5' : ''}`}>
                  <p className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-gray-800'}`}>
                    {d.getDate()}
                  </p>
                </div>
              )
            })}
          </div>

          {!hasEvents ? (
            <div className="text-center py-12">
              <MdEventBusy className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No events this week</p>
            </div>
          ) : (
            timeSlots.map((slot) => {
              const hour = Number.parseInt(slot)
              const ampm = hour < 12 ? 'AM' : 'PM'
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
              return (
                <div key={slot} className="grid grid-cols-[70px_repeat(7,1fr)] border-t border-gray-50 group min-h-[60px]">
                  <div className="flex items-start justify-center pt-2 px-1 border-r border-gray-50">
                    <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap">
                      {displayHour}:00 {ampm}
                    </span>
                  </div>
                  {weekDays.map((d, i) => {
                    const dayEvents = getEventsForDate(d).filter(
                      (e) => e.startTime.startsWith(slot.slice(0, 2))
                    )
                    const isToday = d.toDateString() === todayStr
                    return (
                      <div
                        key={'sk' + i}
                        className={`p-1 border-l border-gray-50 min-h-[60px] ${
                          isToday ? 'bg-primary/[0.02]' : ''
                        }`}
                      >
                        {dayEvents.length > 0 ? (
                          <div className="space-y-0.5">
                            {dayEvents.map((event) => (
                              <EventCard key={event.id} event={event} compact onDragStart={onDragStart} />
                            ))}
                          </div>
                        ) : (
                          <div className="h-full min-h-[50px] rounded border-2 border-dashed border-gray-100/30 group-hover:border-primary/10 transition-colors" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      </div>
    </motion.div>
  )
}
