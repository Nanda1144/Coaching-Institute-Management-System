import type {
  AttendanceStats,
  AttendanceRecord,
  DailyAttendance,
  WeeklyTrend,
  DepartmentAttendance,
  MonthlySummary,
  AttendanceNotification,
} from '../types/attendance.types'

export const attendanceStats: AttendanceStats = {
  totalStudents: 1250,
  presentToday: 1086,
  absentToday: 98,
  lateArrivals: 42,
  leaveRequests: 24,
  attendancePercentage: 86.88,
}

export const recentAttendance: AttendanceRecord[] = [
  { id: 'ATT-001', studentName: 'Aarav Sharma', rollNumber: 'CS2001', department: 'Computer Science', status: 'present', time: '08:55 AM', method: 'Face', date: '2026-07-14' },
  { id: 'ATT-002', studentName: 'Priya Patel', rollNumber: 'CS2002', department: 'Computer Science', status: 'present', time: '08:58 AM', method: 'Fingerprint', date: '2026-07-14' },
  { id: 'ATT-003', studentName: 'Rohan Verma', rollNumber: 'CS2003', department: 'Computer Science', status: 'late', time: '09:15 AM', method: 'Manual', date: '2026-07-14' },
  { id: 'ATT-004', studentName: 'Sneha Reddy', rollNumber: 'EC2001', department: 'Electronics', status: 'present', time: '08:50 AM', method: 'Face', date: '2026-07-14' },
  { id: 'ATT-005', studentName: 'Arjun Nair', rollNumber: 'EC2002', department: 'Electronics', status: 'absent', time: '--', method: '--', date: '2026-07-14' },
  { id: 'ATT-006', studentName: 'Meera Joshi', rollNumber: 'MA2001', department: 'Mathematics', status: 'present', time: '08:52 AM', method: 'QR', date: '2026-07-14' },
  { id: 'ATT-007', studentName: 'Vikram Singh', rollNumber: 'MA2002', department: 'Mathematics', status: 'leave', time: '--', method: '--', date: '2026-07-14' },
  { id: 'ATT-008', studentName: 'Ananya Gupta', rollNumber: 'PH2001', department: 'Physics', status: 'present', time: '08:47 AM', method: 'Fingerprint', date: '2026-07-14' },
  { id: 'ATT-009', studentName: 'Karan Mehta', rollNumber: 'PH2002', department: 'Physics', status: 'late', time: '09:22 AM', method: 'Manual', date: '2026-07-14' },
  { id: 'ATT-010', studentName: 'Divya Krishnan', rollNumber: 'CH2001', department: 'Chemistry', status: 'present', time: '08:59 AM', method: 'Face', date: '2026-07-14' },
  { id: 'ATT-011', studentName: 'Rahul Desai', rollNumber: 'CH2002', department: 'Chemistry', status: 'absent', time: '--', method: '--', date: '2026-07-14' },
  { id: 'ATT-012', studentName: 'Neha Kapoor', rollNumber: 'CS2004', department: 'Computer Science', status: 'present', time: '08:53 AM', method: 'QR', date: '2026-07-14' },
  { id: 'ATT-013', studentName: 'Aditya Mishra', rollNumber: 'EC2003', department: 'Electronics', status: 'present', time: '08:56 AM', method: 'Fingerprint', date: '2026-07-14' },
  { id: 'ATT-014', studentName: 'Pooja Iyer', rollNumber: 'CS2005', department: 'Computer Science', status: 'leave', time: '--', method: '--', date: '2026-07-14' },
  { id: 'ATT-015', studentName: 'Siddharth Rao', rollNumber: 'MA2003', department: 'Mathematics', status: 'late', time: '09:10 AM', method: 'Manual', date: '2026-07-14' },
  { id: 'ATT-016', studentName: 'Ishita Jain', rollNumber: 'EC2004', department: 'Electronics', status: 'present', time: '08:48 AM', method: 'Face', date: '2026-07-14' },
  { id: 'ATT-017', studentName: 'Manish Yadav', rollNumber: 'PH2003', department: 'Physics', status: 'absent', time: '--', method: '--', date: '2026-07-14' },
  { id: 'ATT-018', studentName: 'Kavya Nambiar', rollNumber: 'CH2003', department: 'Chemistry', status: 'present', time: '08:51 AM', method: 'QR', date: '2026-07-14' },
  { id: 'ATT-019', studentName: 'Gaurav Bhatia', rollNumber: 'CS2006', department: 'Computer Science', status: 'present', time: '08:57 AM', method: 'Fingerprint', date: '2026-07-14' },
  { id: 'ATT-020', studentName: 'Anjali Menon', rollNumber: 'EC2005', department: 'Electronics', status: 'late', time: '09:18 AM', method: 'Manual', date: '2026-07-14' },
]

export const dailyAttendance: DailyAttendance[] = [
  { date: 'Mon', present: 142, absent: 18, late: 8, leave: 4 },
  { date: 'Tue', present: 148, absent: 12, late: 6, leave: 6 },
  { date: 'Wed', present: 135, absent: 22, late: 10, leave: 5 },
  { date: 'Thu', present: 150, absent: 10, late: 5, leave: 7 },
  { date: 'Fri', present: 138, absent: 20, late: 7, leave: 7 },
  { date: 'Sat', present: 108, absent: 42, late: 12, leave: 10 },
]

export const weeklyTrend: WeeklyTrend[] = [
  { day: 'Mon', percentage: 82, total: 172, present: 142 },
  { day: 'Tue', percentage: 86, total: 172, present: 148 },
  { day: 'Wed', percentage: 78, total: 172, present: 135 },
  { day: 'Thu', percentage: 87, total: 172, present: 150 },
  { day: 'Fri', percentage: 80, total: 172, present: 138 },
  { day: 'Sat', percentage: 63, total: 172, present: 108 },
]

export const departmentAttendance: DepartmentAttendance[] = [
  { department: 'Computer Science', present: 320, total: 350, percentage: 91.4 },
  { department: 'Electronics', present: 185, total: 210, percentage: 88.1 },
  { department: 'Mathematics', present: 140, total: 165, percentage: 84.8 },
  { department: 'Physics', present: 115, total: 140, percentage: 82.1 },
  { department: 'Chemistry', present: 95, total: 120, percentage: 79.2 },
  { department: 'English', present: 78, total: 95, percentage: 82.1 },
  { department: 'Mechanical', present: 65, total: 85, percentage: 76.5 },
  { department: 'Civil', present: 55, total: 75, percentage: 73.3 },
]

export const monthlySummary: MonthlySummary[] = [
  { month: 'Jan', percentage: 85, students: 1240 },
  { month: 'Feb', percentage: 87, students: 1242 },
  { month: 'Mar', percentage: 83, students: 1245 },
  { month: 'Apr', percentage: 79, students: 1245 },
  { month: 'May', percentage: 72, students: 1248 },
  { month: 'Jun', percentage: 88, students: 1250 },
  { month: 'Jul', percentage: 86, students: 1250 },
]

export const attendanceNotifications: AttendanceNotification[] = [
  { id: 'AN-001', type: 'low-attendance', title: 'Low Attendance Alert', description: 'Attendance dropped below 75% threshold in Computer Science department.', studentName: 'Rohan Verma', rollNumber: 'CS2003', severity: 'high' },
  { id: 'AN-002', type: 'low-attendance', title: 'Low Attendance Alert', description: 'Physics department has 3 students below 70% attendance.', studentName: 'Manish Yadav', rollNumber: 'PH2003', severity: 'high' },
  { id: 'AN-003', type: 'correction-request', title: 'Correction Request', description: 'Student requests correction for absent marked on 12-Jul-2026.', studentName: 'Siddharth Rao', rollNumber: 'MA2003', severity: 'medium' },
  { id: 'AN-004', type: 'correction-request', title: 'Correction Request', description: 'Late arrival should be marked as present per faculty approval.', studentName: 'Anjali Menon', rollNumber: 'EC2005', severity: 'medium' },
  { id: 'AN-005', type: 'leave-request', title: 'Leave Request', description: 'Medical leave application for 3 days attached.', studentName: 'Pooja Iyer', rollNumber: 'CS2005', severity: 'low' },
  { id: 'AN-006', type: 'leave-request', title: 'Leave Request', description: 'Family function leave request for 2 days.', studentName: 'Vikram Singh', rollNumber: 'MA2002', severity: 'low' },
]

export const departmentOptions = [
  { value: '', label: 'All Departments' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'English', label: 'English' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
]

export const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  present: { label: 'Present', color: '#10b981', bg: '#d1fae5' },
  absent: { label: 'Absent', color: '#ef4444', bg: '#fee2e2' },
  late: { label: 'Late', color: '#f59e0b', bg: '#fef3c7' },
  leave: { label: 'Leave', color: '#3b82f6', bg: '#dbeafe' },
}

export const methodConfig: Record<string, { color: string; bg: string }> = {
  Face: { color: '#10b981', bg: '#d1fae5' },
  Fingerprint: { color: '#8b5cf6', bg: '#ede9fe' },
  QR: { color: '#0ea5e9', bg: '#e0f2fe' },
  Manual: { color: '#f59e0b', bg: '#fef3c7' },
}
