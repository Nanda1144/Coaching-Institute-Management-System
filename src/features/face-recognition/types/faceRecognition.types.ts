export type RecognitionStatusType = 'waiting' | 'detecting' | 'detected' | 'marked' | 'failed'

export interface RecognizedStudent {
  id: string
  name: string
  rollNumber: string
  department: string
  batch: string
  photoUrl?: string
}

export interface RecognitionRecord {
  id: string
  studentName: string
  time: string
  confidence: number
  status: 'success' | 'failed'
}

export interface FaceRecognitionStats {
  facesDetected: number
  attendanceMarked: number
  accuracy: number
}
