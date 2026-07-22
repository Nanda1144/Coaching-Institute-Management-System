import type { Faculty } from '../features/faculty/types/faculty.types'
import type { TimetableEntry, UpcomingClass, Notification as TimetableNotification, TimetableActivity } from '../features/timetable/types/timetable.types'
import type { AttendanceRecord, AttendanceStats, DailyAttendance, WeeklyTrend, DepartmentAttendance, MonthlySummary, AttendanceNotification } from '../features/attendance/types/attendance.types'
import type { HistoryRecord, HistoryStats } from '../features/attendance-history/types/attendanceHistory.types'
import type { CorrectionRequest } from '../features/attendance-correction/types/attendanceCorrection.types'
import type { FacultyProfile } from '../features/faculty-profile/types/profile.types'
import type { Holiday } from '../features/holiday-management/types/holiday.types'
import { unwrapApiResponse, unwrapApiObject, getFacultyName } from './unwrap'
import {
  safeString, safeNumber, safeDate, safeDateTime, safeArray, safeObject,
  safeEnum, safeEmail, safePhone, safeJoin, isPlainObject,
} from './safe'

/* ─────────── FACULTY ─────────── */

const FACULTY_STATUSES = ['Active', 'Inactive', 'On Leave'] as const

export function normalizeFaculty(raw: unknown): Faculty {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.facultyId) || safeString(obj.id),
    photo: safeString(obj.profileImage) || safeString(obj.photo),
    name: getFacultyName(obj) || safeString(obj.name) || 'Unknown',
    department: safeString(obj.department) || 'General',
    designation: safeString(obj.designation) || 'Faculty',
    qualification: Array.isArray(obj.qualification)
      ? safeJoin(obj.qualification)
      : safeString(obj.qualification),
    email: safeEmail(obj.email),
    phone: safePhone(obj.phone),
    status: safeEnum(obj.status, FACULTY_STATUSES, 'Active'),
    joiningDate: safeDate(obj.joiningDate) || safeDate(obj.joinDate),
    branch: safeString(obj.branch) || 'Main Campus',
    experience: safeNumber(obj.experience),
    gender: safeString(obj.gender),
  }
}

export function normalizeFacultyList(response: unknown): Faculty[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeFaculty)
}

export function normalizeFacultyProfile(raw: unknown): FacultyProfile {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.facultyId) || safeString(obj.id),
    photo: safeString(obj.profileImage) || safeString(obj.photo),
    name: getFacultyName(obj) || safeString(obj.name) || 'Unknown',
    designation: safeString(obj.designation) || '',
    department: safeString(obj.department) || '',
    experience: safeNumber(obj.experience),
    email: safeEmail(obj.email),
    phone: safePhone(obj.phone),
    address: safeString(obj.address),
    dob: safeDate(obj.dob) || safeDate(obj.dateOfBirth),
    gender: safeString(obj.gender),
    qualification: safeString(obj.qualification),
    specialization: safeString(obj.specialization),
    joiningDate: safeDate(obj.joiningDate),
    employmentType: safeString(obj.employmentType) || 'Full-time',
    branch: safeString(obj.branch) || '',
    status: safeString(obj.status) || 'Active',
  }
}

/* ─────────── TIMETABLE ─────────── */

const TIMETABLE_STATUSES = ['ongoing', 'scheduled', 'completed', 'cancelled'] as const

export function normalizeTimetableEntry(raw: unknown): TimetableEntry {
  const obj = safeObject<Record<string, unknown>>(raw)
  const time =
    safeString(obj.startTime) && safeString(obj.endTime)
      ? `${formatTime(safeString(obj.startTime))} - ${formatTime(safeString(obj.endTime))}`
      : safeString(obj.time) || 'TBD'
  const dayOfWeek = safeString(obj.dayOfWeek) || safeString(obj.day)
  return {
    id: safeString(obj.id),
    time,
    day: dayOfWeek,
    course: safeString(obj.course) || 'General',
    subject: safeString(obj.subject) || safeString(obj.subjectName) || 'Unknown',
    faculty: getFacultyName(obj.faculty) || getFacultyName(obj) || safeString(obj.faculty) || safeString(obj.facultyName) || 'Unknown',
    classroom: safeString(obj.classroom) || safeString(obj.building && obj.roomNumber ? `${obj.building} ${obj.roomNumber}` : '') || safeString(obj.roomNumber) || 'TBD',
    batch: safeString(obj.batch) || safeString(obj.batchName) || 'General',
    department: safeString(obj.department) || 'General',
    status: safeEnum(obj.status, TIMETABLE_STATUSES, 'scheduled'),
  }
}

export function normalizeTimetableList(response: unknown): TimetableEntry[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeTimetableEntry)
}

export function normalizeUpcomingClass(raw: unknown): UpcomingClass {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    date: safeDate(obj.date) || safeDate(obj.attendanceDate),
    day: safeString(obj.day) || 'Unknown',
    time: safeString(obj.time) || 'TBD',
    course: safeString(obj.course) || 'General',
    subject: safeString(obj.subject) || 'Unknown',
    faculty: getFacultyName(obj.faculty) || getFacultyName(obj) || safeString(obj.faculty) || 'Unknown',
    classroom: safeString(obj.classroom) || 'TBD',
    batch: safeString(obj.batch) || 'General',
    department: safeString(obj.department) || 'General',
  }
}

export function normalizeTimetableNotification(raw: unknown): TimetableNotification {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    type: safeEnum(obj.type, ['holiday', 'event', 'change'] as const, 'info' as any),
    title: safeString(obj.title) || 'Notification',
    description: safeString(obj.description),
    date: safeDate(obj.date) || safeDateTime(obj.createdAt),
  }
}

export function normalizeTimetableActivity(raw: unknown): TimetableActivity {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    type: safeEnum(obj.type, ['updated', 'added'] as const, 'added' as any),
    description: safeString(obj.description),
    timetableName: safeString(obj.timetableName) || safeString(obj.subject) || 'Entry',
    timestamp: safeString(obj.timestamp) || safeDateTime(obj.createdAt),
    user: safeString(obj.user) || safeString(obj.faculty) || 'System',
  }
}

/* ─────────── ATTENDANCE ─────────── */

const ATTENDANCE_RECORD_STATUSES = ['present', 'absent', 'late', 'leave'] as const

export function normalizeAttendanceRecord(raw: unknown): AttendanceRecord {
  const obj = safeObject<Record<string, unknown>>(raw)
  const student = isPlainObject(obj.student) ? obj.student as Record<string, unknown> : undefined
  return {
    id: safeString(obj.id),
    studentName: safeString(obj.studentName) || (student ? getFacultyName(student) : '') || 'Unknown',
    rollNumber: safeString(obj.rollNumber) || (student ? safeString(student.rollNumber) : '') || '',
    department: safeString(obj.department) || (student ? safeString(student.department) : '') || 'General',
    status: normalizeAttendanceStatus(obj.attendanceStatus),
    time: obj.attendanceDate || obj.date
      ? formatTimeFromDate(safeString(obj.attendanceDate) || safeString(obj.date))
      : safeString(obj.time) || '',
    method: normalizeAttendanceMethod(obj.attendanceMethod),
    date: safeDate(obj.attendanceDate) || safeDate(obj.date) || '',
  }
}

export function normalizeAttendanceList(response: unknown): AttendanceRecord[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeAttendanceRecord)
}

function normalizeAttendanceStatus(status: unknown): AttendanceRecord['status'] {
  const s = safeString(status)
  if (ATTENDANCE_RECORD_STATUSES.includes(s as any)) return s as AttendanceRecord['status']
  if (s === 'half_day' || s === 'half-day') return 'leave'
  return 'absent'
}

function normalizeAttendanceMethod(method: unknown): string {
  const m = safeString(method).toLowerCase()
  const methodMap: Record<string, string> = {
    face_recognition: 'face',
    fingerprint: 'fingerprint',
    qr_code: 'qr',
    manual: 'manual',
    face: 'face',
    qr: 'qr',
  }
  return methodMap[m] || m || 'manual'
}

export function normalizeAttendanceStats(raw: unknown): AttendanceStats {
  const obj = safeObject<Record<string, unknown>>(raw)
  const summary = isPlainObject(obj.summary) ? obj.summary as Record<string, unknown> : obj
  return {
    totalStudents: safeNumber(summary.totalStudents) || safeNumber(summary.total),
    presentToday: safeNumber(summary.presentToday) || safeNumber(summary.present),
    absentToday: safeNumber(summary.absentToday) || safeNumber(summary.absent),
    lateArrivals: safeNumber(summary.lateArrivals) || safeNumber(summary.late),
    halfDay: safeNumber(summary.halfDay),
    leaveRequests: safeNumber(summary.leaveRequests) || safeNumber(summary.leave),
    attendancePercentage: safeNumber(summary.attendancePercentage) || (
      safeNumber(summary.total) > 0
        ? Math.round((safeNumber(summary.present) / safeNumber(summary.total)) * 100)
        : 0
    ),
  }
}

export function normalizeDailyAttendance(raw: unknown): DailyAttendance {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    date: safeString(obj.date) || safeString(obj.label) || '',
    present: safeNumber(obj.present),
    absent: safeNumber(obj.absent),
    late: safeNumber(obj.late),
    halfDay: safeNumber(obj.halfDay),
    leave: safeNumber(obj.leave),
  }
}

export function normalizeWeeklyTrend(raw: unknown): WeeklyTrend {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    day: safeString(obj.day) || safeString(obj.label) || '',
    percentage: safeNumber(obj.percentage),
    total: safeNumber(obj.total),
    present: safeNumber(obj.present),
  }
}

export function normalizeDepartmentAttendance(raw: unknown): DepartmentAttendance {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    department: safeString(obj.department) || safeString(obj.name) || 'Unknown',
    present: safeNumber(obj.present),
    total: safeNumber(obj.total),
    percentage: safeNumber(obj.percentage) || (
      safeNumber(obj.total) > 0 ? Math.round((safeNumber(obj.present) / safeNumber(obj.total)) * 100) : 0
    ),
  }
}

export function normalizeMonthlySummary(raw: unknown): MonthlySummary {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    month: safeString(obj.month) || safeString(obj.label) || '',
    percentage: safeNumber(obj.percentage),
    students: safeNumber(obj.students) || safeNumber(obj.total),
  }
}

export function normalizeAttendanceNotification(raw: unknown): AttendanceNotification {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    type: safeEnum(obj.type, ['low-attendance', 'correction-request', 'leave-request'] as const, 'low-attendance'),
    title: safeString(obj.title) || 'Notification',
    description: safeString(obj.description),
    studentName: safeString(obj.studentName) || 'Unknown',
    rollNumber: safeString(obj.rollNumber) || '',
    severity: safeEnum(obj.severity, ['high', 'medium', 'low'] as const, 'medium'),
  }
}

/* ─────────── ATTENDANCE HISTORY ─────────── */

const HISTORY_STATUSES = ['present', 'absent', 'late', 'half_day', 'leave'] as const
const HISTORY_METHODS = ['manual', 'face_recognition', 'face', 'fingerprint', 'qr_code', 'qr'] as const

export function normalizeHistoryRecord(raw: unknown): HistoryRecord {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    date: safeDate(obj.date) || safeDate(obj.attendanceDate) || '',
    studentName: safeString(obj.studentName) || 'Unknown',
    rollNumber: safeString(obj.rollNumber) || '',
    department: safeString(obj.department) || 'General',
    course: safeString(obj.course) || 'General',
    batch: safeString(obj.batch) || '',
    subject: safeString(obj.subject) || 'Unknown',
    status: safeEnum(obj.status as string, HISTORY_STATUSES, 'absent' as any),
    method: safeEnum(obj.method as string, HISTORY_METHODS, 'manual' as any),
    faculty: getFacultyName(obj.faculty) || getFacultyName(obj) || safeString(obj.faculty) || 'Unknown',
    time: safeString(obj.time) || formatTimeFromDate(safeString(obj.attendanceDate)),
  }
}

export function normalizeHistoryRecordList(response: unknown): HistoryRecord[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeHistoryRecord)
}

export function normalizeHistoryStats(raw: unknown): HistoryStats {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    total: safeNumber(obj.total),
    present: safeNumber(obj.present),
    absent: safeNumber(obj.absent),
    late: safeNumber(obj.late),
    halfDay: safeNumber(obj.halfDay),
    leave: safeNumber(obj.leave),
  }
}

/* ─────────── ATTENDANCE CORRECTION ─────────── */

const CORRECTION_STATUSES = ['pending', 'approved', 'rejected'] as const
const ATTENDANCE_ALL_STATUSES = ['present', 'absent', 'late', 'half_day', 'leave'] as const

export function normalizeCorrectionRequest(raw: unknown): CorrectionRequest {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    studentName: safeString(obj.studentName) || 'Unknown',
    rollNumber: safeString(obj.rollNumber) || '',
    department: safeString(obj.department) || 'General',
    subject: safeString(obj.subject) || 'Unknown',
    attendanceDate: safeDate(obj.attendanceDate) || '',
    currentStatus: safeEnum(obj.currentStatus as string, ATTENDANCE_ALL_STATUSES, 'absent' as any),
    requestedStatus: safeEnum(obj.requestedStatus as string, ATTENDANCE_ALL_STATUSES, 'present' as any),
    reason: safeString(obj.reason) || '',
    attachment: safeString(obj.attachment) || null,
    approvalStatus: safeEnum(obj.approvalStatus as string, CORRECTION_STATUSES, 'pending' as any),
    createdAt: safeDateTime(obj.createdAt) || safeDate(obj.createdAt),
    reviewedBy: safeString(obj.reviewedBy) || undefined,
    reviewedAt: safeString(obj.reviewedAt) || undefined,
    remarks: safeString(obj.remarks) || undefined,
  }
}

export function normalizeCorrectionRequestList(response: unknown): CorrectionRequest[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeCorrectionRequest)
}

/* ─────────── DASHBOARD ─────────── */

export interface NormalizedDashboardStats {
  myClasses: number
  myStudents: number
  mySubjects: number
  todayAttendanceRate: number
  assignmentsDue: number
  pendingEvaluations: number
}

export function normalizeDashboardStats(response: unknown): NormalizedDashboardStats | null {
  const obj = unwrapApiObject<Record<string, unknown>>(response)
  if (!obj) return null
  return {
    myClasses: safeNumber(obj.myClasses) || safeNumber(obj.totalClasses),
    myStudents: safeNumber(obj.myStudents) || safeNumber(obj.totalStudents),
    mySubjects: safeNumber(obj.mySubjects) || safeNumber(obj.totalSubjects),
    todayAttendanceRate: safeNumber(obj.todayAttendanceRate) || safeNumber(obj.todayAttendance),
    assignmentsDue: safeNumber(obj.assignmentsDue) || safeNumber(obj.assignments),
    pendingEvaluations: safeNumber(obj.pendingEvaluations) || safeNumber(obj.pendingWork),
  }
}

export interface AdminDashboardStats {
  totalFaculty: number
  activeFaculty: number
  totalStudents: number
  totalSubjects: number
  totalDepartments: number
  assignedCourses: number
  todayClasses: number
  pendingLeaves: number
  todayAttendance: number
  pendingAssignments: number
  upcomingHolidays: number
}

export function normalizeAdminDashboardStats(response: unknown): AdminDashboardStats {
  const obj = safeObject<Record<string, unknown>>(unwrapApiObject(response) || {})
  return {
    totalFaculty: safeNumber(obj.totalFaculty),
    activeFaculty: safeNumber(obj.activeFaculty),
    totalStudents: safeNumber(obj.totalStudents),
    totalSubjects: safeNumber(obj.totalSubjects),
    totalDepartments: safeNumber(obj.totalDepartments),
    assignedCourses: safeNumber(obj.pendingAssignments) || safeNumber(obj.assignedCourses),
    todayClasses: safeNumber(obj.totalClasses) || safeNumber(obj.todayClasses),
    pendingLeaves: safeNumber(obj.upcomingHolidays) || safeNumber(obj.pendingLeaves),
    todayAttendance: safeNumber(obj.todayAttendance),
    pendingAssignments: safeNumber(obj.pendingAssignments),
    upcomingHolidays: safeNumber(obj.upcomingHolidays),
  }
}

/* ─────────── HOLIDAYS ─────────── */

const HOLIDAY_TYPES = ['national', 'festival', 'academic', 'event'] as const
const HOLIDAY_STATUSES = ['upcoming', 'ongoing', 'completed'] as const

export function normalizeHoliday(raw: unknown): Holiday {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    name: safeString(obj.name) || safeString(obj.holidayName) || 'Holiday',
    date: safeDate(obj.date) || safeDate(obj.holidayDate) || '',
    day: safeString(obj.day) || '',
    type: safeEnum(obj.type as string, HOLIDAY_TYPES, 'national' as any),
    department: safeString(obj.department) || 'All',
    status: safeEnum(obj.status as string, HOLIDAY_STATUSES, 'upcoming' as any),
    description: safeString(obj.description) || '',
  }
}

export function normalizeHolidayList(response: unknown): Holiday[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeHoliday)
}

/* ─────────── MATERIALS ─────────── */

export interface Material {
  id: string
  title: string
  description: string
  type: string
  category: string
  url: string
  fileSize: number
  faculty: string
  course: string
  subject: string
  uploadedAt: string
  downloads: number
}

export function normalizeMaterial(raw: unknown): Material {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    title: safeString(obj.title) || safeString(obj.name) || 'Untitled',
    description: safeString(obj.description) || '',
    type: safeString(obj.type) || safeString(obj.fileType) || 'document',
    category: safeString(obj.category) || 'General',
    url: safeString(obj.url) || safeString(obj.fileUrl) || safeString(obj.path) || '',
    fileSize: safeNumber(obj.fileSize) || safeNumber(obj.size),
    faculty: getFacultyName(obj.faculty) || getFacultyName(obj) || safeString(obj.faculty) || safeString(obj.uploadedBy) || 'Unknown',
    course: safeString(obj.course) || 'General',
    subject: safeString(obj.subject) || 'General',
    uploadedAt: safeDateTime(obj.uploadedAt) || safeDate(obj.createdAt),
    downloads: safeNumber(obj.downloads) || safeNumber(obj.downloadCount),
  }
}

export function normalizeMaterialList(response: unknown): Material[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeMaterial)
}

/* ─────────── ASSIGNMENTS ─────────── */

export interface Assignment {
  id: string
  title: string
  description: string
  faculty: string
  course: string
  subject: string
  batch: string
  dueDate: string
  createdDate: string
  status: string
  totalMarks: number
  attachments: number
}

export function normalizeAssignment(raw: unknown): Assignment {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    id: safeString(obj.id),
    title: safeString(obj.title) || safeString(obj.assignmentTitle) || safeString(obj.name) || 'Untitled',
    description: safeString(obj.description) || '',
    faculty: getFacultyName(obj.faculty) || getFacultyName(obj) || safeString(obj.faculty) || safeString(obj.createdBy) || 'Unknown',
    course: safeString(obj.course) || 'General',
    subject: safeString(obj.subject) || 'General',
    batch: safeString(obj.batch) || 'General',
    dueDate: safeDate(obj.dueDate) || safeDate(obj.deadline) || '',
    createdDate: safeDate(obj.createdDate) || safeDate(obj.createdAt) || '',
    status: safeString(obj.status) || 'active',
    totalMarks: safeNumber(obj.totalMarks) || safeNumber(obj.maxMarks),
    attachments: safeNumber(obj.attachments) || safeNumber(obj.attachmentCount),
  }
}

export function normalizeAssignmentList(response: unknown): Assignment[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeAssignment)
}

/* ─────────── REPORTS ─────────── */

export interface ReportStats {
  label: string
  value: number
  change: number
  period: string
}

export interface ReportTrendPoint {
  label: string
  present: number
  absent: number
  late: number
  leave: number
}

export interface ReportSummary {
  present: number
  absent: number
  late: number
  leave: number
  total: number
  percentage: number
}

export interface NormalizedReportData {
  stats: ReportStats[]
  trends: ReportTrendPoint[]
  departmentData: DepartmentAttendance[]
  summary: ReportSummary
}

export function normalizeReportStats(raw: unknown): ReportStats {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    label: safeString(obj.label) || '',
    value: safeNumber(obj.value),
    change: safeNumber(obj.change),
    period: safeString(obj.period) || '',
  }
}

export function normalizeReportTrendPoint(raw: unknown): ReportTrendPoint {
  const obj = safeObject<Record<string, unknown>>(raw)
  return {
    label: safeString(obj.label) || '',
    present: safeNumber(obj.present),
    absent: safeNumber(obj.absent),
    late: safeNumber(obj.late),
    leave: safeNumber(obj.leave),
  }
}

export function normalizeReportData(response: unknown): NormalizedReportData {
  const obj = safeObject<Record<string, unknown>>(unwrapApiObject(response) || {})
  return {
    stats: safeArray<Record<string, unknown>>(obj.stats).map(normalizeReportStats),
    trends: safeArray<Record<string, unknown>>(obj.trends || obj.trend).map(normalizeReportTrendPoint),
    departmentData: safeArray<Record<string, unknown>>(obj.departmentData || obj.departments).map(normalizeDepartmentAttendance),
    summary: {
      present: safeNumber((obj.summary as Record<string, unknown>)?.present) || 0,
      absent: safeNumber((obj.summary as Record<string, unknown>)?.absent) || 0,
      late: safeNumber((obj.summary as Record<string, unknown>)?.late) || 0,
      leave: safeNumber((obj.summary as Record<string, unknown>)?.leave) || 0,
      total: safeNumber((obj.summary as Record<string, unknown>)?.total) || 0,
      percentage: safeNumber((obj.summary as Record<string, unknown>)?.percentage) || 0,
    },
  }
}

/* ─────────── HELPERS ─────────── */

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
  } catch {
    return dateStr
  }
}

function formatTimeFromDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return ''
  }
}

/* ─────────── BATCH LIST NORMALIZERS (convenience wrappers) ─────────── */

export function normalizeUpcomingClassList(response: unknown): UpcomingClass[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeUpcomingClass)
}

export function normalizeTimetableNotificationList(response: unknown): TimetableNotification[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeTimetableNotification)
}

export function normalizeTimetableActivityList(response: unknown): TimetableActivity[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeTimetableActivity)
}

export function normalizeAttendanceStatsList(response: unknown): AttendanceStats {
  const items = unwrapApiResponse<Record<string, unknown>>(response)
  const first = items.length > 0 ? items[0] : {}
  return normalizeAttendanceStats(first)
}

export function normalizeDailyAttendanceList(response: unknown): DailyAttendance[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeDailyAttendance)
}

export function normalizeWeeklyTrendList(response: unknown): WeeklyTrend[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeWeeklyTrend)
}

export function normalizeDepartmentAttendanceList(response: unknown): DepartmentAttendance[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeDepartmentAttendance)
}

export function normalizeMonthlySummaryList(response: unknown): MonthlySummary[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeMonthlySummary)
}

export function normalizeAttendanceNotificationList(response: unknown): AttendanceNotification[] {
  return safeArray(unwrapApiResponse<Record<string, unknown>>(response)).map(normalizeAttendanceNotification)
}
