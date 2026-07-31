import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import StatisticsSection from '../components/StatisticsSection'
import QuickActions from '../components/QuickActions'
import RecentActivities from '../components/RecentActivities'
import UpcomingSchedule from '../components/UpcomingSchedule'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { GiCrown } from 'react-icons/gi'
import {
  MdSchool, MdPeople, MdHowToVote, MdAssignment, MdAttachMoney,
  MdEvent, MdNotifications, MdBook, MdGroup, MdCalendarMonth,
  MdTrendingUp, MdStars, MdCheckCircle, MdRateReview, MdPerson, MdAnalytics,
  MdLock, MdPayment,
} from 'react-icons/md'
import { useAdminDashboard, useFacultyDashboard, useStudentDashboard, useParentDashboard } from '../hooks/useReactQuery'
import { subscriptionService } from '../services/subscription.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']
const FACULTY_ROLES = ['FACULTY', 'HOD']
const STUDENT_ROLES = ['STUDENT']
const PARENT_ROLES = ['PARENT']

function LoadingSection() {
  return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { data: stats, isLoading, isError, error, refetch } = useAdminDashboard()
  const [subStatus, setSubStatus] = useState<any>(null)
  const [subLoaded, setSubLoaded] = useState(false)

  useEffect(() => {
    subscriptionService.getStatus().then((res) => {
      setSubStatus(res.data?.data || null)
    }).catch(() => {/* ignore */}).finally(() => setSubLoaded(true))
  }, [])

  if (isLoading) return <LoadingSection />
  if (isError) return <ErrorMessage message={(error as Error)?.message || 'Failed to load dashboard'} onRetry={refetch} />

  const adminStats = stats || {} as any
  const isPaused = subStatus?.isPaused
  const isTrial = subStatus?.isTrial
  const daysLeft = subStatus?.daysLeft || 0
  const showTrialWarning = isTrial && daysLeft <= 30 && daysLeft > 0

  const statCards = [
    { icon: MdSchool, label: 'Total Students', value: String(adminStats.totalStudents || '0'), change: '', color: 'text-primary-600', bg: 'bg-primary-50' },
    { icon: MdPeople, label: 'Total Faculty', value: String(adminStats.totalFaculty || '0'), change: `${adminStats.activeFaculty || 0} active`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: MdGroup, label: 'Total Subjects', value: String(adminStats.totalSubjects || '0'), change: '', color: 'text-violet-600', bg: 'bg-violet-50' },
    { icon: MdHowToVote, label: "Today's Attendance", value: String(adminStats.todayAttendance || '0'), change: 'records', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: MdAssignment, label: 'Active Assignments', value: String(adminStats.pendingAssignments || '0'), change: '', color: 'text-rose-600', bg: 'bg-rose-50' },
    { icon: MdStars, label: 'Upcoming Holidays', value: String(adminStats.upcomingHolidays || '0'), change: '', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {subLoaded && showTrialWarning && (
        <motion.div variants={itemVariants} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-3">
            <GiCrown className="text-amber-600 shrink-0" size={24} />
            <div>
              <p className="text-sm font-semibold text-amber-800">Trial ends in {daysLeft} day{daysLeft > 1 ? 's' : ''}</p>
              <p className="text-xs text-amber-600 mt-0.5">Upgrade to Pro to continue using all features without interruption.</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard/subscription')} className="btn btn-primary btn-sm shrink-0">
            <MdPayment size={16} /> Upgrade
          </button>
        </motion.div>
      )}

      {subLoaded && isPaused && (
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 text-center">
          <MdLock className="mx-auto mb-4 text-4xl text-amber-400" />
          <h2 className="text-xl font-bold mb-2">Subscription Paused</h2>
          <p className="text-sm text-gray-300 mb-6 max-w-md mx-auto">
            Your free trial has ended. Subscribe to a plan to reactivate your dashboard and continue managing your institute.
          </p>
          <button onClick={() => navigate('/dashboard/subscription')} className="btn bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20">
            <GiCrown size={18} /> View Plans
          </button>
        </motion.div>
      )}

      {(!subLoaded || !isPaused) ? (
      <><motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Welcome back! Here's your institute overview.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('/dashboard/registration-requests')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors">
            <MdPerson size={18} />
            <span className="hidden sm:inline">Registration Requests</span>
            <span className="sm:hidden">Requests</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-medium">
            <MdTrendingUp />
            <span className="hidden sm:inline">All systems operational</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon className={`text-xl ${stat.color}`} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            {stat.change && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-success">
                <MdTrendingUp className="text-sm" />
                {stat.change}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-800">Attendance Trends</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Weekly attendance overview across all batches</p>
            </div>
            <select className="select-field w-auto text-sm py-1.5">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Semester</option>
            </select>
          </div>
          <StatisticsSection />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Today's Schedule</h2>
            <MdCalendarMonth className="text-xl text-primary-500" />
          </div>
          <UpcomingSchedule />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Recent Activities</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')}>View All</button>
          </div>
          <RecentActivities />
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Upcoming Holidays</h2>
            <MdStars className="text-xl text-amber-500" />
          </div>
          {adminStats.holidays?.length > 0 ? (
            <div className="space-y-3">
              {adminStats.holidays.slice(0, 5).map((h: any, i: number) => (
                <div key={h.id ?? `holiday-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <MdStars className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{h.holidayName || h.name || h.title || 'Holiday'}</p>
                    <p className="text-xs text-neutral-500">{h.startDate ? new Date(h.startDate).toLocaleDateString() : h.date ? new Date(h.date).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No upcoming holidays</p>
          )}
        </div>
      </motion.div>
      </>) : null}
    </motion.div>
  )
}

function FacultyDashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useFacultyDashboard()

  if (isLoading) return <LoadingSection />
  if (isError) return <ErrorMessage message={(error as Error)?.message || 'Failed to load dashboard'} onRetry={refetch} />

  const s = stats || {} as any

  const statCards = [
    { icon: MdHowToVote, label: 'My Classes', value: String(s.myClasses || '0'), change: s.myClasses > 0 ? s.myClasses > 1 ? 'classes' : 'class' : 'Total', color: 'from-primary-500 to-primary-400', bg: 'bg-primary-50' },
    { icon: MdPeople, label: 'My Students', value: String(s.myStudents || '0'), change: s.myStudents > 0 ? s.myStudents > 1 ? 'students' : 'student' : 'Across batches', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50' },
    { icon: MdBook, label: 'My Subjects', value: String(s.mySubjects || '0'), change: s.mySubjects > 0 ? s.mySubjects > 1 ? 'subjects' : 'subject' : 'This semester', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50' },
    { icon: MdHowToVote, label: 'Today Attendance', value: String(s.todayAttendanceRate || '0'), change: s.todayAttendanceRate > 0 ? (typeof s.todayAttendanceRate === 'number' && s.todayAttendanceRate <= 100 ? `${s.todayAttendanceRate}%` : 'records') : 'records', color: 'from-amber-500 to-amber-400', bg: 'bg-amber-50' },
    { icon: MdAssignment, label: 'Assignments Due', value: String(s.assignmentsDue || '0'), change: s.assignmentsDue > 0 ? s.assignmentsDue > 1 ? 'pending' : 'due' : 'Active', color: 'from-rose-500 to-rose-400', bg: 'bg-rose-50' },
    { icon: MdRateReview, label: 'Pending Evaluations', value: String(s.pendingEvaluations || '0'), change: s.pendingEvaluations > 0 ? s.pendingEvaluations > 1 ? 'to grade' : 'pending' : 'To grade', color: 'from-cyan-500 to-cyan-400', bg: 'bg-cyan-50' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Faculty Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your classes, attendance, and assignments.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 text-sm font-medium w-fit">
          <MdCheckCircle className="text-primary-500" />
          <span>{s.myClasses || 0} classes</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon className={`text-xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="mt-2 text-xs font-medium text-neutral-400">{stat.change}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
            <QuickActions />
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">My Schedule</h2>
            <UpcomingSchedule />
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Recent Activities</h2>
            <RecentActivities />
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">Attendance Today</h2>
              <MdAnalytics className="text-xl text-primary-500" />
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600">{s.todayAttendanceRate || 0}</div>
                <p className="text-sm text-neutral-500 mt-1">records today</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function StudentDashboard() {
  const { user } = useAuth()
  const studentId = user?.id || user?.studentId || ''
  const { data: stats, isLoading, isError, error, refetch } = useStudentDashboard(studentId)

  if (isLoading) return <LoadingSection />
  if (isError) return <ErrorMessage message={(error as Error)?.message || 'Failed to load dashboard'} onRetry={refetch} />

  const s = stats || {} as any

  const statCards = [
    { icon: MdHowToVote, label: 'Attendance', value: `${s.attendanceRate || 0}%`, change: '', color: 'from-primary-500 to-primary-400', bg: 'bg-primary-50' },
    { icon: MdEvent, label: 'Upcoming Exams', value: String(s.upcomingExams?.length || '0'), change: '', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50' },
    { icon: MdAssignment, label: 'Pending Assignments', value: String(s.pendingAssignments || '0'), change: '', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50' },
    { icon: MdAttachMoney, label: 'Pending Fees', value: String(s.pendingFees || '0'), change: '', color: 'from-amber-500 to-amber-400', bg: 'bg-amber-50' },
    { icon: MdNotifications, label: 'Notifications', value: String(s.notifications || '0'), change: '', color: 'from-rose-500 to-rose-400', bg: 'bg-rose-50' },
    { icon: MdSchool, label: 'Enrolled', value: s.enrollment?.course || 'N/A', change: `Sem ${s.enrollment?.semester || '-'}`, color: 'from-cyan-500 to-cyan-400', bg: 'bg-cyan-50' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Track your academic progress and stay updated.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon className={`text-xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="mt-2 text-xs font-medium text-neutral-400">{stat.change}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Recent Activities</h2>
          <RecentActivities />
        </div>
      </motion.div>
    </motion.div>
  )
}

function ParentDashboard() {
  const { user } = useAuth()
  const parentId = user?.id || ''
  const { data: stats, isLoading, isError, error, refetch } = useParentDashboard(parentId)

  if (isLoading) return <LoadingSection />
  if (isError) return <ErrorMessage message={(error as Error)?.message || 'Failed to load dashboard'} onRetry={refetch} />

  const s = stats || {} as any

  const statCards = [
    { icon: MdHowToVote, label: 'Attendance', value: `${s.attendanceRate || 0}%`, change: '', color: 'from-primary-500 to-primary-400', bg: 'bg-primary-50' },
    { icon: MdEvent, label: 'Upcoming Exams', value: String(s.upcomingExams?.length || '0'), change: '', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50' },
    { icon: MdAttachMoney, label: 'Pending Fees', value: String(s.pendingFees || '0'), change: '', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50' },
    { icon: MdAssignment, label: 'Pending Assignments', value: String(s.pendingAssignments || '0'), change: '', color: 'from-amber-500 to-amber-400', bg: 'bg-amber-50' },
    { icon: MdSchool, label: 'Student', value: s.studentName || 'N/A', change: s.studentRoll || '', color: 'from-rose-500 to-rose-400', bg: 'bg-rose-50' },
    { icon: MdGroup, label: 'Course', value: s.studentCourse || 'N/A', change: `Sem ${s.studentSemester || '-'}`, color: 'from-cyan-500 to-cyan-400', bg: 'bg-cyan-50' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Parent Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Stay informed about your child's academic journey.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon className={`text-xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="mt-2 text-xs font-medium text-neutral-400">{stat.change}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Recent Activities</h2>
          <RecentActivities />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role || ''
  const isAdmin = ADMIN_ROLES.includes(role)
  const isFaculty = FACULTY_ROLES.includes(role)
  const isStudent = STUDENT_ROLES.includes(role)
  const isParent = PARENT_ROLES.includes(role)

  if (isAdmin) return <AdminDashboard />
  if (isFaculty) return <FacultyDashboard />
  if (isStudent) return <StudentDashboard />
  if (isParent) return <ParentDashboard />

  return <FacultyDashboard />
}
