import { motion } from 'framer-motion'
import { MdPerson, MdBook } from 'react-icons/md'
import type { FacultyData, CourseData } from '../types/attendanceAnalytics.types'

interface AnalyticsBreakdownProps {
  facultyData: FacultyData[]
  courseData: CourseData[]
}

function BreakdownBar({ label, percentage, present, total, color }: { label: string; percentage: number; present: number; total: number; color: string }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-700 font-medium truncate max-w-[140px]">{label}</span>
        <span className="text-[10px] text-gray-500 tabular-nums">{present}/{total}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-[10px] font-medium" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  )
}

export default function AnalyticsBreakdown({ facultyData, courseData }: AnalyticsBreakdownProps) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <MdPerson className="text-indigo-500 text-lg" />
          </div>
          <h3 className="font-semibold text-gray-800">Faculty-wise Attendance</h3>
        </div>
        <div className="space-y-3">
          {facultyData.map((f, i) => (
            <BreakdownBar key={f.faculty} label={f.faculty} percentage={f.percentage} present={f.present} total={f.total} color={colors[i % colors.length]} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center">
            <MdBook className="text-cyan-500 text-lg" />
          </div>
          <h3 className="font-semibold text-gray-800">Course-wise Attendance</h3>
        </div>
        <div className="space-y-3">
          {courseData.map((c, i) => (
            <BreakdownBar key={c.course} label={c.course} percentage={c.percentage} present={c.present} total={c.total} color={colors[(i + 2) % colors.length]} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
