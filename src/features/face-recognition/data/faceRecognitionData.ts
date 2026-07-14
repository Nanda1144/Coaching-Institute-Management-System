import type { RecognizedStudent, RecognitionRecord, FaceRecognitionStats } from '../types/faceRecognition.types'

export const dummyStudent: RecognizedStudent = {
  id: 'STU001',
  name: 'Rahul Kumar',
  rollNumber: 'CS2022001',
  department: 'Computer Science',
  batch: '2022-2026',
}

export const historyRecords: RecognitionRecord[] = [
  { id: 'R1', studentName: 'Rahul Kumar', time: '09:15 AM', confidence: 96.2, status: 'success' },
  { id: 'R2', studentName: 'Priya Sharma', time: '09:18 AM', confidence: 94.8, status: 'success' },
  { id: 'R3', studentName: 'Amit Singh', time: '09:22 AM', confidence: 72.1, status: 'failed' },
  { id: 'R4', studentName: 'Sneha Patel', time: '09:25 AM', confidence: 97.5, status: 'success' },
  { id: 'R5', studentName: 'Rahul Kumar', time: '09:30 AM', confidence: 95.0, status: 'success' },
  { id: 'R6', studentName: 'Vikram Reddy', time: '09:35 AM', confidence: 68.3, status: 'failed' },
  { id: 'R7', studentName: 'Ananya Gupta', time: '09:40 AM', confidence: 93.1, status: 'success' },
  { id: 'R8', studentName: 'Rohit Verma', time: '09:45 AM', confidence: 91.7, status: 'success' },
  { id: 'R9', studentName: 'Kavita Joshi', time: '09:50 AM', confidence: 98.2, status: 'success' },
  { id: 'R10', studentName: 'Neha Kapoor', time: '09:55 AM', confidence: 88.9, status: 'success' },
]

export const dummyStats: FaceRecognitionStats = {
  facesDetected: 145,
  attendanceMarked: 138,
  accuracy: 95.2,
}

export const confidenceColor = (value: number): string => {
  if (value >= 90) return '#10b981'
  if (value >= 75) return '#f59e0b'
  return '#ef4444'
}

export const confidenceBg = (value: number): string => {
  if (value >= 90) return '#d1fae5'
  if (value >= 75) return '#fef3c7'
  return '#fee2e2'
}
