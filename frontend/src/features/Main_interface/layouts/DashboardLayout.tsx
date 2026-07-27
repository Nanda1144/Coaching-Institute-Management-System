import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, GraduationCap, LayoutDashboard, Users, BookOpen, Calendar,
  ClipboardCheck, BarChart3, Settings, LogOut, ChevronLeft,
} from 'lucide-react'
import type { DashboardLayoutProps } from '../types'
import { cn } from '../utils/cn'
import { Avatar, IconButton } from '../components'

const defaultSidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Students', href: '/students', icon: <Users size={20} /> },
  { label: 'Faculty', href: '/faculty', icon: <Users size={20} /> },
  { label: 'Courses', href: '/courses', icon: <BookOpen size={20} /> },
  { label: 'Schedule', href: '/schedule', icon: <Calendar size={20} /> },
  { label: 'Attendance', href: '/attendance', icon: <ClipboardCheck size={20} /> },
  { label: 'Reports', href: '/reports', icon: <BarChart3 size={20} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
]

export default function DashboardLayout({ children, sidebarItems = defaultSidebarItems }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="text-white" size={18} />
          </div>
          <span className={cn('text-base font-bold text-gray-900', !sidebarOpen && 'lg:hidden')}>CIMS</span>
        </NavLink>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
        >
          <ChevronLeft size={18} className={cn('transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className={cn('truncate', !sidebarOpen && 'lg:hidden')}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">
          <Avatar name="Admin User" size="sm" />
          <div className={cn('flex-1 min-w-0', !sidebarOpen && 'lg:hidden')}>
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@cims.edu</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 mt-1">
          <LogOut size={20} />
          <span className={cn(!sidebarOpen && 'lg:hidden')}>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 hidden lg:block',
        sidebarOpen ? 'w-64' : 'w-20',
      )}>
        {sidebar}
      </aside>

      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebar(false)} />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative w-64 h-full bg-white shadow-xl"
            >
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        'transition-all duration-300',
        'lg:ml-64',
        !sidebarOpen && 'lg:ml-20',
      )}>
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebar(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
              >
                <Menu size={22} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <IconButton icon={<BarChart3 size={18} />} label="Notifications" variant="ghost" />
              <Avatar name="Admin User" size="sm" />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
