export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave'
export type AttendanceMethod = 'manual' | 'face' | 'fingerprint' | 'qr'
export type SortField = 'date' | 'studentName' | 'rollNumber' | 'department' | 'status' | 'time' | 'method' | 'faculty'
export type SortDirection = 'asc' | 'desc'

export interface HistoryRecord {
  id: string
  date: string
  studentName: string
  rollNumber: string
  department: string
  course: string
  batch: string
  subject: string
  status: AttendanceStatus
  method: AttendanceMethod
  faculty: string
  time: string
}

export interface HistoryFilters {
  search: string
  department: string
  course: string
  batch: string
  status: string
  method: string
  dateFrom: string
  dateTo: string
}

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface HistoryStats {
  total: number
  present: number
  absent: number
  late: number
  leave: number
}
