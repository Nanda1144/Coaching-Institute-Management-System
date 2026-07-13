export interface FacultyProfile {
  id: string
  photo: string
  name: string
  designation: string
  department: string
  experience: number
  email: string
  phone: string
  address: string
  dob: string
  gender: string
  qualification: string
  specialization: string
  joiningDate: string
  employmentType: string
  branch: string
  status: string
}

export interface AssignedCourse {
  id: string
  course: string
  subject: string
  semester: number
  branch: string
}

export interface AssignedBatch {
  id: string
  batchName: string
  students: number
  year: number
}

export interface TimeSlot {
  time: string
  subject: string
  room: string
}

export interface DaySchedule {
  day: string
  slots: TimeSlot[]
}

export interface AttendanceSummary {
  present: number
  absent: number
  leave: number
  total: number
}

export interface PerformanceData {
  subjectsHandled: number
  students: number
  feedbackRating: number
}

export interface Document {
  id: string
  name: string
  type: string
  date: string
}
