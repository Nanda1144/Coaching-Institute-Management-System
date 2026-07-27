import { motion, AnimatePresence } from 'framer-motion'
import { MdEventBusy } from 'react-icons/md'
import EventCard from './EventCard'
import { timeSlots } from '../data/calendarData'
import type { CalendarEvent } from '../types/calendar.types'

interface DailyViewProps {
  date: Date
  events: CalendarEvent[]
  onDragStart: (id: string) => void
}

export default function DailyView({ date, events, onDragStart }: DailyViewProps) {
  const dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const isToday = new Date().toDateString() === date.toDateString()

  const getEventsForSlot = (slot: string): CalendarEvent[] =>
    events.filter((e) => e.startTime.startsWith(slot.slice(0, 2)))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className={`px-5 py-3 border-b border-gray-100 ${isToday ? 'bg-primary/5' : ''}`}>
        <h3 className={`font-semibold ${isToday ? 'text-primary' : 'text-gray-800'}`}>{dateLabel}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''}</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <MdEventBusy className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No events scheduled for this day</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          <AnimatePresence>
            {timeSlots.map((slot) => {
              const slotEvents = getEventsForSlot(slot)
              const hour = Number.parseInt(slot)
              const ampm = hour < 12 ? 'AM' : 'PM'
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
              return (
                <motion.div
                  key={slot}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex min-h-[60px] group"
                >
                  <div className="w-20 flex-shrink-0 flex flex-col items-center justify-start pt-3 px-2 border-r border-gray-50">
                    <span className="text-[10px] font-medium text-gray-400">
                      {displayHour}:00 {ampm}
                    </span>
                  </div>
                  <div className="flex-1 p-1.5 space-y-1">
                    {slotEvents.length === 0 ? (
                      <div className="h-full min-h-[40px] rounded-lg border-2 border-dashed border-gray-100/50 group-hover:border-primary/20 transition-colors" />
                    ) : (
                      slotEvents.map((event) => (
                        <EventCard key={event.id} event={event} onDragStart={onDragStart} />
                      ))
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
