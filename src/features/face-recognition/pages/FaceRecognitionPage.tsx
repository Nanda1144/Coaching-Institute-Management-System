import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdArrowBack, MdHome } from 'react-icons/md'
import CameraPreview from '../components/CameraPreview'
import RecognitionStatus from '../components/RecognitionStatus'
import StudentInfoCard from '../components/StudentInfoCard'
import RecognitionHistory from '../components/RecognitionHistory'
import StatisticsCards from '../components/StatisticsCards'
import Toast from '../../../components/Toast'
import { dummyStudent, historyRecords, dummyStats } from '../data/faceRecognitionData'
import type { RecognitionStatusType, RecognizedStudent } from '../types/faceRecognition.types'

const recognitionSteps: RecognitionStatusType[] = ['detecting', 'detected', 'marked']

export default function FaceRecognitionPage() {
  const navigate = useNavigate()
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [status, setStatus] = useState<RecognitionStatusType>('waiting')
  const [recognizedStudent, setRecognizedStudent] = useState<RecognizedStudent | null>(null)
  const [records] = useState(historyRecords)
  const [stats] = useState(dummyStats)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleStartCamera = useCallback(() => {
    setIsCameraOn(true)
    setStatus('waiting')
    setRecognizedStudent(null)
  }, [])

  const handleStopCamera = useCallback(() => {
    setIsCameraOn(false)
    setStatus('waiting')
    setRecognizedStudent(null)
  }, [])

  const handleCapture = useCallback(() => {
    if (!isCameraOn) return
    setStatus('detecting')

    recognitionSteps.forEach((step, index) => {
      setTimeout(() => {
        setStatus(step)
        if (step === 'detected') {
          setRecognizedStudent(dummyStudent)
        }
        if (step === 'marked') {
          setToastMessage(`Attendance marked for ${dummyStudent.name}`)
          setShowToast(true)
        }
      }, (index + 1) * 1200)
    })
  }, [isCameraOn])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/attendance')}
            className="w-9 h-9 rounded-xl bg-white/70 border border-white/30 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white transition-all"
          >
            <MdArrowBack className="text-lg" />
          </motion.button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Face Recognition Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">
              Capture and recognize student faces for automated attendance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 border border-white/30 shadow-sm text-sm font-medium text-gray-600 hover:bg-white transition-all"
          >
            <MdHome className="text-base" />
            Back to Attendance
          </motion.button>
        </div>
      </motion.div>

      <StatisticsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CameraPreview
            isCameraOn={isCameraOn}
            onStartCamera={handleStartCamera}
            onStopCamera={handleStopCamera}
            onCapture={handleCapture}
            status={status}
          />
          <RecognitionHistory records={records} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RecognitionStatus status={status} />
          <StudentInfoCard student={recognizedStudent} status={status} />
        </div>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
