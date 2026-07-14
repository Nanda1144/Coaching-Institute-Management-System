export type EventType = 'lecture' | 'lab' | 'seminar' | 'exam' | 'event' | 'holiday'

export type CalendarView = 'daily' | 'weekly' | 'monthly'

export interface CalendarEvent {
  id: string
  title: string
  subject: string
  faculty: string
  classroom: string
  building: string
  startTime: string
  endTime: string
  date: string
  batch: string
  course: string
  department: string
  type: EventType
  description: string
}

export interface CalendarFilters {
  search: string
  departments: string[]
  faculties: string[]
  courses: string[]
  batches: string[]
  classrooms: string[]
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface EventTypeConfig {
  label: string
  color: string
  bg: string
  border: string
}

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  lecture: { label: 'Lecture', color: '#3b82f6', bg: '#dbeafe', border: '#93c5fd' },
  lab: { label: 'Lab', color: '#10b981', bg: '#d1fae5', border: '#6ee7b7' },
  seminar: { label: 'Seminar', color: '#8b5cf6', bg: '#ede9fe', border: '#c4b5fd' },
  exam: { label: 'Exam', color: '#f59e0b', bg: '#fef3c7', border: '#fcd34d' },
  event: { label: 'Event', color: '#ec4899', bg: '#fce7f3', border: '#f9a8d4' },
  holiday: { label: 'Holiday', color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' },
}
