import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdSchool, MdAssessment, MdWarning, MdCalendarMonth } from 'react-icons/md'

const actions = [
  { label: 'Timetable', icon: MdSchool, color: '#8b5cf6', bg: '#ede9fe', route: '/dashboard/faculty/timetable' },
  { label: 'Conflicts Alert', icon: MdWarning, color: '#ef4444', bg: '#fee2e2', route: '/dashboard/timetable/calendar' },
  { label: 'Calendar View', icon: MdCalendarMonth, color: '#3b82f6', bg: '#dbeafe', route: '/dashboard/timetable/calendar' },
  { label: 'Generate Report', icon: MdAssessment, color: '#f59e0b', bg: '#fef3c7', route: '/dashboard/attendance/reports' },
]

export default function QuickActions() {
  const navigate = useNavigate()

  const handleClick = (route: string) => {
    navigate(route)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(action.route)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: action.bg + '60' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: action.bg, color: action.color }}
              >
                <Icon className="text-xl" />
              </div>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
