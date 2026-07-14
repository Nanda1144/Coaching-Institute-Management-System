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
import { initialFilters, dummyAnalyticsData } from '../data/attendanceAnalyticsData'
import type { AnalyticsFilters as Filters } from '../types/attendanceAnalytics.types'

export default function AttendanceAnalyticsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-60 bg-gray-100/60 rounded-xl animate-pulse" />
        <AnalyticsSkeleton />
      </div>
    )
  }

  const data = dummyAnalyticsData

  return (
    <div className="space-y-6">
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
    </div>
  )
}
