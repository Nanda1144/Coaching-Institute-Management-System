import { motion } from 'framer-motion'
import { MdPeople, MdVerifiedUser, MdSchool, MdLibraryBooks, MdCalendarMonth, MdPendingActions } from 'react-icons/md'
import DashboardCard from '../components/DashboardCard'
import StatisticsSection from '../components/StatisticsSection'
import RecentActivities from '../components/RecentActivities'
import UpcomingSchedule from '../components/UpcomingSchedule'
import QuickActions from '../components/QuickActions'
import { dashboardStats } from '../data/dashboardData'

const cards = [
  { title: 'Total Faculty', value: dashboardStats.totalFaculty, icon: MdPeople, color: '#3b82f6', bgColor: '#dbeafe' },
  { title: 'Active Faculty', value: dashboardStats.activeFaculty, icon: MdVerifiedUser, color: '#10b981', bgColor: '#d1fae5' },
  { title: 'Departments', value: dashboardStats.totalDepartments, icon: MdSchool, color: '#8b5cf6', bgColor: '#ede9fe' },
  { title: 'Assigned Courses', value: dashboardStats.assignedCourses, icon: MdLibraryBooks, color: '#f59e0b', bgColor: '#fef3c7' },
  { title: "Today's Classes", value: dashboardStats.todayClasses, icon: MdCalendarMonth, color: '#ec4899', bgColor: '#fce7f3' },
  { title: 'Pending Leaves', value: dashboardStats.pendingLeaves, icon: MdPendingActions, color: '#ef4444', bgColor: '#fee2e2' },
]

export default function Dashboard() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => (
          <DashboardCard key={card.title} {...card} index={index} />
        ))}
      </div>

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
