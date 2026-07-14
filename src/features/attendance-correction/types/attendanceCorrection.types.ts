export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave'

export interface CorrectionRequest {
  id: string
  studentName: string
  rollNumber: string
  department: string
  subject: string
  attendanceDate: string
  currentStatus: AttendanceStatus
  requestedStatus: AttendanceStatus
  reason: string
  attachment: string | null
  approvalStatus: ApprovalStatus
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
  remarks?: string
}

export interface RequestFormData {
  studentName: string
  rollNumber: string
  department: string
  subject: string
  attendanceDate: string
  currentStatus: AttendanceStatus
  requestedStatus: AttendanceStatus
  reason: string
  attachment: string | null
}

export interface CorrectionFilters {
  search: string
  department: string
  status: string
  date: string
}
