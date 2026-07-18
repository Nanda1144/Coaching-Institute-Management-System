import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MdQrCode } from 'react-icons/md'
import QRGenerator from '../components/QRGenerator'
import QRScanner from '../components/QRScanner'
import AttendanceHistoryTable from '../components/AttendanceHistoryTable'
import QRActions from '../components/QRActions'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { QRCodeData, QRStatus, AttendanceRecord } from '../types/qrAttendance.types'

const QR_DURATION = 900

export default function QRAttendancePage() {
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [qrStatus, setQrStatus] = useState<QRStatus>('valid')
  const [isScannerOn, setIsScannerOn] = useState(false)
  const [scanStatus, setScanStatus] = useState<QRStatus>('valid')
  const [secondsLeft, setSecondsLeft] = useState(QR_DURATION)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true)
        const res = await attendanceService.getAll({ type: 'qr', limit: 12 })
        const rawData = res?.data ?? []
        const recs = Array.isArray(rawData) ? rawData : (rawData?.data ?? [])
        setRecords(Array.isArray(recs) ? recs : [])
      } catch {
        setToastMessage('Failed to load QR attendance records')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleGenerate = useCallback(async () => {
    clearTimer()
    try {
      const session = await attendanceService.createQRSession({
        course: '',
        faculty: '',
        subject: '',
        batch: '',
        section: '',
        duration: QR_DURATION,
      })
      const sessionData = session?.data || session || {}
      const newData: QRCodeData = {
        id: sessionData.id || `QR-${Date.now()}`,
        course: sessionData.course || '',
        faculty: sessionData.faculty || '',
        subject: sessionData.subject || '',
        batch: sessionData.batch || '',
        section: sessionData.section || '',
        generatedAt: sessionData.generatedAt || new Date().toISOString(),
        expiresAt: sessionData.expiresAt || new Date(Date.now() + QR_DURATION * 1000).toISOString(),
      }
      setQrData(newData)
      setQrStatus('valid')
      setSecondsLeft(QR_DURATION)
      setToastMessage('QR code generated successfully')
      setShowToast(true)

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            setQrStatus('expired')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      setToastMessage('Failed to generate QR code')
      setShowToast(true)
    }
  }, [])

  const handleRefresh = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  const handleStartScanner = useCallback(() => {
    setIsScannerOn(true)
    setScanStatus('valid')
  }, [])

  const handleStopScanner = useCallback(() => {
    setIsScannerOn(false)
    setScanStatus('valid')
  }, [])

  useEffect(() => {
    if (!isScannerOn) return

    const scanSequence = async () => {
      try {
        const result = await attendanceService.scanQR({ timestamp: new Date().toISOString() })
        if (result?.status === 'expired' || qrStatus === 'expired') {
          setScanStatus('expired')
          setToastMessage('Scanned QR code has expired')
          setShowToast(true)
          return
        }
        if (result?.status === 'success' || result?.attendanceMarked) {
          setScanStatus('attendance_success')
          setToastMessage('Attendance marked successfully via QR scan')
          setShowToast(true)
        } else {
          setScanStatus('valid')
          setToastMessage('QR scan processed')
          setShowToast(true)
        }
      } catch {
        setScanStatus('expired')
        setToastMessage('QR scan failed')
        setShowToast(true)
      }
    }

    scanSequence()
  }, [isScannerOn, qrStatus])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

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
          <h2 className="text-2xl font-bold text-gray-800">QR Attendance</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate and scan QR codes for contactless attendance marking.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdQrCode className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QRGenerator
            qrData={qrData}
            qrStatus={qrStatus}
            secondsLeft={secondsLeft}
            onGenerate={handleGenerate}
            onRefresh={handleRefresh}
          />
          <QRScanner
            isScannerOn={isScannerOn}
            scanStatus={scanStatus}
            onStart={handleStartScanner}
            onStop={handleStopScanner}
          />
          <AttendanceHistoryTable records={records} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <QRActions
            isScannerOn={isScannerOn}
            hasQR={qrData !== null}
            onGenerate={handleGenerate}
            onRefresh={handleRefresh}
            onStartScanner={handleStartScanner}
            onStopScanner={handleStopScanner}
          />
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
