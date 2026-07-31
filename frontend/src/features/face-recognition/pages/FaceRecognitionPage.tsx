import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdArrowBack, MdHome, MdPersonAdd } from 'react-icons/md'
import CameraPreview from '../components/CameraPreview'
import RecognitionStatus from '../components/RecognitionStatus'
import StudentInfoCard from '../components/StudentInfoCard'
import RecognitionHistory from '../components/RecognitionHistory'
import StatisticsCards from '../components/StatisticsCards'
import StudentSearchModal from '../components/StudentSearchModal'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { RecognitionStatusType, RecognizedStudent, RecognitionRecord, FaceRecognitionStats } from '../types/faceRecognition.types'

export default function FaceRecognitionPage() {
  const navigate = useNavigate()
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [status, setStatus] = useState<RecognitionStatusType>('waiting')
  const [recognizedStudent, setRecognizedStudent] = useState<RecognizedStudent | null>(null)
  const [records, setRecords] = useState<RecognitionRecord[]>([])
  const [stats, setStats] = useState<FaceRecognitionStats>({ facesDetected: 0, attendanceMarked: 0, accuracy: 0 })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showStudentSearch, setShowStudentSearch] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [autoMode, setAutoMode] = useState(true)
  const statsRef = useRef(stats)
  statsRef.current = stats

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        attendanceService.getAttendanceStats({ method: 'face_recognition' }),
        attendanceService.getFaceRecognitionHistory({ limit: 10 }),
      ])
      const s = statsRes?.data || statsRes || {}
      setStats({
        facesDetected: s.total || 0,
        attendanceMarked: s.present || 0,
        accuracy: s.percentage || 0,
      })
      const historyRaw = historyRes?.data ?? historyRes ?? []
      const history = Array.isArray(historyRaw) ? historyRaw : (historyRaw?.data ?? [])
      setRecords(Array.isArray(history) ? history : [])
    } catch {
      // silent fail on background refresh
    }
  }, [])

  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true)
        await fetchData()
      } catch {
        setToastMessage('Failed to load face recognition data')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    initialFetch()
  }, [fetchData])

  const handleStartCamera = useCallback(() => {
    setIsCameraOn(true)
    setStatus('waiting')
    setRecognizedStudent(null)
    setCapturedImage(null)
  }, [])

  const handleStopCamera = useCallback(() => {
    setIsCameraOn(false)
    setStatus('waiting')
    setRecognizedStudent(null)
    setCapturedImage(null)
  }, [])

  const handleCapture = useCallback((imageData: string) => {
    setCapturedImage(imageData)
    if (autoMode) {
      handleAutoScan(imageData)
    } else {
      setShowStudentSearch(true)
    }
  }, [autoMode])

  const handleAutoScan = async (imageData: string) => {
    setStatus('detecting')
    try {
      const res = await attendanceService.scanFaceAndMarkAttendance({
        faceImage: imageData,
        confidence: 0.85,
      })
      const d = res?.data ?? res
      const student = d?.student ?? d
      setStatus('detected')
      const recognized: RecognizedStudent = {
        id: student?.id || '',
        name: student?.fullName || 'Unknown',
        rollNumber: student?.rollNumber || '',
        department: student?.department || '',
        batch: student?.batch || '',
      }
      setRecognizedStudent(recognized)
      setStatus('marked')
      setToastMessage(`Attendance marked for ${recognized.name}`)
      setShowToast(true)

      const prev = statsRef.current
      setStats({
        facesDetected: prev.facesDetected + 1,
        attendanceMarked: prev.attendanceMarked + 1,
        accuracy: prev.attendanceMarked > 0
          ? Math.round(((prev.attendanceMarked + 1) / (prev.facesDetected + 1)) * 100)
          : 100,
      })
      setRecords(prev => [
        {
          id: `rec-${Date.now()}`,
          studentName: recognized.name,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          confidence: Math.round((d?.similarity || 0.95) * 100),
          status: 'success',
        },
        ...prev,
      ])
      setTimeout(() => fetchData(), 2000)
      setTimeout(() => {
        setIsCameraOn(false)
        setStatus('waiting')
        setRecognizedStudent(null)
        setCapturedImage(null)
      }, 4000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || ''
      if (msg.includes('No matching face found')) {
        setShowStudentSearch(true)
        setStatus('waiting')
        setToastMessage('Face not recognized. Please search and select the student to enroll.')
        setShowToast(true)
      } else if (msg.includes('already marked')) {
        setStatus('marked')
        setToastMessage('Attendance already marked today for this student.')
        setShowToast(true)
        setTimeout(() => {
          setIsCameraOn(false)
          setStatus('waiting')
          setRecognizedStudent(null)
          setCapturedImage(null)
        }, 2000)
      } else {
        setStatus('waiting')
        setToastMessage(msg || 'Face recognition failed. Please try again.')
        setShowToast(true)
      }
    }
  }

  const handleStudentSelect = useCallback(async (student: { id: string; fullName: string; rollNumber: string; department: string; batch: string }) => {
    setShowStudentSearch(false)
    setStatus('detecting')
    try {
      if (capturedImage) {
        await attendanceService.enrollStudentFace({
          studentId: student.id,
          faceImage: capturedImage,
          metadata: { name: student.fullName, rollNumber: student.rollNumber },
        })
      }
      const sessionRes = await attendanceService.createFaceRecognition({
        studentId: student.id,
        confidence: 0.95,
        imageUrl: capturedImage || undefined,
      })
      const sessionData = sessionRes?.data ?? sessionRes
      const sid = sessionData?.sessionId || sessionData?.id || `session-${Date.now()}`
      setStatus('detected')
      const recognized: RecognizedStudent = {
        id: student.id,
        name: student.fullName,
        rollNumber: student.rollNumber,
        department: student.department,
        batch: student.batch,
      }
      setRecognizedStudent(recognized)

      try {
        await attendanceService.verifyFaceRecognition(sid, {
          studentId: student.id,
          confidence: 0.95,
        })
      } catch {
        // verify is optional; attendance may already be created
      }

      // Create attendance record manually for enrollment flow
      try {
        const now = new Date().toISOString()
        await attendanceService.create({
          studentId: student.id,
          attendanceDate: now,
          startTime: now,
          endTime: now,
          attendanceMethod: 'face_recognition',
          attendanceStatus: 'present',
        })
      } catch {
        // may already exist
      }

      setStatus('marked')
      setToastMessage(`Attendance marked for ${student.fullName}`)
      setShowToast(true)

      const prev = statsRef.current
      setStats({
        facesDetected: prev.facesDetected + 1,
        attendanceMarked: prev.attendanceMarked + 1,
        accuracy: prev.attendanceMarked > 0
          ? Math.round(((prev.attendanceMarked + 1) / (prev.facesDetected + 1)) * 100)
          : 100,
      })
      setRecords(prev => [
        {
          id: `rec-${Date.now()}`,
          studentName: student.fullName,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          confidence: 95,
          status: 'success',
        },
        ...prev,
      ])
      setTimeout(() => fetchData(), 2000)
      setTimeout(() => {
        setIsCameraOn(false)
        setStatus('waiting')
        setRecognizedStudent(null)
        setCapturedImage(null)
      }, 4000)
    } catch {
      setStatus('waiting')
      setToastMessage('Failed to process face enrollment. Please try again.')
      setShowToast(true)
    }
  }, [fetchData, capturedImage])

  if (loading) {
    return (
      <div className="space-y-6">
        <AttendanceNavBar />
        <div className="h-8 w-64 bg-gray-100/60 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-100/40 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AttendanceNavBar />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/attendance')}
            className="w-9 h-9 rounded-xl bg-white/70 border border-white/30 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white transition-all"
          >
            <MdArrowBack className="text-lg" />
          </motion.button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Face Recognition Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">
              {autoMode ? 'Auto-detect mode: capture face to mark attendance' : 'Manual mode: capture then select student'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAutoMode(!autoMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm text-sm font-medium transition-all ${
              autoMode
                ? 'bg-primary text-white border-primary'
                : 'bg-white/70 text-gray-600 border-white/30 hover:bg-white'
            }`}
          >
            <MdPersonAdd className="text-base" />
            {autoMode ? 'Auto Mode' : 'Manual Mode'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard/attendance')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 border border-white/30 shadow-sm text-sm font-medium text-gray-600 hover:bg-white transition-all"
          >
            <MdHome className="text-base" />
            Back
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
            capturedImage={capturedImage}
          />
          <StudentSearchModal
            isOpen={showStudentSearch}
            onClose={() => { setShowStudentSearch(false); setCapturedImage(null) }}
            onSelect={handleStudentSelect}
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
