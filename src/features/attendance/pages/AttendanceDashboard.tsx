import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdHowToVote } from 'react-icons/md'
import AttendanceSkeleton from '../components/AttendanceSkeleton'
import AttendanceStatsCards from '../components/AttendanceStatsCards'
import AttendanceCharts from '../components/AttendanceCharts'
import AttendanceFilters from '../components/AttendanceFilters'
import RecentAttendanceTable from '../components/RecentAttendanceTable'
import AttendanceQuickActions from '../components/AttendanceQuickActions'
import AttendanceNotifications from '../components/AttendanceNotifications'
import {
  attendanceStats,
  recentAttendance as initialRecentAttendance,
  dailyAttendance,
  weeklyTrend,
  departmentAttendance,
  monthlySummary,
  attendanceNotifications,
  departmentOptions,
} from '../data/attendanceData'
import type { AttendanceFilterState, PageState } from '../types/attendance.types'

const initialFilters: AttendanceFilterState = { search: '', department: '', date: '' }

export default function AttendanceDashboard() {
  const [filters, setFilters] = useState<AttendanceFilterState>(initialFilters)
  const [pageState, setPageState] = useState<PageState>({ loading: true, error: null })

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState({ loading: false, error: null })
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = useCallback((key: keyof AttendanceFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const filteredRecords = useMemo(() => {
    let result = [...initialRecentAttendance]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.rollNumber.toLowerCase().includes(q)
      )
    }
    if (filters.department) {
      result = result.filter((r) => r.department === filters.department)
    }
    if (filters.date) {
      result = result.filter((r) => r.date === filters.date)
    }
    return result
  }, [filters])

  if (pageState.loading) {
    return <AttendanceSkeleton />
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage student attendance across all departments.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdHowToVote className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </motion.div>

      <AttendanceStatsCards stats={attendanceStats} />

      <AttendanceCharts
        dailyAttendance={dailyAttendance}
        weeklyTrend={weeklyTrend}
        departmentAttendance={departmentAttendance}
        monthlySummary={monthlySummary}
      />

      <AttendanceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        departmentOptions={departmentOptions}
      />

      <RecentAttendanceTable records={filteredRecords} error={pageState.error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Today&apos;s Attendance Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {([
                { label: 'Present', value: attendanceStats.presentToday, color: '#10b981', bg: '#d1fae5' },
                { label: 'Absent', value: attendanceStats.absentToday, color: '#ef4444', bg: '#fee2e2' },
                { label: 'Late', value: attendanceStats.lateArrivals, color: '#f59e0b', bg: '#fef3c7' },
                { label: 'Leave', value: attendanceStats.leaveRequests, color: '#3b82f6', bg: '#dbeafe' },
              ] as const).map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center p-4 rounded-xl border border-gray-100"
                >
                  <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / attendanceStats.totalStudents) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AttendanceNotifications notifications={attendanceNotifications} error={pageState.error} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceQuickActions />
        </div>
      </div>
    </div>
  )
}
