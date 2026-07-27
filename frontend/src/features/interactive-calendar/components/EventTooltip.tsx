import { motion, AnimatePresence } from 'framer-motion'
import { MdAccessTime, MdPerson, MdRoom, MdSchool, MdGroup, MdDescription } from 'react-icons/md'
import { EVENT_TYPE_CONFIG } from '../types/calendar.types'
import type { CalendarEvent } from '../types/calendar.types'
import { getFacultyName, safeConfig } from '../../../utils/unwrap'

interface EventTooltipProps {
  event: CalendarEvent
  isVisible: boolean
}

export default function EventTooltip({ event, isVisible }: EventTooltipProps) {
  const config = safeConfig(EVENT_TYPE_CONFIG, event.type, { bg: '#f3f4f6', border: '#e5e7eb', label: event.type, color: '#6b7280' })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-xs font-semibold" style={{ color: config.color }}>
              {config.label}
            </span>
            <span className="text-xs font-bold text-gray-800 truncate">{event.subject}</span>
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <MdAccessTime className="text-gray-400 flex-shrink-0" />
              {event.startTime} - {event.endTime}
            </div>
            <div className="flex items-center gap-1.5">
              <MdPerson className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{getFacultyName(event.faculty) || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MdRoom className="text-gray-400 flex-shrink-0" />
              {event.classroom} ({event.building})
            </div>
            <div className="flex items-center gap-1.5">
              <MdSchool className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{event.course}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MdGroup className="text-gray-400 flex-shrink-0" />
              {event.batch}
            </div>
            {event.description && (
              <div className="flex items-start gap-1.5 pt-1 mt-1 border-t border-gray-50">
                <MdDescription className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">{event.description}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
