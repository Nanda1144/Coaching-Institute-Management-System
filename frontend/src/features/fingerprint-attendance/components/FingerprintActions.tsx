import { motion } from 'framer-motion'
import { MdFingerprint, MdEditNote, MdVisibility, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface FingerprintActionsProps {
  onRetry: () => void
}

export default function FingerprintActions({ onRetry }: FingerprintActionsProps) {
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
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <MdFingerprint className="text-primary text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">Retry Scan</p>
            <p className="text-[10px] text-gray-400">Scan another fingerprint</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/attendance/manual')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <MdEditNote className="text-amber-600 text-lg" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800">Manual Attendance</p>
            <p className="text-[10px] text-gray-400">Mark attendance manually</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <MdVisibility className="text-emerald-600 text-lg" />
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
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <MdArrowBack className="text-indigo-600 text-lg" />
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
