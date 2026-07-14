import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdDownload, MdPictureAsPdf, MdTableChart, MdPrint, MdCheckCircle } from 'react-icons/md'

export default function ReportActions() {
  const [action, setAction] = useState<string | null>(null)

  const handleAction = (label: string) => {
    setAction(label)
    setTimeout(() => setAction(null), 2000)
  }

  const buttons: { label: string; icon: typeof MdDownload; desc: string; color: string; bg: string }[] = [
    { label: 'Download PDF', icon: MdPictureAsPdf, desc: 'Save as PDF document', color: '#ef4444', bg: '#fee2e2' },
    { label: 'Export Excel', icon: MdTableChart, desc: 'Export to spreadsheet', color: '#10b981', bg: '#d1fae5' },
    { label: 'Print', icon: MdPrint, desc: 'Send to printer', color: '#3b82f6', bg: '#dbeafe' },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Export & Print</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {buttons.map((btn) => {
            const Icon = btn.icon
            return (
              <motion.button
                key={btn.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAction(btn.label)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: btn.bg, color: btn.color }}
                >
                  <Icon className="text-lg" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{btn.label}</p>
                  <p className="text-[10px] text-gray-400">{btn.desc}</p>
                </div>
              </motion.button>
            )
          })}
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
          <span className="text-sm font-medium text-emerald-800">
            Report exported as {action}
          </span>
        </motion.div>
      )}
    </>
  )
}
