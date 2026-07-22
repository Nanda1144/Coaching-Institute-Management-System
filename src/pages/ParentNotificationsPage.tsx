import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdNotifications, MdInfo, MdCheckCircle, MdWarning, MdEvent, MdDelete, MdMessage } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  info: { icon: MdInfo, color: 'text-info' },
  success: { icon: MdCheckCircle, color: 'text-success' },
  warning: { icon: MdWarning, color: 'text-warning' },
  event: { icon: MdEvent, color: 'text-primary' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export default function ParentNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showContact, setShowContact] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [sent, setSent] = useState(false)

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-notifications'],
    queryFn: () => parentDashboardService.getNotifications(),
  })

  useEffect(() => {
    if (response?.data) {
      setNotifications(response.data)
    }
  }, [response])

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const remove = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  const unread = notifications.filter((n) => !n.read).length

  const handleContactSubmit = () => {
    if (!contactMsg.trim()) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setContactMsg('')
      setShowContact(false)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-40" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="skeleton w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="gradient-text text-3xl font-bold">Notifications</h1>
            <p className="text-neutral-500 mt-1">No unread notifications</p>
          </div>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load notifications. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="gradient-text text-3xl font-bold">Notifications</h1>
          <p className="text-neutral-500 mt-1">
            {unread > 0 ? `${unread} unread` : 'No unread notifications'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
              className="btn btn-ghost btn-sm"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowContact(!showContact)}
            className="btn btn-secondary btn-sm"
          >
            <MdMessage size={16} /> Contact Faculty
          </button>
        </div>
      </motion.div>

      {showContact && (
        <motion.div
          className="card p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Contact Faculty</h3>
          <textarea
            value={contactMsg}
            onChange={(e) => setContactMsg(e.target.value)}
            placeholder="Type your message here..."
            rows={3}
            className="input-field resize-none"
          />
          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={() => {
                setShowContact(false)
                setContactMsg('')
              }}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleContactSubmit}
              disabled={!contactMsg.trim() || sent}
              className="btn btn-primary btn-sm"
            >
              {sent ? 'Sent!' : 'Send Message'}
            </button>
          </div>
        </motion.div>
      )}

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><MdNotifications size={24} /></div>
          <p className="text-neutral-500">No notifications</p>
        </div>
      ) : (
        <motion.div
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type]
            const Icon = config?.icon || MdInfo
            return (
              <motion.div
                key={n.id}
                className={`card p-4 cursor-pointer ${n.read ? 'opacity-70' : 'border-l-4 border-l-primary'}`}
                variants={itemVariants}
                onClick={() => markRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      n.read ? 'bg-neutral-50' : 'bg-primary-50'
                    }`}
                  >
                    <Icon className={n.read ? 'text-neutral-400' : config?.color || 'text-primary'} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          className={`text-sm ${n.read ? 'text-neutral-500' : 'text-neutral-900 font-semibold'}`}
                        >
                          {n.title}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">{n.message}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(n.id)
                        }}
                        className="text-neutral-300 hover:text-danger shrink-0"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      {new Date(n.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
