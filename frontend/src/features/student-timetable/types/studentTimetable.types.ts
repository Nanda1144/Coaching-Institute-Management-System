export interface StudentInfo {
  photo: string
  name: string
  rollNumber: string
  department: string
  course: string
  batch: string
  semester: number
}

export interface ScheduleEntry {
  id: string
  time: string
  subject: string
  faculty: string
  classroom: string
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled'
  attendance: 'Present' | 'Absent' | 'Not Marked'
  day: string
  date: string
  month: string
}

export interface QuickStats {
  classesToday: number
  attendancePercentage: number
  upcomingExams: number
  assignments: number
}

export type ScheduleView = 'daily' | 'weekly' | 'monthly'
