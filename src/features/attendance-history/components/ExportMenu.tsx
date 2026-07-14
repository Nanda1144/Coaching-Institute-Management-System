import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdDownload, MdTableChart, MdDescription, MdTextSnippet, MdCheckCircle } from 'react-icons/md'
import type { HistoryRecord } from '../types/attendanceHistory.types'

interface ExportMenuProps {
  records: HistoryRecord[]
}

export default function ExportMenu({ records }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [exported, setExported] = useState<'csv' | 'pdf' | 'excel' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    setExported(format)
    setTimeout(() => setExported(null), 2000)
    setOpen(false)
  }

  const options: { key: 'csv' | 'pdf' | 'excel'; label: string; desc: string; icon: typeof MdDownload }[] = [
    { key: 'csv', label: 'Export as CSV', desc: 'Plain text spreadsheet', icon: MdTextSnippet },
    { key: 'excel', label: 'Export as Excel', desc: 'Microsoft Excel format', icon: MdTableChart },
    { key: 'pdf', label: 'Export as PDF', desc: 'Document format', icon: MdDescription },
  ]

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
      >
        <MdDownload className="text-base" />
        Export
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl overflow-hidden z-10"
          >
            <div className="p-2 space-y-1">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleExport(opt.key)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <opt.icon className="text-sm text-gray-500 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{opt.label}</p>
                    <p className="text-[10px] text-gray-400">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-400">
                {records.length} records will be exported
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {exported && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xl"
          >
            <MdCheckCircle className="text-emerald-500 text-lg" />
            <span className="text-sm font-medium text-emerald-800 capitalize">
              Exported as {exported}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
