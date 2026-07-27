export interface CreateTimetableFormData {
  academicYear: string
  semester: string
  department: string
  course: string
  batch: string
  section: string
  subject: string
  faculty: string
  classroom: string
  building: string
  floor: string
  day: string
  startTime: string
  endTime: string
  duration: string
  remarks: string
  status: string
  recurringClass: string
}

export interface DropdownOption {
  value: string
  label: string
}
