export interface Batch {
  id: string
  name: string
  course: string
  faculty: string
  schedule: string
  classroom: string
  students: number
  status: string
  batchCode?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  days?: string[]
  maxStudents?: number
  department?: string
  year?: string
  studentCount?: number
  facultyCount?: number
}

export interface BatchFormData {
  batchName: string
  batchCode: string
  course: string
  faculty: string
  classroom: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  days: string[]
  maxStudents: string
  status: string
}

export interface BatchFilters {
  search: string
  course: string
  faculty: string
  status: string
  schedule: string
}

export type ViewMode = 'card' | 'table'
