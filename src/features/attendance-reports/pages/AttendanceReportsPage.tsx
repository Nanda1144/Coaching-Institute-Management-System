import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdAssessment } from 'react-icons/md'
import ReportStatsCards from '../components/ReportStatsCards'
import ReportFilters from '../components/ReportFilters'
import ReportCharts from '../components/ReportCharts'
import ReportSummaryTable from '../components/ReportSummaryTable'
import ReportActions from '../components/ReportActions'
import ReportSkeleton from '../components/ReportSkeleton'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import { initialFilters } from '../data/attendanceReportsData'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { ReportFilters as ReportFiltersType, ReportData } from '../types/attendanceReports.types'

export default function AttendanceReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersType>(initialFilters)
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const fetchReport = useCallback(async (f: ReportFiltersType) => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {}
      if (f.department) params.department = f.department
      if (f.course) params.course = f.course
      if (f.batch) params.batch = f.batch
      if (f.dateFrom) params.dateFrom = f.dateFrom
      if (f.dateTo) params.dateTo = f.dateTo
      if (f.reportType) params.reportType = f.reportType

      const res = await attendanceService.getAttendanceStats(params)
      const data = res?.data || res || {}
      setReportData({
        stats: data.stats || [],
        trends: data.trends || [],
        departmentData: data.departmentData || [],
        summary: data.summary || { present: 0, absent: 0, late: 0, leave: 0, total: 0, percentage: 0 },
      })
    } catch {
      setToastMessage('Failed to load report data')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReport(filters)
  }, [filters])

  const handleFilterChange = useCallback((key: keyof ReportFiltersType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  if (loading || !reportData) {
    return (
      <div className="space-y-6">
        <AttendanceNavBar />
        <div className="h-8 w-56 bg-gray-100/60 rounded-xl animate-pulse" />
        <ReportSkeleton />
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

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}