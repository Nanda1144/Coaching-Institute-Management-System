import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdMenu,
  MdNotifications,
  MdSearch,
  MdDarkMode,
  MdLightMode,
} from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  onToggleSidebar: () => void
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user: authUser } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const name = authUser?.name || authUser?.email || 'User'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const user = { name, email: authUser?.email || '', initials }

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors text-gray-600"
          >
            <MdMenu className="text-2xl" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-gray-50/50 rounded-xl px-4 py-2 border border-gray-100/50 focus-within:border-primary/30 focus-within:bg-white transition-all">
            <MdSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty, courses..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-64 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors text-gray-600"
          >
            {darkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors text-gray-600 relative"
            >
              <MdNotifications className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { title: 'New Leave Request', desc: 'Dr. Vikram Singh requested medical leave', time: '10 min ago' },
                      { title: 'Course Assignment', desc: 'Prof. Priya Patel assigned to CS304', time: '1 hour ago' },
                      { title: 'Profile Update', desc: 'Dr. Rajesh Kumar updated profile', time: '3 hours ago' },
                    ].map((n, i) => (
                      <div key={i} className="p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {user.initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
