import { motion } from 'framer-motion'
import { MdPeople, MdCheckCircle, MdCancel, MdSchedule, MdEventBusy, MdTrendingUp } from 'react-icons/md'
import type { SummaryStats } from '../types/attendanceReports.types'

interface ReportSummaryTableProps {
  summary: SummaryStats
}

const summaryItems: {
  key: keyof SummaryStats
  label: string
  icon: typeof MdPeople
  color: string
  bg: string
  suffix?: string
}[] = [
  { key: 'present', label: 'Present', icon: MdCheckCircle, color: '#10b981', bg: '#d1fae5' },
  { key: 'absent', label: 'Absent', icon: MdCancel, color: '#ef4444', bg: '#fee2e2' },
  { key: 'late', label: 'Late', icon: MdSchedule, color: '#f59e0b', bg: '#fef3c7' },
  { key: 'leave', label: 'Leave', icon: MdEventBusy, color: '#3b82f6', bg: '#dbeafe' },
]

export default function ReportSummaryTable({ summary }: ReportSummaryTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Attendance Summary</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
          <MdPeople className="text-gray-400" />
          Total: {summary.total}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {summaryItems.map((item, index) => {
          const value = summary[item.key] as number
          const percentage = summary.total > 0 ? (value / summary.total) * 100 : 0
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 }}
              className="text-center p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <item.icon className="text-lg" />
              </div>
              <p className="text-xl font-bold text-gray-800 tabular-nums">{value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.label}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 tabular-nums">{percentage.toFixed(1)}%</p>
            </motion.div>
          )
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.24 }}
          className="text-center p-4 rounded-xl border-2 border-primary/10 bg-primary/5 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-2 shadow-sm">
            <MdTrendingUp className="text-white text-lg" />
          </div>
          <p className="text-xl font-bold text-primary tabular-nums">{summary.percentage}%</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Attendance %</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${summary.percentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <p className="text-[10px] text-primary/60 mt-1 font-medium">Overall</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
