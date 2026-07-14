export interface TimetableEntry {
  id: string
  time: string
  course: string
  subject: string
  faculty: string
  classroom: string
  batch: string
  department: string
  status: 'ongoing' | 'scheduled' | 'completed' | 'cancelled'
}

export interface TimetableStats {
  todayClasses: number
  thisWeekClasses: number
  monthlyClasses: number
  availableClassrooms: number
  activeFaculty: number
  ongoingClasses: number
}

export interface UpcomingClass {
  id: string
  date: string
  day: string
  time: string
  course: string
  subject: string
  faculty: string
  classroom: string
  batch: string
  department: string
}

export interface Notification {
  id: string
  type: 'holiday' | 'event' | 'change'
  title: string
  description: string
  date: string
}

export interface TimetableActivity {
  id: string
  type: 'updated' | 'added'
  description: string
  timetableName: string
  timestamp: string
  user: string
}

export interface DailySchedule {
  hour: string
  classes: number
}

export interface WeeklyDistribution {
  day: string
  classes: number
}

export interface FacultyWorkload {
  name: string
  hours: number
  classes: number
}

export interface ClassroomUtilization {
  name: string
  usage: number
  capacity: number
  percentage: number
}

export interface FilterState {
  search: string
  department: string
  course: string
}

export interface PageState {
  loading: boolean
  error: string | null
}

export interface Conflict {
  id: string
  type: 'faculty' | 'classroom' | 'batch' | 'time'
  severity: 'high' | 'medium' | 'low'
  description: string
  detail: string
  entry1: string
  entry2: string
  time: string
}

export interface EditableEntry {
  id: string
  time: string
  course: string
  subject: string
  faculty: string
  classroom: string
  batch: string
  department: string
  status: 'ongoing' | 'scheduled' | 'completed' | 'cancelled'
  isEditing?: boolean
}
