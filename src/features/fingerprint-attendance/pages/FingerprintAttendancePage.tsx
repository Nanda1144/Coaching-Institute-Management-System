import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdFingerprint } from 'react-icons/md'
import FingerprintScanner from '../components/FingerprintScanner'
import StudentDetailsCard from '../components/StudentDetailsCard'
import AttendanceLogTable from '../components/AttendanceLogTable'
import StatisticsCards from '../components/StatisticsCards'
import FingerprintActions from '../components/FingerprintActions'
import Toast from '../../../components/Toast'
import { dummyStudent, attendanceLog, fingerprintStats } from '../data/fingerprintData'
import type { FingerprintStatus, StudentInfo } from '../types/fingerprint.types'

export default function FingerprintAttendancePage() {
  const [status, setStatus] = useState<FingerprintStatus>('waiting')
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const simulateScan = useCallback(() => {
    setStatus('scanning')
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        setStatus('verified')
        setStudent(dummyStudent)
        setToastMessage(`Attendance marked for ${dummyStudent.name}`)
        setShowToast(true)
      } else {
        setStatus('failed')
        setStudent(null)
        setToastMessage('Fingerprint did not match. Please try again.')
        setShowToast(true)
      }
    }, 2500)
  }, [])

  const handleRetry = useCallback(() => {
    setStatus('waiting')
    setStudent(null)
  }, [])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fingerprint Attendance</h2>
          <p className="text-sm text-gray-500 mt-1">
            Scan student fingerprints for fast and secure attendance marking.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdFingerprint className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </motion.div>

      <StatisticsCards stats={fingerprintStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FingerprintScanner
            status={status}
            onScan={simulateScan}
            onRetry={handleRetry}
          />
          <AttendanceLogTable entries={attendanceLog} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <StudentDetailsCard student={student} status={status} />
          <FingerprintActions onRetry={handleRetry} />
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
