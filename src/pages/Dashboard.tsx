import { motion } from 'framer-motion'
import { MdPeople, MdVerifiedUser, MdSchool, MdLibraryBooks, MdCalendarMonth, MdPendingActions } from 'react-icons/md'
import DashboardCard from '../components/DashboardCard'
import StatisticsSection from '../components/StatisticsSection'
import RecentActivities from '../components/RecentActivities'
import UpcomingSchedule from '../components/UpcomingSchedule'
import QuickActions from '../components/QuickActions'
import { useAdminDashboard } from '../hooks/useReactQuery'

export default function Dashboard() {
  const { data: stats, isLoading, isError, error } = useAdminDashboard()
  const safe = stats ?? {
    totalFaculty: 0, activeFaculty: 0, totalDepartments: 0,
    assignedCourses: 0, todayClasses: 0, pendingLeaves: 0,
  }

  const cards = [
    { title: 'Total Faculty', value: safe.totalFaculty, icon: MdPeople, color: '#3b82f6', bgColor: '#dbeafe' },
    { title: 'Active Faculty', value: safe.activeFaculty, icon: MdVerifiedUser, color: '#10b981', bgColor: '#d1fae5' },
    { title: 'Departments', value: safe.totalDepartments, icon: MdSchool, color: '#8b5cf6', bgColor: '#ede9fe' },
    { title: 'Assigned Courses', value: safe.assignedCourses, icon: MdLibraryBooks, color: '#f59e0b', bgColor: '#fef3c7' },
    { title: "Today's Classes", value: safe.todayClasses, icon: MdCalendarMonth, color: '#ec4899', bgColor: '#fce7f3' },
    { title: 'Pending Leaves', value: safe.pendingLeaves, icon: MdPendingActions, color: '#ef4444', bgColor: '#fee2e2' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Last updated: {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </motion.div>

      {isError ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-3">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{error instanceof Error ? error.message : 'Failed to load dashboard data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {cards.map((card, index) => (
            <DashboardCard key={card.title} {...card} index={index} />
          ))}
        </div>
      )}

      <StatisticsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingSchedule />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RecentActivities />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
