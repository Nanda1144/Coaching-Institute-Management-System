import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdMenu, MdNotifications, MdSearch, MdDarkMode, MdLightMode,
  MdClose, MdCheckCircle, MdWarning, MdInfo,
} from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import notificationService from '../services/notification/notification.service'

interface NavbarProps {
  onToggleSidebar: () => void
  sidebarOpen?: boolean
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user: authUser } = useAuth()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const name = authUser?.name || authUser?.email || 'User'
  const email = authUser?.email || ''
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setLoadingNotifs(true)
    notificationService.getHistory()
      .then((res) => {
        const data = res?.data?.data || res?.data || res || []
        setNotifications(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setNotifications([])
      })
      .finally(() => setLoadingNotifs(false))
  }, [])

  const notifIcon = (type: string) => {
    switch (type) {
      case 'success': return <MdCheckCircle className="text-success" />
      case 'warning': return <MdWarning className="text-warning" />
      default: return <MdInfo className="text-primary" />
    }
  }

  const unreadCount = notifications.filter((n: any) => !n.readAt).length

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-500"
            aria-label="Toggle sidebar"
          >
            <MdMenu className="text-xl" />
          </button>

          <div className={`hidden md:flex items-center gap-2.5 rounded-xl px-4 py-2 border transition-all duration-200 ${
            searchFocused
              ? 'border-primary-300 bg-white shadow-sm shadow-primary-100'
              : 'border-neutral-200 bg-neutral-50/50'
          }`}>
            <MdSearch className={`text-lg transition-colors ${searchFocused ? 'text-primary-500' : 'text-neutral-400'}`} />
            <input
              type="text"
              placeholder="Search faculty, courses, students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm text-neutral-700 w-48 xl:w-72 placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 rounded hover:bg-neutral-100 text-neutral-400">
                <MdClose className="text-sm" />
              </button>
            )}
          </div>
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-500"
            aria-label="Search"
          >
            <MdSearch className="text-xl" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-500 relative group"
            aria-label="Toggle dark mode"
          >
            <motion.div
              key={darkMode ? 'dark' : 'light'}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {darkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </motion.div>
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-500 relative"
              aria-label="Notifications"
            >
              <MdNotifications className="text-xl" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"
                />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-dropdown border border-neutral-200/80 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                    <div>
                      <h3 className="font-semibold text-neutral-800">Notifications</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">{unreadCount} unread</p>
                    </div>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifs ? (
                      <div className="px-5 py-8 text-center text-sm text-neutral-400">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-neutral-400">No notifications</div>
                    ) : (
                      notifications.map((n: any, i: number) => (
                        <motion.div
                          key={n.id ?? `notif-${i}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-start gap-3 px-5 py-3.5 hover:bg-neutral-50 transition-colors cursor-pointer border-b border-neutral-50 last:border-0 ${!n.readAt ? 'bg-primary-50/30' : ''}`}
                        >
                          <div className="mt-0.5">{notifIcon(n.type || 'info')}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-800">{n.title}</p>
                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{n.message || n.desc}</p>
                          </div>
                          <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </div>
                  <div className="px-5 py-3 border-t border-neutral-100">
                    <button className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-neutral-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-neutral-800 leading-tight">{name}</p>
              <p className="text-[11px] text-neutral-400">{email || 'No email'}</p>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-primary-200 transition-transform duration-200 group-hover:scale-105">
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-success" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
