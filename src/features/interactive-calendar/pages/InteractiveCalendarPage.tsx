import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarMonth } from 'react-icons/md'
import Toast from '../../../components/Toast'
import { useCalendar } from '../hooks/useCalendar'

import CalendarHeader from '../components/CalendarHeader'
import CalendarSidebar from '../components/CalendarSidebar'
import DailyView from '../components/DailyView'
import WeeklyView from '../components/WeeklyView'
import MonthlyView from '../components/MonthlyView'
import CalendarSkeleton from '../components/CalendarSkeleton'
import timetableService from '../../../services/timetable/timetable.service'
import type { CalendarEvent, EventType } from '../types/calendar.types'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`
}

function mapToCalendarEvents(apiData: Record<string, unknown>[]): CalendarEvent[] {
  if (!Array.isArray(apiData)) return []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  return apiData.map((item: Record<string, unknown>, index: number) => {
    const day = typeof item.day === 'number' ? item.day : ((item.dayOfWeek as number) || ((index % 28) + 1))
    return {
      id: String(item.id || `CE-${String(index + 1).padStart(3, '0')}`),
      title: String(item.title || item.subject || ''),
      subject: String(item.subject || ''),
      faculty: String(item.faculty || ''),
      classroom: String(item.classroom || ''),
      building: String(item.building || ''),
      startTime: String(item.startTime || '09:00'),
      endTime: String(item.endTime || '10:00'),
      date: String(item.date || dateStr(year, month, Math.min(day, 31))),
      batch: String(item.batch || ''),
      course: String(item.course || ''),
      department: String(item.department || ''),
      type: (item.type as EventType) || 'lecture',
      description: String(item.description || ''),
    }
  })
}

export default function InteractiveCalendarPage() {
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await timetableService.getAll()
        const rawData = response?.data ?? []
        const data = (Array.isArray(rawData) ? rawData : (rawData?.data ?? [])) as Record<string, unknown>[]
        setEvents(mapToCalendarEvents(data))
      } catch {
        setEvents([])
        setToastMessage('Failed to load calendar events')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const {
    view, setView,
    filters, setSearch, toggleFilter,
    filteredEvents,
    weekDays, monthDays,
    getEventsForDate,
    navigate,
    headerLabel,
    handleDragStart,
  } = useCalendar(events)

  const departmentOptions = useMemo(() => [...new Set(events.map(e => e.department).filter(Boolean))], [events])
  const facultyOptions = useMemo(() => [...new Set(events.map(e => e.faculty).filter(Boolean))], [events])
  const courseOptions = useMemo(() => [...new Set(events.map(e => e.course).filter(Boolean))], [events])
  const batchOptions = useMemo(() => [...new Set(events.map(e => e.batch).filter(Boolean))], [events])
  const classroomOptions = useMemo(() => [...new Set(events.map(e => e.classroom).filter(Boolean))], [events])

  if (loading) return <CalendarSkeleton />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Interactive Calendar</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and manage class schedules across daily, weekly, and monthly views.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdCalendarMonth className="text-primary" />
          {filteredEvents.length} events
        </div>
      </motion.div>

      <CalendarHeader
        view={view}
        onViewChange={setView}
        onNavigate={navigate}
        headerLabel={headerLabel}
        search={filters.search}
        onSearchChange={setSearch}
      />

      <CalendarSidebar
        filters={filters}
        onToggleFilter={toggleFilter}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        departmentOptions={departmentOptions}
        facultyOptions={facultyOptions}
        courseOptions={courseOptions}
        batchOptions={batchOptions}
        classroomOptions={classroomOptions}
      />

      <div className="flex-1 min-w-0">
          {view === 'daily' && (
            <DailyView
              date={weekDays[0]}
              events={filteredEvents.filter((e) => {
                const today = weekDays[0]
                const ds = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                return e.date === ds
              })}
              onDragStart={handleDragStart}
            />
          )}
          {view === 'weekly' && (
            <WeeklyView
              weekDays={weekDays}
              getEventsForDate={getEventsForDate}
              onDragStart={handleDragStart}
            />
          )}
          {view === 'monthly' && (
            <MonthlyView
              monthDays={monthDays}
              getEventsForDate={getEventsForDate}
              onDragStart={handleDragStart}
            />
          )}
        </div>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  )
}
