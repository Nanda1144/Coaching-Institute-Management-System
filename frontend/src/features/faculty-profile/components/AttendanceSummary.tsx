import { motion } from 'framer-motion'
import { MdCheckCircle, MdCancel, MdEventBusy, MdPeople } from 'react-icons/md'
import type { AttendanceSummary as AttendanceSummaryType } from '../types/profile.types'

interface AttendanceSummaryProps {
  attendance: AttendanceSummaryType
}

const items = [
  { key: 'present', label: 'Present', icon: MdCheckCircle, color: '#10b981', bg: '#d1fae5' },
  { key: 'absent', label: 'Absent', icon: MdCancel, color: '#ef4444', bg: '#fee2e2' },
  { key: 'leave', label: 'Leave', icon: MdEventBusy, color: '#f59e0b', bg: '#fef3c7' },
] as const

export default function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Attendance Summary</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {items.map(item => (
          <div key={item.key} className="text-center p-3 rounded-xl" style={{ backgroundColor: item.bg }}>
            <item.icon className="text-2xl mx-auto mb-1" style={{ color: item.color }} />
            <p className="text-2xl font-bold text-gray-800">
              {attendance[item.key as keyof AttendanceSummaryType]}
            </p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MdPeople className="text-gray-400" />
          Total Working Days
        </div>
        <span className="text-lg font-bold text-gray-800">{attendance.total}</span>
      </div>
    </motion.div>
  )
}
