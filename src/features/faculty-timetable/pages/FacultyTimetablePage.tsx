import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import FacultyProfileCard from '../components/FacultyProfileCard'
import FacultyStats from '../components/FacultyStats'
import FacultyActions from '../components/FacultyActions'
import FacultyDailySchedule from '../components/FacultyDailySchedule'
import FacultyWeeklyGrid from '../components/FacultyWeeklyGrid'
import FacultyMonthlySchedule from '../components/FacultyMonthlySchedule'
import FacultyScheduleTable from '../components/FacultyScheduleTable'
import FacultyQuickActions from '../components/FacultyQuickActions'
import FacultyTimetableSkeleton from '../components/FacultyTimetableSkeleton'
import {
  facultyInfo,
  facultyScheduleEntries,
  facultyPastEntries,
  facultyStats,
  facultyDayOptions,
} from '../data/facultyTimetableData'
import type { FacultyScheduleView } from '../types/facultyTimetable.types'

const viewTabs: { key: FacultyScheduleView; label: string }[] = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

export default function FacultyTimetablePage() {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<FacultyScheduleView>('daily')
  const [search, setSearch] = useState('')
  const [dayFilter, setDayFilter] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const handleSearchChange = useCallback((value: string) => setSearch(value), [])
  const handleDayFilterChange = useCallback((value: string) => setDayFilter(value), [])

  const allEntries = useMemo(() => [...facultyPastEntries, ...facultyScheduleEntries], [])

  const todayEntries = useMemo(() => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' })
    return allEntries.filter((e) => e.day === today)
  }, [allEntries])

  const filteredEntries = useMemo(() => {
    let result = [...allEntries]
    const q = search.toLowerCase()
    if (q) {
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.course.toLowerCase().includes(q) ||
          e.batch.toLowerCase().includes(q) ||
          e.classroom.toLowerCase().includes(q)
      )
    }
    if (dayFilter) {
      result = result.filter((e) => e.day === dayFilter)
    }
    return result
  }, [allEntries, search, dayFilter])

  const displayEntries = useMemo(() => {
    if (view === 'daily') return todayEntries
    return filteredEntries
  }, [view, todayEntries, filteredEntries])

  const handlePrint = useCallback(() => window.print(), [])
  const handleDownloadPdf = useCallback(() => window.print(), [])
  const handleRequestChange = useCallback(() => {
    alert('Change request submitted to the admin.')
  }, [])
  const handleViewCalendar = useCallback(() => {
    const next = { daily: 'weekly', weekly: 'monthly', monthly: 'daily' } as const
    setView((prev) => next[prev])
  }, [])

  if (loading) return <FacultyTimetableSkeleton />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Faculty Timetable</h2>
          <p className="text-sm text-gray-500 mt-1">
            View your weekly class schedule, manage classes, and track teaching hours.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </motion.div>

      <FacultyProfileCard info={facultyInfo} />
      <FacultyStats stats={facultyStats} />

      <FacultyActions
        search={search}
        onSearchChange={handleSearchChange}
        dayFilter={dayFilter}
        onDayFilterChange={handleDayFilterChange}
        dayOptions={facultyDayOptions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 bg-white/50 rounded-xl p-1 border border-white/30 w-fit">
            {viewTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === tab.key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {view === 'daily' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
                <span className="text-xs text-gray-400 bg-white/50 px-3 py-1 rounded-lg border border-white/30">
                  {todayEntries.length} class{todayEntries.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <FacultyDailySchedule entries={todayEntries} />
            </div>
          )}

          {view === 'weekly' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Weekly Timetable</h3>
                <span className="text-xs text-gray-400 bg-white/50 px-3 py-1 rounded-lg border border-white/30">
                  Week {Math.ceil(new Date().getDate() / 7)}
                </span>
              </div>
              <FacultyWeeklyGrid entries={filteredEntries} />
              <div className="mt-4">
                <FacultyScheduleTable entries={displayEntries} view="weekly" />
              </div>
            </div>
          )}

          {view === 'monthly' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Monthly Schedule</h3>
                <span className="text-xs text-gray-400 bg-white/50 px-3 py-1 rounded-lg border border-white/30">
                  {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <FacultyMonthlySchedule entries={filteredEntries} />
              <div className="mt-4">
                <FacultyScheduleTable entries={displayEntries} view="monthly" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <FacultyQuickActions
            onPrint={handlePrint}
            onDownloadPdf={handleDownloadPdf}
            onRequestChange={handleRequestChange}
            onViewCalendar={handleViewCalendar}
          />
        </div>
      </div>
    </div>
  )
}
