import type { ReportFilters } from '../types/attendanceReports.types'

export const initialFilters: ReportFilters = {
  department: '',
  course: '',
  batch: '',
  dateFrom: '2026-07-01',
  dateTo: '2026-07-14',
  reportType: 'daily',
}

export const filterOptions = {
  departments: [
    { value: '', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Civil', label: 'Civil' },
  ],
  courses: [
    { value: '', label: 'All Courses' },
    { value: 'B.Tech', label: 'B.Tech' },
    { value: 'MCA', label: 'MCA' },
    { value: 'M.Tech', label: 'M.Tech' },
    { value: 'BCA', label: 'BCA' },
  ],
  batches: [
    { value: '', label: 'All Batches' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ],
  reportTypes: [
    { value: 'daily', label: 'Daily Report' },
    { value: 'weekly', label: 'Weekly Report' },
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'yearly', label: 'Yearly Report' },
  ],
}

const baseStats = {
  daily: [
    { label: 'Daily Attendance', value: 184, change: 5.2, period: 'vs yesterday' },
    { label: 'Weekly Attendance', value: 1256, change: 2.8, period: 'vs last week' },
    { label: 'Monthly Attendance', value: 5230, change: -1.3, period: 'vs last month' },
    { label: 'Yearly Attendance', value: 45890, change: 8.7, period: 'vs last year' },
  ],
  weekly: [
    { label: 'Daily Attendance', value: 178, change: 3.1, period: 'vs yesterday' },
    { label: 'Weekly Attendance', value: 1246, change: 4.5, period: 'vs last week' },
    { label: 'Monthly Attendance', value: 5190, change: 0.8, period: 'vs last month' },
    { label: 'Yearly Attendance', value: 45670, change: 7.2, period: 'vs last year' },
  ],
  monthly: [
    { label: 'Daily Attendance', value: 182, change: 2.4, period: 'vs yesterday' },
    { label: 'Weekly Attendance', value: 1270, change: 3.9, period: 'vs last week' },
    { label: 'Monthly Attendance', value: 5280, change: 1.7, period: 'vs last month' },
    { label: 'Yearly Attendance', value: 46100, change: 9.1, period: 'vs last year' },
  ],
  yearly: [
    { label: 'Daily Attendance', value: 180, change: 4.8, period: 'vs yesterday' },
    { label: 'Weekly Attendance', value: 1263, change: 3.2, period: 'vs last week' },
    { label: 'Monthly Attendance', value: 5210, change: -0.5, period: 'vs last month' },
    { label: 'Yearly Attendance', value: 45980, change: 8.3, period: 'vs last year' },
  ],
}

const dailyTrend: import('../types/attendanceReports.types').TrendPoint[] = [
  { label: 'Mon', present: 142, absent: 18, late: 12, leave: 8 },
  { label: 'Tue', present: 148, absent: 14, late: 10, leave: 6 },
  { label: 'Wed', present: 135, absent: 22, late: 15, leave: 10 },
  { label: 'Thu', present: 152, absent: 10, late: 8, leave: 4 },
  { label: 'Fri', present: 138, absent: 20, late: 14, leave: 8 },
  { label: 'Sat', present: 98, absent: 8, late: 4, leave: 2 },
]

const weeklyTrend: import('../types/attendanceReports.types').TrendPoint[] = [
  { label: 'Wk 1', present: 950, absent: 110, late: 75, leave: 45 },
  { label: 'Wk 2', present: 980, absent: 95, late: 65, leave: 40 },
  { label: 'Wk 3', present: 920, absent: 130, late: 85, leave: 55 },
  { label: 'Wk 4', present: 1010, absent: 80, late: 55, leave: 35 },
]

const monthlyTrend: import('../types/attendanceReports.types').TrendPoint[] = [
  { label: 'Jan', present: 4100, absent: 380, late: 280, leave: 140 },
  { label: 'Feb', present: 3950, absent: 420, late: 310, leave: 160 },
  { label: 'Mar', present: 4200, absent: 350, late: 250, leave: 120 },
  { label: 'Apr', present: 3850, absent: 450, late: 330, leave: 170 },
  { label: 'May', present: 4300, absent: 320, late: 240, leave: 110 },
  { label: 'Jun', present: 4050, absent: 400, late: 290, leave: 150 },
]

const yearlyTrend: import('../types/attendanceReports.types').TrendPoint[] = [
  { label: '2021', present: 45200, absent: 4200, late: 3100, leave: 1500 },
  { label: '2022', present: 46800, absent: 3800, late: 2800, leave: 1400 },
  { label: '2023', present: 48100, absent: 3500, late: 2600, leave: 1300 },
  { label: '2024', present: 49500, absent: 3200, late: 2400, leave: 1200 },
  { label: '2025', present: 51200, absent: 2900, late: 2200, leave: 1100 },
]

const deptData: import('../types/attendanceReports.types').DepartmentComparison[] = [
  { department: 'Computer Science', present: 1250, total: 1400, percentage: 89.3 },
  { department: 'Information Technology', present: 980, total: 1100, percentage: 89.1 },
  { department: 'Electronics', present: 820, total: 950, percentage: 86.3 },
  { department: 'Mechanical', present: 720, total: 850, percentage: 84.7 },
  { department: 'Civil', present: 650, total: 780, percentage: 83.3 },
]

const summaryBase = { present: 4420, absent: 520, late: 380, leave: 180 }
const total = summaryBase.present + summaryBase.absent + summaryBase.late + summaryBase.leave

export const dummyReportData: Record<import('../types/attendanceReports.types').ReportType, import('../types/attendanceReports.types').ReportData> = {
  daily: {
    stats: baseStats.daily,
    trends: dailyTrend,
    departmentData: deptData,
    summary: { ...summaryBase, total, percentage: parseFloat(((summaryBase.present / total) * 100).toFixed(1)) },
  },
  weekly: {
    stats: baseStats.weekly,
    trends: weeklyTrend,
    departmentData: deptData,
    summary: { ...summaryBase, total, percentage: parseFloat(((summaryBase.present / total) * 100).toFixed(1)) },
  },
  monthly: {
    stats: baseStats.monthly,
    trends: monthlyTrend,
    departmentData: deptData,
    summary: { ...summaryBase, total, percentage: parseFloat(((summaryBase.present / total) * 100).toFixed(1)) },
  },
  yearly: {
    stats: baseStats.yearly,
    trends: yearlyTrend,
    departmentData: deptData,
    summary: { ...summaryBase, total, percentage: parseFloat(((summaryBase.present / total) * 100).toFixed(1)) },
  },
}
