import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdAssessment } from 'react-icons/md'
import ReportStatsCards from '../components/ReportStatsCards'
import ReportFilters from '../components/ReportFilters'
import ReportCharts from '../components/ReportCharts'
import ReportSummaryTable from '../components/ReportSummaryTable'
import ReportActions from '../components/ReportActions'
import ReportSkeleton from '../components/ReportSkeleton'
import { initialFilters, dummyReportData } from '../data/attendanceReportsData'
import type { ReportFilters as ReportFiltersType, ReportType } from '../types/attendanceReports.types'

export default function AttendanceReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersType>(initialFilters)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = useCallback((key: keyof ReportFiltersType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const reportData = useMemo(() => {
    const rt = filters.reportType as ReportType
    return dummyReportData[rt] || dummyReportData.daily
  }, [filters.reportType])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-gray-100/60 rounded-xl animate-pulse" />
        <ReportSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Reports</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate and analyze attendance reports across all departments and time periods.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdAssessment className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      <ReportStatsCards stats={reportData.stats} />

      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <ReportCharts
        trends={reportData.trends}
        departmentData={reportData.departmentData}
      />

      <ReportSummaryTable summary={reportData.summary} />

      <ReportActions />
    </div>
  )
}
