import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdDownload, MdPrint, MdCheckCircle } from 'react-icons/md'

export default function AnalyticsActions() {
  const [action, setAction] = useState<string | null>(null)

  const handleAction = (label: string) => {
    setAction(label)
    if (label === 'Export Analytics') {
    } else if (label === 'Print Dashboard') {
      window.print()
    }
    setTimeout(() => setAction(null), 2000)
  }

  const buttons: { label: string; icon: typeof MdDownload; desc: string; gradient: string }[] = [
    { label: 'Export Analytics', icon: MdDownload, desc: 'Download full analytics report', gradient: 'from-primary to-primary-light' },
    { label: 'Print Dashboard', icon: MdPrint, desc: 'Send dashboard to printer', gradient: 'from-gray-600 to-gray-700' },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-800">Analytics Actions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Export or print the analytics dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {buttons.map((btn) => {
              const Icon = btn.icon
              return (
                <motion.button
                  key={btn.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAction(btn.label)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${btn.gradient} text-white text-sm font-medium shadow-md hover:shadow-lg transition-all`}
                >
                  <Icon className="text-base" />
                  {btn.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xl"
        >
          <MdCheckCircle className="text-emerald-500 text-lg" />
          <span className="text-sm font-medium text-emerald-800">{action} completed</span>
        </motion.div>
      )}
    </>
  )
}
