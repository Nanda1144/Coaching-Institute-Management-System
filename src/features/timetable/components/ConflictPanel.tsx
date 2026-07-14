import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdWarning, MdError, MdInfo, MdClose, MdPerson, MdMeetingRoom, MdGroup, MdAccessTime, MdExpandMore, MdExpandLess } from 'react-icons/md'
import type { Conflict } from '../types/timetable.types'
import type { TimetableEntry } from '../types/timetable.types'

interface ConflictPanelProps {
  entries: TimetableEntry[]
  onClose: () => void
}

const severityConfig = {
  high: { icon: MdError, color: '#ef4444', bg: '#fee2e2', label: 'High' },
  medium: { icon: MdWarning, color: '#f59e0b', bg: '#fef3c7', label: 'Medium' },
  low: { icon: MdInfo, color: '#3b82f6', bg: '#dbeafe', label: 'Low' },
}

const typeConfig = {
  faculty: { icon: MdPerson, label: 'Faculty Conflict' },
  classroom: { icon: MdMeetingRoom, label: 'Room Conflict' },
  batch: { icon: MdGroup, label: 'Batch Conflict' },
  time: { icon: MdAccessTime, label: 'Time Conflict' },
}

function detectConflicts(entries: TimetableEntry[]): Conflict[] {
  const conflicts: Conflict[] = []
  let conflictId = 0

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]

      if (a.time !== b.time) continue

      if (a.faculty === b.faculty) {
        conflicts.push({
          id: `conflict-${conflictId++}`,
          type: 'faculty',
          severity: 'high',
          description: `Faculty "${a.faculty}" double-booked`,
          detail: `Same faculty assigned to "${a.subject}" (${a.batch}) and "${b.subject}" (${b.batch}) at ${a.time}`,
          entry1: a.id,
          entry2: b.id,
          time: a.time,
        })
      }

      if (a.classroom === b.classroom) {
        conflicts.push({
          id: `conflict-${conflictId++}`,
          type: 'classroom',
          severity: 'high',
          description: `Room "${a.classroom}" double-booked`,
          detail: `Room assigned to both "${a.subject}" (${a.batch}) and "${b.subject}" (${b.batch}) at ${a.time}`,
          entry1: a.id,
          entry2: b.id,
          time: a.time,
        })
      }

      if (a.batch === b.batch) {
        conflicts.push({
          id: `conflict-${conflictId++}`,
          type: 'batch',
          severity: 'medium',
          description: `Batch "${a.batch}" double-scheduled`,
          detail: `Batch assigned to both "${a.subject}" and "${b.subject}" at ${a.time}`,
          entry1: a.id,
          entry2: b.id,
          time: a.time,
        })
      }
    }
  }

  const timeOverlaps = findTimeOverlaps(entries)
  conflicts.push(...timeOverlaps)

  return conflicts
}

function findTimeOverlaps(entries: TimetableEntry[]): Conflict[] {
  const conflicts: Conflict[] = []
  let conflictId = 100

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]

      const [aStart, aEnd] = a.time.split(' - ').map(t => {
        const [h, m] = t.split(':').map(Number)
        return h * 60 + m
      })
      const [bStart, bEnd] = b.time.split(' - ').map(t => {
        const [h, m] = t.split(':').map(Number)
        return h * 60 + m
      })

      if (aStart < bEnd && bStart < aEnd) {
        if (a.faculty === b.faculty) {
          conflicts.push({
            id: `conflict-${conflictId++}`,
            type: 'time',
            severity: 'high',
            description: `Faculty "${a.faculty}" overlapping classes`,
            detail: `"${a.subject}" (${a.time}) overlaps with "${b.subject}" (${b.time})`,
            entry1: a.id,
            entry2: b.id,
            time: `${a.time} / ${b.time}`,
          })
        }
        if (a.classroom === b.classroom) {
          conflicts.push({
            id: `conflict-${conflictId++}`,
            type: 'time',
            severity: 'high',
            description: `Room "${a.classroom}" overlapping bookings`,
            detail: `"${a.subject}" (${a.time}) overlaps with "${b.subject}" (${b.time})`,
            entry1: a.id,
            entry2: b.id,
            time: `${a.time} / ${b.time}`,
          })
        }
      }
    }
  }

  return conflicts
}

export default function ConflictPanel({ entries, onClose }: ConflictPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')

  const conflicts = useMemo(() => detectConflicts(entries), [entries])

  const filteredConflicts = useMemo(() => {
    if (filterSeverity === 'all') return conflicts
    return conflicts.filter(c => c.severity === filterSeverity)
  }, [conflicts, filterSeverity])

  const severityCounts = useMemo(() => ({
    all: conflicts.length,
    high: conflicts.filter(c => c.severity === 'high').length,
    medium: conflicts.filter(c => c.severity === 'medium').length,
    low: conflicts.filter(c => c.severity === 'low').length,
  }), [conflicts])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MdWarning className="text-xl text-amber-500" />
          <h3 className="font-semibold text-gray-800">Schedule Conflicts</h3>
          {conflicts.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                conflicts.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {conflicts.length}
            </motion.span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <MdClose className="text-xl" />
        </motion.button>
      </div>

      {conflicts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <MdInfo className="text-3xl text-green-500" />
          </div>
          <p className="text-gray-800 font-medium">No Conflicts Found</p>
          <p className="text-sm text-gray-500 mt-1">All schedule entries are properly arranged.</p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(['all', 'high', 'medium', 'low'] as const).map(sev => (
              <motion.button
                key={sev}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filterSeverity === sev
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
                <span className="ml-1 opacity-70">({severityCounts[sev]})</span>
              </motion.button>
            ))}
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredConflicts.map((conflict, index) => {
                const sev = severityConfig[conflict.severity]
                const typ = typeConfig[conflict.type]
                const SevIcon = sev.icon
                const TypIcon = typ.icon
                const isExpanded = expanded === conflict.id

                return (
                  <motion.div
                    key={conflict.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
                      conflict.severity === 'high'
                        ? 'border-red-200 bg-red-50/40'
                        : conflict.severity === 'medium'
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-blue-200 bg-blue-50/40'
                    }`}
                    onClick={() => setExpanded(isExpanded ? null : conflict.id)}
                  >
                    <div className="flex items-start gap-3 p-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: sev.bg, color: sev.color }}
                      >
                        <SevIcon className="text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800 truncate">{conflict.description}</p>
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sev.bg, color: sev.color }}
                          >
                            {sev.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{conflict.detail}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <TypIcon className="text-xs" />
                            {typ.label}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <MdAccessTime className="text-xs" />
                            {conflict.time}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isExpanded ? <MdExpandLess className="text-gray-400" /> : <MdExpandMore className="text-gray-400" />}
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                            <div className="mt-2 space-y-1.5">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Entry 1:</span> {conflict.entry1}
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Entry 2:</span> {conflict.entry2}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Recommended action: Adjust the schedule to resolve the {typ.label.toLowerCase()}.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  )
}