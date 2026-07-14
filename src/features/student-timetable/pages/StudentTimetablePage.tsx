import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import StudentInfoCard from '../components/StudentInfoCard'
import QuickStats from '../components/QuickStats'
import TimetableActions from '../components/TimetableActions'
import DailySchedule from '../components/DailySchedule'
import WeeklySchedule from '../components/WeeklySchedule'
import MonthlySchedule from '../components/MonthlySchedule'
import ScheduleTable from '../components/ScheduleTable'
import StudentTimetableSkeleton from '../components/StudentTimetableSkeleton'
import {
  studentInfo,
  scheduleEntries,
  pastScheduleEntries,
  quickStats,
  dayOptions,
} from '../data/studentTimetableData'
import type { ScheduleView } from '../types/studentTimetable.types'

const viewTabs: { key: ScheduleView; label: string }[] = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

export default function StudentTimetablePage() {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ScheduleView>('daily')
  const [search, setSearch] = useState('')
  const [dayFilter, setDayFilter] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleDayFilterChange = useCallback((value: string) => {
    setDayFilter(value)
  }, [])

  const handleCalendarView = useCallback(() => {
    const nextView = { daily: 'weekly', weekly: 'monthly', monthly: 'daily' } as const
    setView((prev) => nextView[prev])
  }, [])

  const handleDownloadPdf = useCallback(() => {
    window.print()
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const allEntries = useMemo(() => [...pastScheduleEntries, ...scheduleEntries], [])

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
          e.faculty.toLowerCase().includes(q) ||
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

  if (loading) return <StudentTimetableSkeleton />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Timetable</h2>
          <p className="text-sm text-gray-500 mt-1">
            View your class schedule, track attendance, and stay organized.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </motion.div>

      <StudentInfoCard info={studentInfo} />
      <QuickStats stats={quickStats} />

      <TimetableActions
        search={search}
        onSearchChange={handleSearchChange}
        dayFilter={dayFilter}
        onDayFilterChange={handleDayFilterChange}
        dayOptions={dayOptions}
        onCalendarView={handleCalendarView}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
      />

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
          <DailySchedule entries={todayEntries} />
        </div>
      )}

      {view === 'weekly' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule</h3>
            <span className="text-xs text-gray-400 bg-white/50 px-3 py-1 rounded-lg border border-white/30">
              Week {Math.ceil(new Date().getDate() / 7)}
            </span>
          </div>
          <WeeklySchedule entries={filteredEntries} />
          <div className="mt-6">
            <ScheduleTable entries={displayEntries} view="weekly" />
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
          <MonthlySchedule entries={filteredEntries} />
          <div className="mt-6">
            <ScheduleTable entries={displayEntries} view="monthly" />
          </div>
        </div>
      )}
    </div>
  )
}
