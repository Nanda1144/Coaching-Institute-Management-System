import { motion } from 'framer-motion'
import { MdRadioButtonUnchecked, MdFace, MdVisibility, MdCheckCircle, MdErrorOutline } from 'react-icons/md'
import type { RecognitionStatusType } from '../types/faceRecognition.types'

interface RecognitionStatusProps {
  status: RecognitionStatusType
}

const steps: { key: RecognitionStatusType; label: string; icon: typeof MdRadioButtonUnchecked }[] = [
  { key: 'waiting', label: 'Waiting', icon: MdRadioButtonUnchecked },
  { key: 'detecting', label: 'Detecting Face', icon: MdFace },
  { key: 'detected', label: 'Face Detected', icon: MdVisibility },
  { key: 'marked', label: 'Attendance Marked', icon: MdCheckCircle },
  { key: 'failed', label: 'Recognition Failed', icon: MdErrorOutline },
]

const statusIndex: Record<RecognitionStatusType, number> = {
  waiting: 0,
  detecting: 1,
  detected: 2,
  marked: 3,
  failed: 4,
}

const statusColor: Record<RecognitionStatusType, string> = {
  waiting: '#6b7280',
  detecting: '#f59e0b',
  detected: '#10b981',
  marked: '#10b981',
  failed: '#ef4444',
}

export default function RecognitionStatus({ status }: RecognitionStatusProps) {
  const currentIdx = statusIndex[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Recognition Status</h3>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = status === step.key
          const isPast = currentIdx > idx && status !== 'failed'
          const isFailedStep = status === 'failed' && idx === 4
          const isCompleted = isPast || (status === 'failed' && idx < 4)

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                    backgroundColor: isActive ? statusColor[status] : isCompleted ? '#10b981' : '#f3f4f6',
                    color: isActive || isCompleted ? '#ffffff' : '#9ca3af',
                  }}
                  transition={{ duration: 0.3, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${
                    isFailedStep ? 'bg-red-100 text-red-500' : ''
                  }`}
                  style={isActive || isCompleted ? { backgroundColor: statusColor[status], color: 'white' } : {}}
                >
                  {isCompleted ? (
                    <MdCheckCircle className="text-white text-sm" />
                  ) : isFailedStep ? (
                    <MdErrorOutline className="text-red-500 text-sm" />
                  ) : (
                    <Icon className={`text-sm ${isActive ? 'text-white' : ''}`} />
                  )}
                </motion.div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-6 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>

              <div className="flex-1">
                <motion.p
                  animate={{
                    color: isActive ? statusColor[status] : isCompleted ? '#10b981' : '#9ca3af',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  className={`text-sm transition-all ${isFailedStep ? 'text-red-500 font-medium' : ''}`}
                >
                  {step.label}
                </motion.p>
                {isActive && status === 'detecting' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-amber-500 mt-0.5"
                  >
                    Scanning face...
                  </motion.p>
                )}
                {isActive && status === 'detected' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-green-500 mt-0.5"
                  >
                    Face matched successfully
                  </motion.p>
                )}
                {isActive && status === 'marked' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-green-500 mt-0.5"
                  >
                    Attendance record created
                  </motion.p>
                )}
              </div>

              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColor[status] }}
                />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
