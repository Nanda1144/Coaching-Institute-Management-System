import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdDownload, MdPictureAsPdf, MdTableChart, MdPrint, MdCheckCircle } from 'react-icons/md'
import * as XLSX from 'xlsx'
import type { SummaryStats } from '../types/attendanceReports.types'

interface ReportActionsProps {
  summary?: SummaryStats
}

export default function ReportActions({ summary }: ReportActionsProps) {
  const [action, setAction] = useState<string | null>(null)

  const exportExcel = () => {
    if (!summary) return
    const data = [
      { Metric: 'Total Students', Value: summary.total },
      { Metric: 'Present', Value: summary.present },
      { Metric: 'Absent', Value: summary.absent },
      { Metric: 'Late', Value: summary.late },
      { Metric: 'Leave', Value: summary.leave },
      { Metric: 'Percentage', Value: `${summary.percentage}%` },
    ]
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, `attendance-report-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleAction = (label: string) => {
    setAction(label)
    if (label === 'Download PDF' || label === 'Print') {
      window.print()
    } else if (label === 'Export Excel') {
      exportExcel()
    }
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
