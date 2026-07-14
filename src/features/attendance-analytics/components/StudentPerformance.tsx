import { motion } from 'framer-motion'
import { MdEmojiEvents, MdWarning } from 'react-icons/md'
import type { StudentData } from '../types/attendanceAnalytics.types'

interface StudentPerformanceProps {
  topStudents: StudentData[]
  lowStudents: StudentData[]
}

function StudentTable({ students, type }: { students: StudentData[]; type: 'top' | 'low' }) {
  const isTop = type === 'top'
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2.5 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">Student</th>
            <th className="text-left py-2.5 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">Roll</th>
            <th className="text-left py-2.5 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">Present</th>
            <th className="text-left py-2.5 px-2 text-gray-500 font-medium text-[10px] uppercase tracking-wider">%</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <motion.tr
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-gray-50 hover:bg-white/50 transition-colors"
            >
              <td className="py-2.5 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-bold ${
                    isTop ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-xs text-gray-800 font-medium truncate max-w-[100px]">{s.name}</span>
                </div>
              </td>
              <td className="py-2.5 px-2 text-xs text-gray-500">{s.rollNumber}</td>
              <td className="py-2.5 px-2 text-xs text-gray-600 tabular-nums">{s.present}/{s.total}</td>
              <td className="py-2.5 px-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isTop ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {s.percentage}%
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function StudentPerformance({ topStudents, lowStudents }: StudentPerformanceProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <MdEmojiEvents className="text-amber-500 text-lg" />
          </div>
          <h3 className="font-semibold text-gray-800">Top Regular Students</h3>
        </div>
        <StudentTable students={topStudents} type="top" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
            <MdWarning className="text-red-500 text-lg" />
          </div>
          <h3 className="font-semibold text-gray-800">Low Attendance Students</h3>
        </div>
        <StudentTable students={lowStudents} type="low" />
      </motion.div>
    </div>
  )
}
