import { motion } from 'framer-motion'
import { MdFingerprint, MdRefresh, MdCheckCircle, MdError } from 'react-icons/md'
import type { FingerprintStatus } from '../types/fingerprint.types'

interface FingerprintScannerProps {
  status: FingerprintStatus
  onScan: () => void
  onRetry: () => void
}

const statusConfig: Record<FingerprintStatus, {
  label: string
  color: string
  bg: string
  border: string
  icon: typeof MdFingerprint
}> = {
  waiting: {
    label: 'Place your finger on the scanner',
    color: '#6b7280',
    bg: '#f3f4f6',
    border: '#e5e7eb',
    icon: MdFingerprint,
  },
  scanning: {
    label: 'Scanning fingerprint...',
    color: '#f59e0b',
    bg: '#fef3c7',
    border: '#fbbf24',
    icon: MdFingerprint,
  },
  verified: {
    label: 'Fingerprint verified successfully!',
    color: '#10b981',
    bg: '#d1fae5',
    border: '#34d399',
    icon: MdCheckCircle,
  },
  failed: {
    label: 'Fingerprint did not match. Try again.',
    color: '#ef4444',
    bg: '#fee2e2',
    border: '#f87171',
    icon: MdError,
  },
}

function FingerprintSvg({ status }: { status: FingerprintStatus }) {
  const isScanning = status === 'scanning'
  const isVerified = status === 'verified'
  const isFailed = status === 'failed'
  const arcColor = isVerified ? '#10b981' : isFailed ? '#ef4444' : isScanning ? '#f59e0b' : '#d1d5db'

  return (
    <svg viewBox="0 0 120 160" className="w-28 h-36 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={isScanning ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path
          d="M60 20c-22.1 0-40 17.9-40 40v20c0 22.1 17.9 40 40 40s40-17.9 40-40V60c0-22.1-17.9-40-40-40z"
          stroke={arcColor}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M60 40c-11 0-20 9-20 20v10c0 11 9 20 20 20s20-9 20-20V60c0-11-9-20-20-20z"
          stroke={arcColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M60 58c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z"
          fill={arcColor}
          animate={isScanning ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.path
          d="M45 70c0-8.3 6.7-15 15-15s15 6.7 15 15"
          stroke={arcColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 3"
        />
        <motion.path
          d="M35 80c0-13.8 11.2-25 25-25s25 11.2 25 25"
          stroke={arcColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        <motion.path
          d="M50 90c0-5.5 4.5-10 10-10s10 4.5 10 10"
          stroke={arcColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2 3"
          opacity="0.4"
        />
      </motion.g>

      {isVerified && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <circle cx="60" cy="80" r="28" fill="#10b981" opacity="0.15" />
          <circle cx="60" cy="80" r="18" fill="#10b981" opacity="0.25" />
        </motion.g>
      )}

      {isFailed && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <circle cx="60" cy="80" r="28" fill="#ef4444" opacity="0.15" />
          <circle cx="60" cy="80" r="18" fill="#ef4444" opacity="0.25" />
        </motion.g>
      )}

      {isScanning && (
        <>
          <motion.circle
            cx="60" cy="80" r="32"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
            animate={{ rotate: 360 }}
            style={{ originX: '60px', originY: '80px' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            cx="60" cy="80" r="24"
            stroke="#f59e0b"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 6"
            opacity="0.5"
            animate={{ rotate: -360 }}
            style={{ originX: '60px', originY: '80px' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
    </svg>
  )
}

export default function FingerprintScanner({ status, onScan, onRetry }: FingerprintScannerProps) {
  const config = statusConfig[status] || { label: 'Unknown', color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb', icon: MdFingerprint }
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ backgroundColor: status === 'waiting' ? '#f3f4f6' : config.bg }}
        >
          <MdFingerprint
            className="text-lg transition-colors"
            style={{ color: config.color }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Fingerprint Scanner</h3>
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs"
            style={{ color: config.color }}
          >
            {config.label}
          </motion.p>
        </div>
        {status !== 'waiting' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
          </motion.div>
        )}
      </div>

      <div className="p-6">
        <div
          className="rounded-xl border-2 border-dashed p-6 transition-colors"
          style={{ borderColor: config.border, backgroundColor: `${config.bg}40` }}
        >
          <FingerprintSvg status={status} />

          <motion.div
            className="text-center mt-4"
            animate={{ opacity: 1 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              <Icon className="text-sm" />
              {status === 'waiting' && 'Ready to scan'}
              {status === 'scanning' && 'Scanning...'}
              {status === 'verified' && 'Verified'}
              {status === 'failed' && 'Failed'}
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-5">
          {status === 'waiting' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onScan}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <MdFingerprint className="text-lg" />
              Scan Fingerprint
            </motion.button>
          )}
          {(status === 'failed' || status === 'verified') && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm transition-all"
            >
              <MdRefresh className="text-lg" />
              Scan Again
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
