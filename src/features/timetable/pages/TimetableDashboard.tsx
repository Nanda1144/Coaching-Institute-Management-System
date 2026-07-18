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
import timetableService from '../../../services/timetable/timetable.service'
import { normalizeTimetableList } from '../../../utils/normalizers'
import Toast from '../../../components/Toast'
import type { FilterState, PageState } from '../types/timetable.types'
import type { TimetableEntry, UpcomingClass, Notification, TimetableActivity, DailySchedule, WeeklyDistribution, FacultyWorkload, ClassroomUtilization } from '../types/timetable.types'

const statCards = [
  { title: "Today's Classes", value: 0, icon: MdCalendarMonth, color: '#3b82f6', bgColor: '#dbeafe' },
  { title: 'This Week Classes', value: 0, icon: MdCalendarMonth, color: '#10b981', bgColor: '#d1fae5' },
  { title: 'Monthly Classes', value: 0, icon: MdCalendarMonth, color: '#8b5cf6', bgColor: '#ede9fe' },
  { title: 'Available Classrooms', value: 0, icon: MdCalendarMonth, color: '#f59e0b', bgColor: '#fef3c7' },
  { title: 'Active Faculty', value: 0, icon: MdCalendarMonth, color: '#ec4899', bgColor: '#fce7f3' },
  { title: 'Ongoing Classes', value: 0, icon: MdCalendarMonth, color: '#ef4444', bgColor: '#fee2e2' },
]

const initialFilters: FilterState = { search: '', department: '', course: '' }

export default function TimetableDashboard() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [pageState, setPageState] = useState<PageState>({ loading: true, error: null })
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [timetableStats, setTimetableStats] = useState({ todayClasses: 0, thisWeekClasses: 0, monthlyClasses: 0, availableClassrooms: 0, activeFaculty: 0, ongoingClasses: 0 })
  const [todayTimetable, setTodayTimetable] = useState<TimetableEntry[]>([])
  const [upcomingClasses] = useState<UpcomingClass[]>([])
  const [notifications] = useState<Notification[]>([])
  const [timetableActivities] = useState<TimetableActivity[]>([])
  const [dailyScheduleData] = useState<DailySchedule[]>([
    { hour: '08:00', classes: 0 }, { hour: '09:00', classes: 0 }, { hour: '10:00', classes: 0 },
    { hour: '11:00', classes: 0 }, { hour: '12:00', classes: 0 }, { hour: '13:00', classes: 0 },
    { hour: '14:00', classes: 0 }, { hour: '15:00', classes: 0 }, { hour: '16:00', classes: 0 },
    { hour: '17:00', classes: 0 },
  ])
  const [weeklyDistributionData] = useState<WeeklyDistribution[]>([
    { day: 'Monday', classes: 0 }, { day: 'Tuesday', classes: 0 }, { day: 'Wednesday', classes: 0 },
    { day: 'Thursday', classes: 0 }, { day: 'Friday', classes: 0 }, { day: 'Saturday', classes: 0 },
  ])
  const [facultyWorkloadData] = useState<FacultyWorkload[]>([])
  const [classroomUtilizationData] = useState<ClassroomUtilization[]>([])
  const [departments] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'English', label: 'English' },
  ])
  const [courses] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'All Courses' },
    { value: 'B.Tech CSE', label: 'B.Tech CSE' },
    { value: 'B.Tech ECE', label: 'B.Tech ECE' },
    { value: 'B.Sc Math', label: 'B.Sc Math' },
    { value: 'M.Sc Math', label: 'M.Sc Math' },
    { value: 'M.Sc Physics', label: 'M.Sc Physics' },
    { value: 'B.Sc Chemistry', label: 'B.Sc Chemistry' },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await timetableService.getAll()
        const entries = normalizeTimetableList(response)
        setTodayTimetable(entries)
        const now = new Date().toLocaleString('en-US', { weekday: 'long' })
        const todayEntries = entries.filter((e: TimetableEntry) =>
          'day' in e ? (e as unknown as Record<string, string>).day === now : false
        )
        setTimetableStats({
          todayClasses: todayEntries.length,
          thisWeekClasses: entries.length,
          monthlyClasses: Math.round(entries.length * 4.3),
          availableClassrooms: 24,
          activeFaculty: [...new Set(entries.map((e: TimetableEntry) => e.faculty))].length || 112,
          ongoingClasses: entries.filter((e: TimetableEntry) => e.status === 'ongoing').length,
        })
        setPageState({ loading: false, error: null })
      } catch {
        setPageState({ loading: false, error: 'Failed to load timetable data' })
      }
    }
    fetchData()
  }, [])

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const filteredTimetable = useMemo(() => {
    let result = [...todayTimetable]
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
  }, [filters, todayTimetable])

  const filteredUpcoming = useMemo(() => {
    let result = [...upcomingClasses]
    if (filters.department) {
      result = result.filter((e) => e.department === filters.department)
    }
    if (filters.course) {
      result = result.filter((e) => e.course === filters.course)
    }
    return result
  }, [filters, upcomingClasses])

  if (pageState.loading) {
    return <TimetableLoadingSkeleton />
  }

  const cards = statCards.map((card) => ({
    ...card,
    value: card.title === "Today's Classes" ? timetableStats.todayClasses
      : card.title === 'This Week Classes' ? timetableStats.thisWeekClasses
      : card.title === 'Monthly Classes' ? timetableStats.monthlyClasses
      : card.title === 'Available Classrooms' ? timetableStats.availableClassrooms
      : card.title === 'Active Faculty' ? timetableStats.activeFaculty
      : card.title === 'Ongoing Classes' ? timetableStats.ongoingClasses
      : card.value,
  }))

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
        {cards.map((card, index) => (
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
            onEditSave={async (entryId, updates) => {
              try {
                await timetableService.update(entryId, updates as Record<string, unknown>)
                setToastMsg('Timetable entry updated successfully')
                setShowToast(true)
                setTimeout(() => setShowToast(false), 3000)
              } catch {
                setToastMsg('Failed to update timetable entry')
                setShowToast(true)
                setTimeout(() => setShowToast(false), 3000)
              }
            }}
          />
        </div>
      </div>

      <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  )
}
