import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdDashboard, MdPeople, MdSchool, MdCalendarMonth, MdAssignment,
  MdSettings, MdLogout, MdHowToVote, MdPerson,
  MdLibraryBooks, MdGroup, MdRateReview, MdNotifications, MdAttachMoney,
  MdEvent, MdAssessment, MdFace, MdFingerprint,
  MdQrCode, MdHistory, MdAnalytics, MdBook, MdSearch,
  MdChevronLeft, MdStars, MdAccountTree, MdEdit,
  MdCloudUpload, MdMilitaryTech, MdReceipt,
} from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']
const STUDENT_ROLES = ['STUDENT']
const PARENT_ROLES = ['PARENT']

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: string
  children?: NavItem[]
}

const adminNavItems: NavItem[] = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  {
    to: '#', icon: MdSchool, label: 'Academics',
    children: [
      { to: '/dashboard/admin/students', icon: MdPerson, label: 'Students' },
      { to: '/dashboard/admin/parents', icon: MdGroup, label: 'Parents' },
      { to: '/dashboard/faculty', icon: MdPeople, label: 'Faculty' },
      { to: '/dashboard/departments', icon: MdAccountTree, label: 'Departments' },
      { to: '/dashboard/courses', icon: MdBook, label: 'Courses' },
      { to: '/dashboard/admin/batches', icon: MdGroup, label: 'Batches' },
      { to: '/dashboard/admin/branches', icon: MdAccountTree, label: 'Branches' },
    ],
  },
  {
    to: '#', icon: MdCalendarMonth, label: 'Schedule',
    children: [
      { to: '/dashboard/schedule', icon: MdCalendarMonth, label: 'Timetable' },
      { to: '/dashboard/timetable/calendar', icon: MdCalendarMonth, label: 'Calendar' },
      { to: '/dashboard/student/timetable', icon: MdPerson, label: 'My Schedule' },
      { to: '/dashboard/faculty/timetable', icon: MdCalendarMonth, label: 'My Timetable' },
      { to: '/dashboard/holidays', icon: MdStars, label: 'Holidays' },
    ],
  },
  {
    to: '#', icon: MdHowToVote, label: 'Attendance',
    children: [
      { to: '/dashboard/attendance', icon: MdHowToVote, label: 'Overview' },
      { to: '/dashboard/attendance/manual', icon: MdHowToVote, label: 'Manual' },
      { to: '/dashboard/attendance/face-recognition', icon: MdFace, label: 'Face Recognition' },
      { to: '/dashboard/attendance/fingerprint', icon: MdFingerprint, label: 'Fingerprint' },
      { to: '/dashboard/attendance/qr', icon: MdQrCode, label: 'QR Attendance' },
      { to: '/dashboard/attendance/history', icon: MdHistory, label: 'History' },
      { to: '/dashboard/attendance/analytics', icon: MdAnalytics, label: 'Analytics' },
      { to: '/dashboard/attendance/reports', icon: MdAssessment, label: 'Reports' },
      { to: '/dashboard/attendance/correction', icon: MdEdit, label: 'Corrections' },
    ],
  },
  {
    to: '#', icon: MdAssignment, label: 'Academic',
    children: [
      { to: '/dashboard/faculty/assign', icon: MdAssignment, label: 'Assignments' },
      { to: '/dashboard/admin/exams', icon: MdEvent, label: 'Exams' },
      { to: '/dashboard/admin/fees', icon: MdAttachMoney, label: 'Fees' },
      { to: '/dashboard/admin/payments', icon: MdReceipt, label: 'Payments' },
      { to: '/dashboard/admin/certificates', icon: MdMilitaryTech, label: 'Certificates' },
    ],
  },
  { to: '/dashboard/admin/reports', icon: MdAssessment, label: 'Reports', badge: 'New' },
  { to: '/dashboard/admin/notifications', icon: MdNotifications, label: 'Notifications' },
  { to: '/dashboard/faculty/search', icon: MdSearch, label: 'Advanced Search' },
]

const facultyNavItems: NavItem[] = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard', badge: '3' },
  { to: '/dashboard/faculty/profile', icon: MdPerson, label: 'My Profile' },
  { to: '/dashboard/faculty/timetable', icon: MdCalendarMonth, label: 'My Timetable' },
  { to: '/dashboard/faculty/courses', icon: MdBook, label: 'Courses & Batches' },
  { to: '/dashboard/students', icon: MdGroup, label: 'My Students' },
  { to: '/dashboard/attendance', icon: MdHowToVote, label: 'Attendance' },
  { to: '/dashboard/assignments', icon: MdAssignment, label: 'Assignments' },
  { to: '/dashboard/materials', icon: MdLibraryBooks, label: 'Study Materials' },
  { to: '/dashboard/marks', icon: MdRateReview, label: 'Marks & Results' },
  { to: '/dashboard/registration-requests', icon: MdPerson, label: 'Registration Requests' },
  { to: '/dashboard/faculty/notifications', icon: MdNotifications, label: 'Notifications' },
  { to: '/dashboard/holidays', icon: MdStars, label: 'Holidays' },
]

const studentNavItems: NavItem[] = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard', badge: '2' },
  { to: '/dashboard/my-profile', icon: MdPerson, label: 'My Profile' },
  { to: '/dashboard/my-attendance', icon: MdHowToVote, label: 'Attendance' },
  { to: '/dashboard/student/timetable', icon: MdCalendarMonth, label: 'Timetable' },
  { to: '/dashboard/my-assignments', icon: MdAssignment, label: 'Assignments' },
  { to: '/dashboard/assignment-submission', icon: MdCloudUpload, label: 'Submission' },
  { to: '/dashboard/my-materials', icon: MdLibraryBooks, label: 'Study Materials' },
  { to: '/dashboard/exam-schedule', icon: MdEvent, label: 'Exam Schedule' },
  { to: '/dashboard/my-results', icon: MdRateReview, label: 'Results' },
  { to: '/dashboard/my-certificates', icon: MdMilitaryTech, label: 'Certificates' },
  { to: '/dashboard/fee-status', icon: MdAttachMoney, label: 'Fee Details' },
  { to: '/dashboard/my-course', icon: MdBook, label: 'Course Details' },
  { to: '/dashboard/my-batch', icon: MdGroup, label: 'Batch Details' },
  { to: '/dashboard/notifications', icon: MdNotifications, label: 'Notifications' },
]

const parentNavItems: NavItem[] = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { to: '/dashboard/child-profile', icon: MdPerson, label: 'Child Profile' },
  { to: '/dashboard/child-attendance', icon: MdHowToVote, label: 'Attendance' },
  { to: '/dashboard/child-timetable', icon: MdCalendarMonth, label: 'Timetable' },
  { to: '/dashboard/child-assignments', icon: MdAssignment, label: 'Assignments' },
  { to: '/dashboard/child-materials', icon: MdLibraryBooks, label: 'Study Materials' },
  { to: '/dashboard/child-results', icon: MdRateReview, label: 'Exam Results' },
  { to: '/dashboard/child-fees', icon: MdAttachMoney, label: 'Fee Details' },
  { to: '/dashboard/payment-history', icon: MdReceipt, label: 'Payment History' },
  { to: '/dashboard/parent-notifications', icon: MdNotifications, label: 'Notifications' },
  { to: '/dashboard/parent-profile', icon: MdPerson, label: 'Profile' },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

function NavGroup({ item }: { item: NavItem; isOpen: boolean }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(
    item.children?.some(c => location.pathname === c.to || location.pathname.startsWith(c.to + '/')) ?? false
  )
  const hasActiveChild = item.children?.some(
    c => location.pathname === c.to || location.pathname.startsWith(c.to + '/')
  )

  if (!item.children) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/dashboard'}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-primary-50 text-primary-700 shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 bg-primary-50 rounded-xl"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <item.icon className={`relative text-lg ${isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
            <span className="relative">{item.label}</span>
            {item.badge && (
              <span className="relative ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          hasActiveChild
            ? 'text-primary-700 bg-primary-50/50'
            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
        }`}
      >
        <item.icon className={`text-lg ${hasActiveChild ? 'text-primary-500' : 'text-neutral-400'}`} />
        <span className="flex-1 text-left">{item.label}</span>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-neutral-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-3 border-l-2 border-neutral-100 space-y-0.5 mt-0.5">
              {item.children.map(child => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                    }`
                  }
                >
                  <child.icon className="text-base" />
                  {child.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const role = user?.role || ''
  const isAdmin = ADMIN_ROLES.includes(role)
  const isStudent = STUDENT_ROLES.includes(role)
  const isParent = PARENT_ROLES.includes(role)
  const navItems = isAdmin ? adminNavItems : isStudent ? studentNavItems : isParent ? parentNavItems : facultyNavItems
  const userName = user?.name || user?.email || 'User'
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
          width: isOpen ? 280 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 h-screen bg-white border-r border-neutral-200/80 shadow-sm flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-md shadow-primary-200">
              <MdSchool className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-800 leading-tight gradient-text">EduManage</h1>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">CIMS Platform</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors hidden lg:block"
          >
            <MdChevronLeft className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {navItems.map((item) => (
            <NavGroup key={item.to + item.label} item={item} isOpen={isOpen} />
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-neutral-100 space-y-0.5">
          <NavLink
            to="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-all duration-200"
          >
            <MdSettings className="text-lg text-neutral-400" />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 w-full transition-all duration-200"
          >
            <MdLogout className="text-lg" />
            Logout
          </button>
          <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-neutral-50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-700 truncate">{userName}</p>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{role}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
