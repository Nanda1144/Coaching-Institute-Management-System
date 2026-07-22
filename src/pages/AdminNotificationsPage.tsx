import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdNotifications, MdSend, MdPeople, MdSchool, MdGroup, MdVolumeUp, MdHistory, MdSchedule } from 'react-icons/md'
import { useNotificationHistory, useSendNotification } from '../hooks/useReactQuery'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('all')
  const [sent, setSent] = useState(false)

  const { data: historyData, isLoading, isError, refetch } = useNotificationHistory()
  const sendNotification = useSendNotification()

  const history = Array.isArray(historyData) ? historyData : []

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return
    sendNotification.mutate({ title, message, target })
    setSent(true)
    setTimeout(() => { setSent(false); setTitle(''); setMessage('') }, 2000)
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Notifications</h1>
          <p>Send notifications to students, faculty, or parents</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdVolumeUp className="text-primary" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Send Notification</h3>
              <p className="text-xs text-neutral-500">Craft and send a message to your audience</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="input-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title..." className="input-field" />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={4} className="input-field resize-none min-h-[100px]" />
            </div>
            <div className="input-group">
              <label>Send To</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'all', label: 'All', icon: MdGroup, color: 'text-neutral-600' },
                  { value: 'faculty', label: 'Faculty', icon: MdSchool, color: 'text-blue-600' },
                  { value: 'students', label: 'Students', icon: MdPeople, color: 'text-emerald-600' },
                  { value: 'parents', label: 'Parents', icon: MdGroup, color: 'text-purple-600' },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => setTarget(opt.value)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      target === opt.value
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary/30 hover:bg-primary-50/50'
                    }`}>
                    <opt.icon size={18} /> {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSend} disabled={!title.trim() || !message.trim() || sent || sendNotification.isPending}
              className="btn btn-primary w-full justify-center">
              <MdSend size={18} />
              {sendNotification.isPending ? 'Sending...' : sent ? 'Sent!' : 'Send Notification'}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><MdHistory className="text-amber-600" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Notification History</h3>
              <p className="text-xs text-neutral-500">Previously sent notifications</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="empty-state !py-8">
              <p className="text-sm text-danger mb-3">Failed to load history</p>
              <button onClick={() => refetch()} className="btn btn-primary btn-sm">Retry</button>
            </div>
          ) : (
            <>
              {history.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><MdNotifications size={28} /></div>
                  <h3>No notifications sent yet</h3>
                  <p>Start sending notifications to see your history here.</p>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {history.map((h: any) => (
                    <motion.div key={h.id} variants={itemVariants} className="card p-4 hover:border-primary-200 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-neutral-800">{h.title}</h4>
                            <span className="badge badge-info shrink-0">{h.target}</span>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed">{h.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-400">
                        <MdSchedule size={14} />
                        <span>{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
