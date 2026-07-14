import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarMonth } from 'react-icons/md'
import DashboardCard from '../../../components/DashboardCard'
import TimetableLoadingSkeleton from '../components/TimetableLoadingSkeleton'
import TimetableFilters from '../components/TimetableFilters'
import TodayTimetable from '../components/TodayTimetable'
import ChartsSection from '../components/ChartsSection'
import UpcomingClasses from '../components/UpcomingClasses'
import NotificationsPanel from '../components/NotificationsPanel'
import QuickTimetableActions from '../components/QuickTimetableActions'
import RecentTimetableActivities from '../components/RecentTimetableActivities'
import {
  timetableStats,
  todayTimetable as initialTodayTimetable,
  upcomingClasses,
  notifications,
  timetableActivities,
  dailyScheduleData,
  weeklyDistributionData,
  facultyWorkloadData,
  classroomUtilizationData,
  departments,
  courses,
} from '../data/timetableData'
import type { FilterState, PageState } from '../types/timetable.types'

const statCards = [
  { title: "Today's Classes", value: timetableStats.todayClasses, icon: MdCalendarMonth, color: '#3b82f6', bgColor: '#dbeafe' },
  { title: 'This Week Classes', value: timetableStats.thisWeekClasses, icon: MdCalendarMonth, color: '#10b981', bgColor: '#d1fae5' },
  { title: 'Monthly Classes', value: timetableStats.monthlyClasses, icon: MdCalendarMonth, color: '#8b5cf6', bgColor: '#ede9fe' },
  { title: 'Available Classrooms', value: timetableStats.availableClassrooms, icon: MdCalendarMonth, color: '#f59e0b', bgColor: '#fef3c7' },
  { title: 'Active Faculty', value: timetableStats.activeFaculty, icon: MdCalendarMonth, color: '#ec4899', bgColor: '#fce7f3' },
  { title: 'Ongoing Classes', value: timetableStats.ongoingClasses, icon: MdCalendarMonth, color: '#ef4444', bgColor: '#fee2e2' },
]

const initialFilters: FilterState = { search: '', department: '', course: '' }

export default function TimetableDashboard() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [pageState, setPageState] = useState<PageState>({ loading: true, error: null })

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState({ loading: false, error: null })
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const filteredTimetable = useMemo(() => {
    let result = [...initialTodayTimetable]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.faculty.toLowerCase().includes(q) ||
          e.course.toLowerCase().includes(q) ||
          e.batch.toLowerCase().includes(q)
      )
    }
    if (filters.department) {
      result = result.filter((e) => e.department === filters.department)
    }
    if (filters.course) {
      result = result.filter((e) => e.course === filters.course)
    }
    return result
  }, [filters])

  const filteredUpcoming = useMemo(() => {
    let result = [...upcomingClasses]
    if (filters.department) {
      result = result.filter((e) => e.department === filters.department)
    }
    if (filters.course) {
      result = result.filter((e) => e.course === filters.course)
    }
    return result
  }, [filters])

  if (pageState.loading) {
    return <TimetableLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Timetable Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor class schedules across all departments.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <DashboardCard key={card.title} {...card} index={index} />
        ))}
      </div>

      <ChartsSection
        dailySchedule={dailyScheduleData}
        weeklyDistribution={weeklyDistributionData}
        facultyWorkload={facultyWorkloadData}
        classroomUtilization={classroomUtilizationData}
      />

      <TimetableFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        departments={departments}
        courses={courses}
      />

      <TodayTimetable entries={filteredTimetable} error={pageState.error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingClasses classes={filteredUpcoming} error={pageState.error} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <NotificationsPanel notifications={notifications} error={pageState.error} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTimetableActivities activities={timetableActivities} error={pageState.error} />
        </div>
        <div className="lg:col-span-1">
          <QuickTimetableActions
            entries={filteredTimetable}
            onEditSave={(entryId, updates) => {
              console.log('Entry updated:', entryId, updates)
            }}
          />
        </div>
      </div>
    </div>
  )
}
