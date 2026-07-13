import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdBook,
  MdCalendarMonth,
  MdAssignment,
  MdSettings,
  MdLogout,
} from 'react-icons/md'

const navItems = [
  { to: '/', icon: MdDashboard, label: 'Dashboard' },
  { to: '/faculty', icon: MdPeople, label: 'Faculty' },
  { to: '/departments', icon: MdSchool, label: 'Departments' },
  { to: '/courses', icon: MdBook, label: 'Courses' },
  { to: '/schedule', icon: MdCalendarMonth, label: 'Schedule' },
  { to: '/faculty/assign', icon: MdAssignment, label: 'Assignments' },
]

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-lg flex flex-col"
    >
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
          <MdSchool className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">EduManage</h1>
          <p className="text-xs text-gray-500">College ERP System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-800'
              }`
            }
          >
            <item.icon className="text-lg" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100/50 space-y-1">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50/50 hover:text-gray-800 w-full transition-all duration-200">
          <MdSettings className="text-lg" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50/50 w-full transition-all duration-200">
          <MdLogout className="text-lg" />
          Logout
        </button>
      </div>
    </motion.aside>
  )
}
