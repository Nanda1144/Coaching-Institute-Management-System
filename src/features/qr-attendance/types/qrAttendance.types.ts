export type QRStatus = 'valid' | 'invalid' | 'expired' | 'attendance_success'

export interface QRCodeData {
  id: string
  course: string
  faculty: string
  subject: string
  batch: string
  section: string
  generatedAt: string
  expiresAt: string
}

export interface AttendanceRecord {
  id: string
  studentName: string
  time: string
  qrStatus: QRStatus
  attendanceStatus: 'present' | 'absent'
}

export interface QRFormData {
  course: string
  faculty: string
  subject: string
  batch: string
  section: string
}
