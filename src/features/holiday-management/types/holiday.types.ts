export type HolidayType = 'national' | 'festival' | 'academic' | 'event'
export type HolidayStatus = 'upcoming' | 'ongoing' | 'completed'

export interface Holiday {
  id: string
  name: string
  date: string
  day: string
  type: HolidayType
  department: string
  status: HolidayStatus
  description: string
}

export interface SpecialEvent {
  id: string
  name: string
  date: string
  day: string
  category: 'college_event' | 'workshop' | 'seminar' | 'exam' | 'festival'
  description: string
}

export interface HolidayStats {
  totalHolidays: number
  upcomingHolidays: number
  specialEvents: number
  workingDays: number
}

export interface HolidayFilters {
  search: string
  department: string
  month: string
  type: string
}

export const HOLIDAY_TYPE_CONFIG: Record<HolidayType, { label: string; color: string; bg: string }> = {
  national: { label: 'National', color: '#3b82f6', bg: '#dbeafe' },
  festival: { label: 'Festival', color: '#f59e0b', bg: '#fef3c7' },
  academic: { label: 'Academic', color: '#10b981', bg: '#d1fae5' },
  event: { label: 'Event', color: '#8b5cf6', bg: '#ede9fe' },
}

export const SPECIAL_EVENT_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  college_event: { label: 'College Events', color: '#ec4899', bg: '#fce7f3', icon: '🎉' },
  workshop: { label: 'Workshops', color: '#14b8a6', bg: '#ccfbf1', icon: '🔧' },
  seminar: { label: 'Seminars', color: '#8b5cf6', bg: '#ede9fe', icon: '🎤' },
  exam: { label: 'Exams', color: '#ef4444', bg: '#fee2e2', icon: '📝' },
  festival: { label: 'Festival Holidays', color: '#f59e0b', bg: '#fef3c7', icon: '🎊' },
}
