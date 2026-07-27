import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdNotifications, MdInfo, MdCheckCircle, MdWarning, MdEvent, MdRefresh } from 'react-icons/md'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  info: { icon: MdInfo, color: 'text-info', bg: 'bg-info-light border-info/20' },
  success: { icon: MdCheckCircle, color: 'text-success', bg: 'bg-success-light border-success/20' },
  warning: { icon: MdWarning, color: 'text-warning', bg: 'bg-warning-light border-warning/20' },
  event: { icon: MdEvent, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FacultyNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = () => {
    setLoading(true)
    setError('')
    api.get('/notifications')
      .then((res) => {
        const data = res.data?.data || []
        setNotifications(Array.isArray(data) ? data : [])
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load notifications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotifications() }, [])

  const markRead = (id: string) => {
    api.patch(`/notifications/${id}/read`).catch(() => {})
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
  }

  const unread = notifications.filter((n) => !n.readAt).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-neutral-500 text-sm mt-1">
              {loading ? 'Loading...' : unread > 0 ? `You have ${unread} unread notification${unread > 1 ? 's' : ''}` : 'No unread notifications'}
            </p>
          </div>
          <div className="flex gap-2">
            {unread > 0 && (
              <button onClick={() => { notifications.filter(n => !n.readAt).forEach(n => markRead(n.id)) }} className="btn btn-ghost btn-sm">Mark all as read</button>
            )}
            <button onClick={fetchNotifications} className="btn btn-ghost btn-sm" disabled={loading}>
              <MdRefresh size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="p-4 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger">{error}</motion.div>
        )}

        {loading ? (
          <LoadingSpinner text="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdNotifications size={28} /></div>
            <h3>No notifications</h3>
            <p className="text-neutral-500">You're all caught up!</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-2">
            {notifications.map((n: any, i: number) => {
              const type = TYPE_CONFIG[n.type || 'info'] || TYPE_CONFIG.info
              const Icon = type.icon
              const isRead = !!n.readAt
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`card p-4 cursor-pointer transition-all ${isRead ? 'opacity-60' : 'border-l-4 border-l-primary-500'}`}
                  onClick={() => { if (!isRead) markRead(n.id) }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type.bg}`}>
                      <Icon className={type.color} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isRead ? 'text-neutral-500' : 'font-semibold text-neutral-900'}`}>{n.title || n.message}</p>
                      {n.message && n.title && (
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{n.message}</p>
                      )}
                      <p className="text-xs text-neutral-400 mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                        {n.target ? ` · ${n.target}` : ''}
                      </p>
                    </div>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
