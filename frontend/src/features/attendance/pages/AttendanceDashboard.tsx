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
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import ErrorMessage from '../../../components/ErrorMessage'
import attendanceService from '../../../services/attendance/attendance.service'
import type { AttendanceFilterState, PageState, AttendanceRecord, DailyAttendance, WeeklyTrend, DepartmentAttendance, MonthlySummary, AttendanceNotification } from '../types/attendance.types'

const initialFilters: AttendanceFilterState = { search: '', department: '', date: '' }

export default function AttendanceDashboard() {
  const [filters, setFilters] = useState<AttendanceFilterState>(initialFilters)
  const [pageState, setPageState] = useState<PageState>({ loading: true, error: null })
  const [stats, setStats] = useState<any>({ totalStudents: 0, presentToday: 0, absentToday: 0, lateArrivals: 0, leaveRequests: 0, attendancePercentage: 0 })
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [dailyData, setDailyData] = useState<DailyAttendance[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyTrend[]>([])
  const [deptData, setDeptData] = useState<DepartmentAttendance[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([])
  const [notifications] = useState<AttendanceNotification[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        setPageState({ loading: true, error: null })
        const [todayRes, statsRes, listRes] = await Promise.allSettled([
          attendanceService.getTodayAttendance(),
          attendanceService.getAttendanceStats(),
          attendanceService.getAll({ page: 1, limit: 50 }),
        ])

        if (todayRes.status === 'fulfilled' && todayRes.value?.data) {
          const d = todayRes.value.data
          const summary = d.summary || d
          setStats({
            totalStudents: summary.total || 0,
            presentToday: summary.present || 0,
            absentToday: summary.absent || 0,
            lateArrivals: summary.late || 0,
            leaveRequests: summary.leave || 0,
            attendancePercentage: summary.total > 0 ? Math.round(((summary.present || 0) / summary.total) * 100) : 0,
          })
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          const s = statsRes.value.data
          if (s.bySubject) {
            setDailyData(s.bySubject.map((sub: any) => ({ label: sub.subjectName, present: sub.present, absent: sub.absent, total: sub.total })))
          }
          if (s.byMonth) {
            setMonthlyData(s.byMonth.map((m: any) => ({ month: `${m.month}/${m.year}`, present: m.present, absent: m.absent, total: m.total, percentage: m.percentage })))
          }
          if (s.bySubject) {
            setDeptData(s.bySubject.map((sub: any) => ({ name: sub.subjectName, value: sub.percentage })))
          }
          if (s.byMonth) {
            setWeeklyData(s.byMonth.map((m: any) => ({ week: `${m.month}/${m.year}`, rate: m.percentage })))
          }
        }

        if (listRes.status === 'fulfilled' && listRes.value?.data) {
          const recordsData = listRes.value.data.data || listRes.value.data
          const mapped: AttendanceRecord[] = (Array.isArray(recordsData) ? recordsData : []).map((item: any) => ({
            id: item.id,
            studentName: item.student?.fullName || 'Unknown',
            rollNumber: item.student?.rollNumber || '',
            department: item.student?.department || '',
            status: item.attendanceStatus || 'present',
            time: item.startTime ? new Date(item.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            method: item.attendanceMethod || 'manual',
            date: item.attendanceDate ? new Date(item.attendanceDate).toISOString().split('T')[0] : '',
          }))
          setRecords(mapped)
        }

        setPageState({ loading: false, error: null })
      } catch (err: any) {
        setPageState({ loading: false, error: err?.message || 'Failed to load data' })
      }
    }
    fetchData()
  }, [])

  const handleFilterChange = useCallback((key: keyof AttendanceFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const departmentOptions = useMemo(() => {
    const depts = [...new Set(records.map(r => r.department).filter(Boolean))]
    return depts.map(d => ({ value: d, label: d }))
  }, [records])

  const filteredRecords = useMemo(() => {
    let result = [...records]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (r) => r.studentName.toLowerCase().includes(q) || r.rollNumber.toLowerCase().includes(q)
      )
    }
    if (filters.department) {
      result = result.filter((r) => r.department === filters.department)
    }
    if (filters.date) {
      result = result.filter((r) => r.date === filters.date)
    }
    return result
  }, [filters, records])

  if (pageState.loading) {
    return <AttendanceSkeleton />
  }

  if (pageState.error && !records.length && !stats.totalStudents) {
    return (
      <div className="space-y-6">
        <AttendanceNavBar />
        <ErrorMessage message={pageState.error} onRetry={() => window.location.reload()} fullPage />
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
          <h2 className="text-2xl font-bold text-gray-800">Attendance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage student attendance across all departments.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdHowToVote className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </motion.div>

      <AttendanceStatsCards stats={stats} />

      <AttendanceCharts
        dailyAttendance={dailyData}
        weeklyTrend={weeklyData}
        departmentAttendance={deptData}
        monthlySummary={monthlyData}
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
                { label: 'Present', value: stats.presentToday, color: '#10b981', bg: '#d1fae5' },
                { label: 'Absent', value: stats.absentToday, color: '#ef4444', bg: '#fee2e2' },
                { label: 'Late', value: stats.lateArrivals, color: '#f59e0b', bg: '#fef3c7' },
                { label: 'Leave', value: stats.leaveRequests, color: '#3b82f6', bg: '#dbeafe' },
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
                      animate={{ width: `${stats.totalStudents > 0 ? (item.value / stats.totalStudents) * 100 : 0}%` }}
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
          <AttendanceNotifications notifications={notifications} error={pageState.error} />
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
