import type { StudentInfo, AttendanceLogEntry, FingerprintStats } from '../types/fingerprint.types'

export const dummyStudent: StudentInfo = {
  id: 'STU045',
  name: 'Arun Sharma',
  rollNumber: 'CS2022045',
  department: 'Computer Science',
  batch: '2022-2026',
}

export const attendanceLog: AttendanceLogEntry[] = [
  { id: 'L1', studentName: 'Arun Sharma', time: '09:15 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L2', studentName: 'Priya Mehta', time: '09:18 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L3', studentName: 'Rohit Verma', time: '09:22 AM', status: 'absent', verificationResult: 'failed' },
  { id: 'L4', studentName: 'Sneha Kapoor', time: '09:25 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L5', studentName: 'Amit Singh', time: '09:30 AM', status: 'late', verificationResult: 'matched' },
  { id: 'L6', studentName: 'Kavita Joshi', time: '09:33 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L7', studentName: 'Vikram Reddy', time: '09:38 AM', status: 'absent', verificationResult: 'failed' },
  { id: 'L8', studentName: 'Neha Gupta', time: '09:42 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L9', studentName: 'Rahul Kumar', time: '09:47 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L10', studentName: 'Ananya Patel', time: '09:52 AM', status: 'late', verificationResult: 'matched' },
  { id: 'L11', studentName: 'Deepak Yadav', time: '09:55 AM', status: 'present', verificationResult: 'matched' },
  { id: 'L12', studentName: 'Pooja Sharma', time: '10:00 AM', status: 'absent', verificationResult: 'failed' },
]

export const fingerprintStats: FingerprintStats = {
  successfulScans: 128,
  failedAttempts: 17,
  totalAttendance: 145,
}
