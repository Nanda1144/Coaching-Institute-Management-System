import { motion } from 'framer-motion'
import { MdQrCode, MdRefresh, MdCameraAlt, MdCamera, MdArrowBack, MdHowToVote } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface QRActionsProps {
  isScannerOn: boolean
  hasQR: boolean
  onGenerate: () => void
  onRefresh: () => void
  onStartScanner: () => void
  onStopScanner: () => void
}

export default function QRActions({ isScannerOn, hasQR, onGenerate, onRefresh, onStartScanner, onStopScanner }: QRActionsProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!hasQR ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGenerate}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center transition-colors">
              <MdQrCode className="text-indigo-600 text-lg" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Generate QR</p>
              <p className="text-[10px] text-gray-400">Create new QR code</p>
            </div>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRefresh}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center transition-colors">
              <MdRefresh className="text-indigo-600 text-lg" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Refresh QR</p>
              <p className="text-[10px] text-gray-400">Generate new QR code</p>
            </div>
          </motion.button>
        )}

        {!isScannerOn ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartScanner}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center transition-colors">
              <MdCameraAlt className="text-emerald-600 text-lg" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Start Scanner</p>
              <p className="text-[10px] text-gray-400">Begin QR scanning</p>
            </div>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStopScanner}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 bg-white hover:bg-red-50 shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center transition-colors">
              <MdCamera className="text-red-500 text-lg" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Stop Scanner</p>
              <p className="text-[10px] text-red-400">Deactivate camera</p>
            </div>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center transition-colors">
            <MdHowToVote className="text-blue-600 text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">View Attendance</p>
            <p className="text-[10px] text-gray-400">Attendance dashboard</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center transition-colors">
            <MdArrowBack className="text-gray-600 text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">Back</p>
            <p className="text-[10px] text-gray-400">Return to attendance</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
