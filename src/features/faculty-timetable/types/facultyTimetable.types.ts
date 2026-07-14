export interface FacultyInfo {
  id: string
  photo: string
  name: string
  department: string
  designation: string
  subjects: string[]
  experience: number
}

export interface FacultyScheduleEntry {
  id: string
  time: string
  course: string
  subject: string
  batch: string
  classroom: string
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled'
  day: string
  date: string
}

export interface FacultyStats {
  classesToday: number
  classesThisWeek: number
  studentsAssigned: number
  workingHours: number
}

export type FacultyScheduleView = 'daily' | 'weekly' | 'monthly'
