import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MdQrCode } from 'react-icons/md'
import QRGenerator from '../components/QRGenerator'
import QRScanner from '../components/QRScanner'
import AttendanceHistoryTable from '../components/AttendanceHistoryTable'
import QRActions from '../components/QRActions'
import Toast from '../../../components/Toast'
import {
  dummyQRData,
  attendanceRecords,
} from '../data/qrAttendanceData'
import type { QRCodeData, QRStatus, AttendanceRecord } from '../types/qrAttendance.types'

const QR_DURATION = 900

export default function QRAttendancePage() {
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [qrStatus, setQrStatus] = useState<QRStatus>('valid')
  const [isScannerOn, setIsScannerOn] = useState(false)
  const [scanStatus, setScanStatus] = useState<QRStatus>('valid')
  const [secondsLeft, setSecondsLeft] = useState(QR_DURATION)
  const [records] = useState<AttendanceRecord[]>(attendanceRecords)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleGenerate = useCallback(() => {
    clearTimer()
    const newData: QRCodeData = {
      ...dummyQRData,
      id: `QR-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + QR_DURATION * 1000).toISOString(),
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
  }, [clearTimer])

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
      await new Promise((r) => setTimeout(r, 3000))
      if (qrStatus === 'expired') {
        setScanStatus('expired')
        setToastMessage('Scanned QR code has expired')
        setShowToast(true)
        return
      }
      setScanStatus('valid')
      await new Promise((r) => setTimeout(r, 1000))
      setScanStatus('attendance_success')
      setToastMessage('Attendance marked successfully via QR scan')
      setShowToast(true)
    }

    scanSequence()
  }, [isScannerOn, qrStatus])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return (
    <div className="space-y-6">
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
