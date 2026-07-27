import { motion } from 'framer-motion'
import { MdAccessTime, MdPerson, MdRoom } from 'react-icons/md'
import { EVENT_TYPE_CONFIG } from '../types/calendar.types'
import type { CalendarEvent } from '../types/calendar.types'
import { useState } from 'react'
import { getFacultyName, safeConfig } from '../../../utils/unwrap'
import EventTooltip from './EventTooltip'

interface EventCardProps {
  event: CalendarEvent
  compact?: boolean
  onDragStart?: (id: string) => void
}

export default function EventCard({ event, compact = false, onDragStart }: EventCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const config = safeConfig(EVENT_TYPE_CONFIG, event.type, { bg: '#f3f4f6', border: '#e5e7eb', label: event.type, color: '#6b7280' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={() => onDragStart?.(event.id)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative rounded-xl border cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        compact ? 'p-1.5 text-[10px]' : 'p-2.5 text-xs'
      }`}
      style={{ backgroundColor: config.bg, borderColor: config.border }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: config.color }}
        />
        {!compact && (
          <span className="font-medium text-gray-800 truncate" style={{ color: config.color }}>
            {config.label}
          </span>
        )}
        <span className="font-semibold text-gray-800 truncate flex-1">
          {compact ? event.title.slice(0, 20) + (event.title.length > 20 ? '…' : '') : event.subject}
        </span>
      </div>
      {!compact && (
        <div className="space-y-0.5 mt-1 text-[10px] text-gray-600">
          <div className="flex items-center gap-1">
            <MdAccessTime className="text-gray-400" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center gap-1">
            <MdPerson className="text-gray-400" />
            <span className="truncate">{getFacultyName(event.faculty) || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MdRoom className="text-gray-400" />
            {event.classroom}
          </div>
        </div>
      )}

      <EventTooltip event={event} isVisible={showTooltip} />
    </motion.div>
  )
}
