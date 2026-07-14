import type { QRCodeData, AttendanceRecord } from '../types/qrAttendance.types'

export const dummyQRData: QRCodeData = {
  id: 'QR-2026-07-14-001',
  course: 'B.Tech Computer Science',
  faculty: 'Dr. Rajesh Kumar',
  subject: 'Data Structures & Algorithms',
  batch: 'CS-2024',
  section: 'A',
  generatedAt: '2026-07-14T09:00:00',
  expiresAt: '2026-07-14T09:15:00',
}

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'A1', studentName: 'Arun Sharma', time: '09:02 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A2', studentName: 'Priya Mehta', time: '09:04 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A3', studentName: 'Rohit Verma', time: '09:07 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A4', studentName: 'Sneha Kapoor', time: '09:11 AM', qrStatus: 'expired', attendanceStatus: 'absent' },
  { id: 'A5', studentName: 'Amit Singh', time: '09:03 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A6', studentName: 'Kavita Joshi', time: '09:06 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A7', studentName: 'Vikram Reddy', time: '09:09 AM', qrStatus: 'invalid', attendanceStatus: 'absent' },
  { id: 'A8', studentName: 'Neha Gupta', time: '09:01 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A9', studentName: 'Rahul Kumar', time: '09:05 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A10', studentName: 'Ananya Patel', time: '09:08 AM', qrStatus: 'valid', attendanceStatus: 'present' },
  { id: 'A11', studentName: 'Deepak Yadav', time: '09:12 AM', qrStatus: 'expired', attendanceStatus: 'absent' },
  { id: 'A12', studentName: 'Pooja Sharma', time: '09:10 AM', qrStatus: 'valid', attendanceStatus: 'present' },
]

export const courseOptions = [
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'B.Tech Electronics & Communication',
  'MCA',
  'M.Tech Computer Science',
]

export const facultyOptions = [
  'Dr. Rajesh Kumar',
  'Prof. Sunita Verma',
  'Dr. Anand Gupta',
  'Prof. Meena Joshi',
  'Dr. Vikram Singh',
]

export const subjectOptions = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Computer Networks',
  'Operating Systems',
  'Software Engineering',
  'Machine Learning',
]

export const batchOptions = ['CS-2024', 'CS-2025', 'CS-2026', 'IT-2024', 'IT-2025']
export const sectionOptions = ['A', 'B', 'C']
