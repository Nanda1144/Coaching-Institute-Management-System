import { motion } from 'framer-motion'
import { MdCalendarViewWeek, MdAccessTime, MdMeetingRoom } from 'react-icons/md'
import type { TeachingSlot } from '../types/assignment.types'

interface TeachingScheduleProps {
  slots: TeachingSlot[]
  onSlotsChange: (slots: TeachingSlot[]) => void
  dayOptions: string[]
  timeOptions: string[]
  roomOptions: string[]
}

export default function TeachingSchedule({
  slots, onSlotsChange, dayOptions, timeOptions, roomOptions,
}: TeachingScheduleProps) {
  const addSlot = () => {
    onSlotsChange([...slots, { day: '', time: '', room: '' }])
  }

  const removeSlot = (index: number) => {
    onSlotsChange(slots.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof TeachingSlot, value: string) => {
    const updated = slots.map((s, i) => i === index ? { ...s, [field]: value } : s)
    onSlotsChange(updated)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MdCalendarViewWeek className="text-primary text-lg" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Teaching Schedule</h3>
        </div>
        <button
          onClick={addSlot}
          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          + Add Slot
        </button>
      </div>

      <div className="space-y-2.5">
        {slots.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No schedule slots added yet. Click "Add Slot" to begin.</p>
        )}
        {slots.map((slot, i) => (
          <motion.div
            key={'sk' + i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 p-3 rounded-xl bg-gray-50/50 border border-gray-100"
          >
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdCalendarViewWeek /> Day</label>
              <select value={slot.day} onChange={e => updateSlot(i, 'day', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select day</option>
                {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdAccessTime /> Time</label>
              <select value={slot.time} onChange={e => updateSlot(i, 'time', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select time</option>
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdMeetingRoom /> Room</label>
              <select value={slot.room} onChange={e => updateSlot(i, 'room', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select room</option>
                {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button
              onClick={() => removeSlot(i)}
              className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors self-end"
            >
              Remove
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
