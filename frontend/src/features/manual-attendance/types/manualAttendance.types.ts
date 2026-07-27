export interface StudentAttendance {
  id: string
  rollNumber: string
  studentName: string
  photoUrl: string
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave' | null
  remarks: string
}

export interface ManualAttendanceForm {
  [key: string]: string
  department: string
  course: string
  semester: string
  batch: string
  section: string
  subject: string
  faculty: string
  date: string
  time: string
}

export interface DropdownOption {
  value: string
  label: string
}

export type Errors = Record<string, string>
