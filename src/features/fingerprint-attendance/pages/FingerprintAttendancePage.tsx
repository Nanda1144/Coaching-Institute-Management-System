import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdFingerprint } from 'react-icons/md'
import FingerprintScanner from '../components/FingerprintScanner'
import StudentDetailsCard from '../components/StudentDetailsCard'
import AttendanceLogTable from '../components/AttendanceLogTable'
import StatisticsCards from '../components/StatisticsCards'
import FingerprintActions from '../components/FingerprintActions'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { FingerprintStatus, StudentInfo, AttendanceLogEntry, FingerprintStats } from '../types/fingerprint.types'

export default function FingerprintAttendancePage() {
  const [status, setStatus] = useState<FingerprintStatus>('waiting')
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [stats, setStats] = useState<FingerprintStats>({ successfulScans: 0, failedAttempts: 0, totalAttendance: 0 })
  const [log, setLog] = useState<AttendanceLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, logRes] = await Promise.all([
          attendanceService.getAttendanceStats({ type: 'fingerprint' }),
          attendanceService.getAll({ type: 'fingerprint', limit: 12 }),
        ])
        const s = statsRes?.data || statsRes || {}
        setStats({
          successfulScans: s.successfulScans || s.successful || 0,
          failedAttempts: s.failedAttempts || s.failed || 0,
          totalAttendance: s.totalAttendance || s.total || 0,
        })
        const logRaw = logRes?.data ?? []
        const entries = Array.isArray(logRaw) ? logRaw : (logRaw?.data ?? [])
        setLog(Array.isArray(entries) ? entries : [])
      } catch {
        setToastMessage('Failed to load fingerprint data')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleScan = useCallback(async () => {
    setStatus('scanning')
    try {
      const result = await attendanceService.markFingerprint({ timestamp: new Date().toISOString() })
      if (result?.status === 'success' || result?.verified) {
        setStatus('verified')
        const studentData = result?.student || result?.data || {}
        const info: StudentInfo = {
          id: studentData.id || studentData.studentId || '',
          name: studentData.name || studentData.studentName || 'Unknown',
          rollNumber: studentData.rollNumber || '',
          department: studentData.department || '',
          batch: studentData.batch || '',
        }
        setStudent(info)
        setToastMessage(`Attendance marked for ${info.name}`)
        setShowToast(true)
      } else {
        setStatus('failed')
        setStudent(null)
        setToastMessage('Fingerprint did not match. Please try again.')
        setShowToast(true)
      }
    } catch {
      setStatus('failed')
      setStudent(null)
      setToastMessage('Fingerprint scan failed. Please try again.')
      setShowToast(true)
    }
  }, [])

  const handleRetry = useCallback(() => {
    setStatus('waiting')
    setStudent(null)
  }, [])

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

      <StatisticsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FingerprintScanner
            status={status}
            onScan={handleScan}
            onRetry={handleRetry}
          />
          <AttendanceLogTable entries={log} />
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
