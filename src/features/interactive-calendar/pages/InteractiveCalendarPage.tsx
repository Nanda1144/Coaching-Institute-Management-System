import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarMonth } from 'react-icons/md'
import { useCalendar } from '../hooks/useCalendar'
import { allEvents, departmentOptions, facultyOptions, courseOptions, batchOptions, classroomOptions } from '../data/calendarData'
import CalendarHeader from '../components/CalendarHeader'
import CalendarSidebar from '../components/CalendarSidebar'
import DailyView from '../components/DailyView'
import WeeklyView from '../components/WeeklyView'
import MonthlyView from '../components/MonthlyView'
import CalendarSkeleton from '../components/CalendarSkeleton'

export default function InteractiveCalendarPage() {
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
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
  } = useCalendar(allEvents)

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
    </motion.div>
  )
}
