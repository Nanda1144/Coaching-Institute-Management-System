export interface AttendanceStats {
  totalStudents: number
  presentToday: number
  absentToday: number
  lateArrivals: number
  leaveRequests: number
  attendancePercentage: number
}

export interface AttendanceRecord {
  id: string
  studentName: string
  rollNumber: string
  department: string
  status: 'present' | 'absent' | 'late' | 'leave'
  time: string
  method: string
  date: string
}

export interface DailyAttendance {
  date: string
  present: number
  absent: number
  late: number
  leave: number
}

export interface WeeklyTrend {
  day: string
  percentage: number
  total: number
  present: number
}

export interface DepartmentAttendance {
  department: string
  present: number
  total: number
  percentage: number
}

export interface MonthlySummary {
  month: string
  percentage: number
  students: number
}

export interface AttendanceNotification {
  id: string
  type: 'low-attendance' | 'correction-request' | 'leave-request'
  title: string
  description: string
  studentName: string
  rollNumber: string
  severity: 'high' | 'medium' | 'low'
}

export interface AttendanceFilterState {
  search: string
  department: string
  date: string
}

export interface PageState {
  loading: boolean
  error: string | null
}
