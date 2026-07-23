import { motion } from 'framer-motion'
import { MdQrCode, MdSchool, MdPerson, MdBook, MdGroup, MdAccessTime, MdTimer } from 'react-icons/md'
import type { QRCodeData, QRStatus } from '../types/qrAttendance.types'

interface QRGeneratorProps {
  qrData: QRCodeData | null
  qrStatus: QRStatus
  secondsLeft: number
  onGenerate: () => void
  onRefresh: () => void
}

const statusConfig: Record<QRStatus, { label: string; color: string; bg: string }> = {
  valid: { label: 'QR Code Active', color: '#10b981', bg: '#d1fae5' },
  invalid: { label: 'QR Code Invalid', color: '#ef4444', bg: '#fee2e2' },
  expired: { label: 'QR Code Expired', color: '#f59e0b', bg: '#fef3c7' },
  attendance_success: { label: 'Attendance Marked', color: '#3b82f6', bg: '#dbeafe' },
}

export default function QRGenerator({ qrData, qrStatus, secondsLeft, onGenerate, onRefresh }: QRGeneratorProps) {
  const config = statusConfig[qrStatus] || { label: 'Unknown', color: '#6b7280', bg: '#f3f4f6' }
  const timerPercent = qrData ? (secondsLeft / 900) * 100 : 0
  const timerMinutes = Math.floor(secondsLeft / 60)
  const timerSeconds = secondsLeft % 60

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
          <MdQrCode className="text-indigo-600 text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">QR Code Generator</h3>
          <p className="text-xs text-gray-500">Generate QR codes for attendance marking</p>
        </div>
        {qrData && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ backgroundColor: config.bg }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-[10px] font-medium" style={{ color: config.color }}>
              {config.label}
            </span>
          </motion.div>
        )}
      </div>

      <div className="p-5">
        {!qrData ? (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <MdQrCode className="text-5xl text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 mb-4">No QR code generated yet</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGenerate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <MdQrCode className="text-lg" />
              Generate QR Code
            </motion.button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                key={qrData.id}
              >
                <div className="w-44 h-44 rounded-2xl bg-white p-3 shadow-lg border border-gray-100">
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white" />
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white" />
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white" />
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white" />
                    </div>
                    <div className="relative grid grid-cols-7 gap-0.5 p-2">
                      {Array.from({ length: 49 }).map((_, i) => {
                        const isBlack = [0, 1, 5, 6, 7, 13, 35, 41, 42, 43, 47, 48, 18, 24, 30].includes(i) ||
                          (i >= 0 && i <= 6) || (i >= 42 && i <= 48) ||
                          i % 7 === 0 || i % 7 === 6 ||
                          (i >= 14 && i <= 20 && i % 7 >= 2 && i % 7 <= 4 && (i === 16 || i === 17 || i === 19))
                        return (
                          <div
                            key={'sk' + i}
                            className={`w-3 h-3 rounded-sm ${isBlack ? 'bg-white' : 'bg-transparent'}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-indigo-50/50 rounded-xl p-4 space-y-2.5">
              {[
                { icon: MdSchool, label: 'Course', value: qrData.course },
                { icon: MdPerson, label: 'Faculty', value: qrData.faculty },
                { icon: MdBook, label: 'Subject', value: qrData.subject },
                { icon: MdGroup, label: 'Batch', value: `${qrData.batch} - Section ${qrData.section}` },
                { icon: MdAccessTime, label: 'Generated', value: new Date(qrData.generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
              ].map((field) => (
                <div key={field.label} className="flex items-center gap-2.5">
                  <field.icon className="text-indigo-400 text-sm flex-shrink-0" />
                  <span className="text-xs text-gray-500 w-20">{field.label}</span>
                  <span className="text-xs font-medium text-gray-800 truncate">{field.value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MdTimer className="text-gray-400 text-sm" />
                  <span className="text-xs text-gray-500">Expires in</span>
                </div>
                <motion.span
                  key={secondsLeft}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={`text-sm font-bold tabular-nums ${
                    secondsLeft <= 60 ? 'text-red-500' : secondsLeft <= 180 ? 'text-amber-500' : 'text-gray-800'
                  }`}
                >
                  {timerMinutes}:{timerSeconds.toString().padStart(2, '0')}
                </motion.span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  key={secondsLeft}
                  initial={{ width: `${timerPercent}%` }}
                  animate={{ width: `${timerPercent}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className={`h-full rounded-full ${
                    secondsLeft <= 60 ? 'bg-red-400' : secondsLeft <= 180 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRefresh}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                <MdQrCode className="text-lg" />
                Refresh QR
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
