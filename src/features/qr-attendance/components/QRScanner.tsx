import { motion } from 'framer-motion'
import { MdCameraAlt, MdCamera, MdCheckCircle, MdCancel, MdTimerOff, MdHowToVote } from 'react-icons/md'
import type { QRStatus } from '../types/qrAttendance.types'

interface QRScannerProps {
  isScannerOn: boolean
  scanStatus: QRStatus
  onStart: () => void
  onStop: () => void
}

const scanStatusConfig: Record<QRStatus, { label: string; icon: typeof MdCheckCircle; color: string; bg: string }> = {
  valid: { label: 'Valid QR Code', icon: MdCheckCircle, color: '#10b981', bg: '#d1fae5' },
  invalid: { label: 'Invalid QR Code', icon: MdCancel, color: '#ef4444', bg: '#fee2e2' },
  expired: { label: 'Expired QR Code', icon: MdTimerOff, color: '#f59e0b', bg: '#fef3c7' },
  attendance_success: { label: 'Attendance Marked Successfully', icon: MdHowToVote, color: '#3b82f6', bg: '#dbeafe' },
}

export default function QRScanner({ isScannerOn, scanStatus, onStart, onStop }: QRScannerProps) {
  const config = scanStatusConfig[scanStatus] || { label: 'Unknown', icon: MdCheckCircle, color: '#6b7280', bg: '#f3f4f6' }
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isScannerOn ? 'bg-emerald-100' : 'bg-gray-100'}`}>
          {isScannerOn ? <MdCamera className="text-emerald-600 text-lg" /> : <MdCameraAlt className="text-gray-400 text-lg" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">QR Scanner</h3>
          <p className="text-xs text-gray-500">{isScannerOn ? 'Scanner is active' : 'Scanner is off'}</p>
        </div>
        {scanStatus !== 'valid' && isScannerOn && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ backgroundColor: config.bg }}
          >
            <Icon className="text-xs" style={{ color: config.color }} />
            <span className="text-[10px] font-medium" style={{ color: config.color }}>{config.label}</span>
          </motion.div>
        )}
      </div>

      <div className="p-5">
        <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-[4/3] flex items-center justify-center">
          {isScannerOn ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MdCamera className="text-6xl text-gray-600 mx-auto mb-2" />
                  </motion.div>
                  <p className="text-gray-500 text-xs">Camera Feed Preview</p>
                  <p className="text-gray-600 text-[10px] mt-1">(Camera placeholder)</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/70 rounded-tl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/70 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/70 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/70 rounded-br" />
                  </div>
                </div>

                <motion.div
                  className="absolute left-12 right-12 h-0.5 bg-cyan-400/60 shadow-lg shadow-cyan-400/30"
                  animate={{ top: ['30%', '70%', '30%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {scanStatus === 'valid' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-emerald-500/30 backdrop-blur flex items-center justify-center">
                        <MdCheckCircle className="text-5xl text-emerald-400" />
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {scanStatus === 'invalid' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-red-900/30 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div animate={{ x: [-3, 3, -3] }} transition={{ duration: 0.2, repeat: Infinity }}>
                        <MdCancel className="text-5xl text-red-400 mx-auto" />
                      </motion.div>
                      <p className="text-red-300 text-xs mt-1 font-medium">Invalid QR</p>
                    </div>
                  </motion.div>
                )}

                {scanStatus === 'expired' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-amber-900/30 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <MdTimerOff className="text-5xl text-amber-400 mx-auto mb-1" />
                      <p className="text-amber-300 text-xs font-medium">QR Expired</p>
                    </div>
                  </motion.div>
                )}

                {scanStatus === 'attendance_success' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-900/30 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <MdHowToVote className="text-5xl text-blue-400 mx-auto mb-1" />
                      </motion.div>
                      <p className="text-blue-300 text-xs font-medium">Attendance Recorded</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <MdCameraAlt className="text-6xl text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Scanner is off</p>
              <p className="text-gray-500 text-xs mt-1">Click "Start Scanner" to begin scanning QR codes</p>
            </div>
          )}
        </div>

        {isScannerOn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-center"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              <Icon className="text-lg" />
              {config.label}
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-3 mt-4">
          {!isScannerOn ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <MdCameraAlt className="text-lg" />
              Start Scanner
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStop}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all"
            >
              <MdCamera className="text-lg" />
              Stop Scanner
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
