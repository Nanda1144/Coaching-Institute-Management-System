import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdNotifications, MdInfo, MdCheckCircle, MdWarning, MdEvent, MdDelete, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'

const TYPE_CONFIG = {
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

export default function StudentNotificationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-notifications'],
    queryFn: () => studentDashboardService.getNotifications(),
  })

  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data)
    }
  }, [data])

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-neutral-500 text-sm mt-1">{unread > 0 ? `You have ${unread} unread notification${unread > 1 ? 's' : ''}` : 'No unread notifications'}</p>
          </div>
          {unread > 0 && <button onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))} className="btn btn-ghost btn-sm">Mark all as read</button>}
        </motion.div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={'sk' + i} className="card p-4">
                <div className="flex items-start gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-md skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton rounded w-1/2" />
                    <div className="h-3 skeleton rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load notifications</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-2">
            {notifications.map((n: { id: string; type: string; read: boolean; title: string; message: string; date: string }) => {
              const config = TYPE_CONFIG[n.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.info
              const Icon = config.icon
              return (
                <motion.div
                  key={n.id}
                  layout
                  className={`card p-4 cursor-pointer transition-all ${n.read ? 'opacity-70' : 'border-l-4 border-l-primary'}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${n.read ? 'bg-neutral-100' : 'bg-primary-50'}`}>
                      <Icon className={n.read ? 'text-neutral-400' : config.color} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`text-sm ${n.read ? 'text-neutral-500' : 'text-neutral-800 font-semibold'}`}>{n.title}</h4>
                          <p className="text-xs text-neutral-400 mt-0.5">{n.message}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); remove(n.id) }} className="text-neutral-300 hover:text-danger transition-colors shrink-0"><MdDelete size={16} /></button>
                      </div>
                      <p className="text-xs text-neutral-400 mt-2">{new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            {notifications.length === 0 && (
              <div className="empty-state card">
                <div className="empty-state-icon"><MdNotifications size={28} /></div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
