import { motion } from 'framer-motion'
import { MdEvent, MdCalendarMonth } from 'react-icons/md'
import type { SpecialEvent as SpecialEventType } from '../types/holiday.types'
import { SPECIAL_EVENT_CONFIG } from '../types/holiday.types'

interface SpecialEventsProps {
  events: SpecialEventType[]
}

export default function SpecialEvents({ events }: SpecialEventsProps) {
  const grouped = Object.entries(SPECIAL_EVENT_CONFIG).map(([cat, cfg]) => ({
    category: cat,
    config: cfg,
    items: events.filter((e) => e.category === cat),
  }))

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-8 text-center"
      >
        <MdEvent className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No special events scheduled</p>
      </motion.div>
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
        <h3 className="font-semibold text-gray-800">Special Events</h3>
        <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
          {events.length} events
        </span>
      </div>

      <div className="space-y-4">
        {grouped.map(({ category, config, items }) => {
          if (items.length === 0) return null
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{config.icon}</span>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{config.label}</h4>
                <span className="text-[10px] text-gray-400">({items.length})</span>
              </div>
              <div className="space-y-1.5">
                {items.map((event, index) => {
                  const date = new Date(event.date)
                  const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => alert(`${event.name}\n${event.description}\nDate: ${formatted}`)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                        style={{ backgroundColor: config.bg }}
                      >
                        <span>{config.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800">{event.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{event.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
                        <MdCalendarMonth className="text-[10px]" />
                        {formatted}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
