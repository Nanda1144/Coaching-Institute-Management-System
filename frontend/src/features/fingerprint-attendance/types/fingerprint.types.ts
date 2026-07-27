export type FingerprintStatus = 'waiting' | 'scanning' | 'verified' | 'failed'

export interface StudentInfo {
  id: string
  name: string
  rollNumber: string
  department: string
  batch: string
}

export interface AttendanceLogEntry {
  id: string
  studentName: string
  time: string
  status: 'present' | 'absent' | 'late'
  verificationResult: 'matched' | 'failed'
}

export interface FingerprintStats {
  successfulScans: number
  failedAttempts: number
  totalAttendance: number
}
