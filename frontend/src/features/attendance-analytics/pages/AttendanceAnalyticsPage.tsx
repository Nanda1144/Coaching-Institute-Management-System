import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdAnalytics } from 'react-icons/md'
import AnalyticsCards from '../components/AnalyticsCards'
import AnalyticsFilters from '../components/AnalyticsFilters'
import AnalyticsCharts from '../components/AnalyticsCharts'
import StudentPerformance from '../components/StudentPerformance'
import AnalyticsBreakdown from '../components/AnalyticsBreakdown'
import AnalyticsActions from '../components/AnalyticsActions'
import AnalyticsSkeleton from '../components/AnalyticsSkeleton'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import { initialFilters } from '../data/attendanceAnalyticsData'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { AnalyticsFilters as Filters, AnalyticsData } from '../types/attendanceAnalytics.types'

export default function AttendanceAnalyticsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const fetchAnalytics = useCallback(async (f: Filters) => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {}
      if (f.department) params.department = f.department
      if (f.faculty) params.faculty = f.faculty
      if (f.semester) params.semester = f.semester
      if (f.course) params.course = f.course
      if (f.dateFrom) params.dateFrom = f.dateFrom
      if (f.dateTo) params.dateTo = f.dateTo

      const res = await attendanceService.getAttendanceStats({ ...params, type: 'analytics' })
      const d = res?.data || res || {}
      setData({
        cards: d.cards || { overallPercentage: 0, averageAttendance: 0, highestAttendance: { value: 0, department: '' }, lowestAttendance: { value: 0, department: '' } },
        trend: d.trend || [],
        departmentData: d.departmentData || [],
        monthlyData: d.monthlyData || [],
        heatmap: d.heatmap || [],
        topStudents: d.topStudents || [],
        lowStudents: d.lowStudents || [],
        facultyData: d.facultyData || [],
        courseData: d.courseData || [],
      })
    } catch {
      setToastMessage('Failed to load analytics data')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics(filters)
  }, [filters])

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <AttendanceNavBar />
        <div className="h-8 w-60 bg-gray-100/60 rounded-xl animate-pulse" />
        <AnalyticsSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AttendanceNavBar />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Deep insights into attendance patterns, trends, and performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdAnalytics className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      <AnalyticsCards cards={data.cards} />

      <AnalyticsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AnalyticsCharts
        trend={data.trend}
        departmentData={data.departmentData}
        monthlyData={data.monthlyData}
        heatmap={data.heatmap}
      />

      <StudentPerformance
        topStudents={data.topStudents}
        lowStudents={data.lowStudents}
      />

      <AnalyticsBreakdown
        facultyData={data.facultyData}
        courseData={data.courseData}
      />

      <AnalyticsActions />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}