import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import StatisticsSection from '../components/StatisticsSection'
import QuickActions from '../components/QuickActions'
import RecentActivities from '../components/RecentActivities'
import UpcomingSchedule from '../components/UpcomingSchedule'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import {
  MdSchool, MdPeople, MdHowToVote, MdAssignment, MdAttachMoney,
  MdEvent, MdNotifications, MdBook, MdGroup, MdCalendarMonth,
  MdTrendingUp, MdStars, MdCheckCircle, MdRateReview,
} from 'react-icons/md'
import { useAdminDashboard, useFacultyDashboard, useStudentDashboard, useParentDashboard } from '../hooks/useReactQuery'

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

  if (isLoading) return <LoadingSection />
  if (isError) return <ErrorMessage message={(error as Error)?.message || 'Failed to load dashboard'} onRetry={refetch} />

  const adminStats = stats || {} as any

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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Welcome back! Here's your institute overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-medium">
            <MdTrendingUp />
            <span>All systems operational</span>
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
                <div key={h.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <MdStars className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{h.holidayName || h.name}</p>
                    <p className="text-xs text-neutral-500">{h.startDate ? new Date(h.startDate).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No upcoming holidays</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function FacultyDashboard() {
  const { user } = useAuth()
  const { data: stats, isLoading, isError, error, refetch } = useFacultyDashboard()

  if (isLoading) return <LoadingSection />
  if (isError) return <ErrorMessage message={(error as Error)?.message || 'Failed to load dashboard'} onRetry={refetch} />

  const s = stats || {} as any

  const statCards = [
    { icon: MdHowToVote, label: 'My Classes', value: String(s.myClasses || '0'), change: 'Total', color: 'from-primary-500 to-primary-400', bg: 'bg-primary-50' },
    { icon: MdPeople, label: 'My Students', value: String(s.myStudents || '0'), change: 'Across batches', color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-50' },
    { icon: MdBook, label: 'My Subjects', value: String(s.mySubjects || '0'), change: 'This semester', color: 'from-violet-500 to-violet-400', bg: 'bg-violet-50' },
    { icon: MdHowToVote, label: 'Today Attendance', value: String(s.todayAttendanceRate || '0'), change: 'records', color: 'from-amber-500 to-amber-400', bg: 'bg-amber-50' },
    { icon: MdAssignment, label: 'Assignments Due', value: String(s.assignmentsDue || '0'), change: 'Active', color: 'from-rose-500 to-rose-400', bg: 'bg-rose-50' },
    { icon: MdRateReview, label: 'Pending Evaluations', value: String(s.pendingEvaluations || '0'), change: 'To grade', color: 'from-cyan-500 to-cyan-400', bg: 'bg-cyan-50' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Faculty Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your classes, attendance, and assignments.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 text-sm font-medium">
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
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Recent Activities</h2>
            <RecentActivities />
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
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
