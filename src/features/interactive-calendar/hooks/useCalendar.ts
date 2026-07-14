import { useState, useMemo, useCallback } from 'react'
import type { CalendarEvent, CalendarView, CalendarFilters } from '../types/calendar.types'

export function useCalendar(events: CalendarEvent[]) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 14))
  const [view, setView] = useState<CalendarView>('monthly')
  const [filters, setFilters] = useState<CalendarFilters>({
    search: '', departments: [], faculties: [], courses: [], batches: [], classrooms: [],
  })
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const navigate = useCallback((direction: 'prev' | 'next' | 'today') => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      if (direction === 'today') return new Date()
      const delta = direction === 'prev' ? -1 : 1
      if (view === 'daily') d.setDate(d.getDate() + delta)
      else if (view === 'weekly') d.setDate(d.getDate() + delta * 7)
      else d.setMonth(d.getMonth() + delta)
      return d
    })
  }, [view])

  const toggleFilter = useCallback((key: keyof CalendarFilters, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[]
      const next = { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
      return next
    })
  }, [])

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const filteredEvents = useMemo(() => {
    let result = [...events]
    const q = filters.search.toLowerCase()
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.faculty.toLowerCase().includes(q) ||
          e.course.toLowerCase().includes(q) ||
          e.batch.toLowerCase().includes(q) ||
          e.classroom.toLowerCase().includes(q)
      )
    }
    if (filters.departments.length > 0) {
      result = result.filter((e) => filters.departments.includes(e.department))
    }
    if (filters.faculties.length > 0) {
      result = result.filter((e) => filters.faculties.includes(e.faculty))
    }
    if (filters.courses.length > 0) {
      result = result.filter((e) => filters.courses.includes(e.course))
    }
    if (filters.batches.length > 0) {
      result = result.filter((e) => filters.batches.includes(e.batch))
    }
    if (filters.classrooms.length > 0) {
      result = result.filter((e) => filters.classrooms.includes(e.classroom))
    }
    return result
  }, [events, filters])

  const weekDays = useMemo(() => {
    const start = new Date(currentDate)
    const day = start.getDay()
    start.setDate(start.getDate() - day + (day === 0 ? -6 : 1))
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [currentDate])

  const monthDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const total = startPad + lastDay.getDate() + (7 - ((startPad + lastDay.getDate()) % 7 || 7))
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []
    for (let i = 0; i < total; i++) {
      const d = new Date(year, month, 1 + i - startPad)
      days.push({ date: d, isCurrentMonth: d.getMonth() === month })
    }
    return days
  }, [year, month])

  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      return filteredEvents.filter((e) => e.date === ds)
    },
    [filteredEvents]
  )

  const handleDragStart = useCallback((id: string) => {
    setDraggedEventId(id)
  }, [])

  const handleDrop = useCallback((_targetDate: string) => {
    setDraggedEventId(null)
  }, [])

  const headerLabel = useMemo(() => {
    const opts: Intl.DateTimeFormatOptions =
      view === 'daily'
        ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        : view === 'weekly'
          ? { month: 'long', year: 'numeric' }
          : { month: 'long', year: 'numeric' }
    return currentDate.toLocaleDateString('en-US', opts)
  }, [currentDate, view])

  return {
    currentDate, setCurrentDate,
    view, setView,
    filters, setSearch, toggleFilter,
    filteredEvents,
    weekDays, monthDays,
    getEventsForDate,
    navigate,
    headerLabel,
    draggedEventId,
    handleDragStart, handleDrop,
  }
}
