import { useState, useEffect, lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import LandingPage from './features/Main_interface/pages/LandingPage'
import LoginPage from './features/Main_interface/pages/LoginPage'
import SignupPage from './features/Main_interface/pages/SignupPage'
import StudentRegistrationPage from './features/Main_interface/pages/StudentRegistrationPage'
import ForgotPasswordPage from './features/Main_interface/pages/ForgotPasswordPage'
import ResetPasswordPage from './features/Main_interface/pages/ResetPasswordPage'
import WorkflowPage from './features/Main_interface/pages/WorkflowPage'
import DevelopersPage from './features/Main_interface/pages/DevelopersPage'
import AboutPage from './features/Main_interface/pages/AboutPage'
import ContactPage from './features/Main_interface/pages/ContactPage'
import HeroBackground from './features/Main_interface/animations/HeroBackground'
import DepartmentsPage from './pages/DepartmentsPage'
import CoursesPage from './pages/CoursesPage'
import AssignmentsPage from './pages/AssignmentsPage'
import SettingsPage from './pages/SettingsPage'
import { useAuth } from './contexts/AuthContext'

const FacultyListPage = lazy(() => import('./features/faculty/pages/FacultyListPage'))
const AddFacultyPage = lazy(() => import('./features/add-faculty/pages/AddFacultyPage'))
const EditFacultyPage = lazy(() => import('./features/add-faculty/pages/EditFacultyPage'))
const FacultyProfilePage = lazy(() => import('./features/faculty-profile/pages/FacultyProfilePage'))
const FacultyAssignmentPage = lazy(() => import('./features/faculty-assignment/pages/FacultyAssignmentPage'))
const FacultyTransferPage = lazy(() => import('./features/faculty-transfer/pages/FacultyTransferPage'))
const FacultySearchPage = lazy(() => import('./features/faculty-search/pages/FacultySearchPage'))
const TimetableDashboard = lazy(() => import('./features/timetable/pages/TimetableDashboard'))
const CreateTimetablePage = lazy(() => import('./features/create-timetable/pages/CreateTimetablePage'))
const EditTimetablePage = lazy(() => import('./features/create-timetable/pages/EditTimetablePage'))
const InteractiveCalendarPage = lazy(() => import('./features/interactive-calendar/pages/InteractiveCalendarPage'))
const HolidayManagementPage = lazy(() => import('./features/holiday-management/pages/HolidayManagementPage'))
const StudentTimetablePage = lazy(() => import('./features/student-timetable/pages/StudentTimetablePage'))
const FacultyTimetablePage = lazy(() => import('./features/faculty-timetable/pages/FacultyTimetablePage'))
const AttendanceDashboard = lazy(() => import('./features/attendance/pages/AttendanceDashboard'))
const ManualAttendancePage = lazy(() => import('./features/manual-attendance/pages/ManualAttendancePage'))
const FaceRecognitionPage = lazy(() => import('./features/face-recognition/pages/FaceRecognitionPage'))
const FingerprintAttendancePage = lazy(() => import('./features/fingerprint-attendance/pages/FingerprintAttendancePage'))
const QRAttendancePage = lazy(() => import('./features/qr-attendance/pages/QRAttendancePage'))
const AttendanceHistoryPage = lazy(() => import('./features/attendance-history/pages/AttendanceHistoryPage'))
const AttendanceReportsPage = lazy(() => import('./features/attendance-reports/pages/AttendanceReportsPage'))
const AttendanceAnalyticsPage = lazy(() => import('./features/attendance-analytics/pages/AttendanceAnalyticsPage'))
const CorrectionManagementPage = lazy(() => import('./features/attendance-correction/pages/CorrectionManagementPage'))
const FacultyStudentsPage = lazy(() => import('./pages/FacultyStudentsPage'))
const FacultyMarksPage = lazy(() => import('./pages/FacultyMarksPage'))
const FacultyMaterialsPage = lazy(() => import('./pages/FacultyMaterialsPage'))
const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage'))
const StudentAttendancePage = lazy(() => import('./pages/StudentAttendancePage'))
const StudentAssignmentsPage = lazy(() => import('./pages/StudentAssignmentsPage'))
const StudentMaterialsPage = lazy(() => import('./pages/StudentMaterialsPage'))
const StudentExamSchedulePage = lazy(() => import('./pages/StudentExamSchedulePage'))
const StudentResultsPage = lazy(() => import('./pages/StudentResultsPage'))
const StudentFeeStatusPage = lazy(() => import('./pages/StudentFeeStatusPage'))
const StudentNotificationsPage = lazy(() => import('./pages/StudentNotificationsPage'))
const StudentAssignmentSubmissionPage = lazy(() => import('./pages/StudentAssignmentSubmissionPage'))
const StudentCertificatesPage = lazy(() => import('./pages/StudentCertificatesPage'))
const StudentCourseDetailsPage = lazy(() => import('./pages/StudentCourseDetailsPage'))
const StudentBatchDetailsPage = lazy(() => import('./pages/StudentBatchDetailsPage'))
const ParentChildProfilePage = lazy(() => import('./pages/ParentChildProfilePage'))
const ParentAttendancePage = lazy(() => import('./pages/ParentAttendancePage'))
const ParentTimetablePage = lazy(() => import('./pages/ParentTimetablePage'))
const ParentAssignmentsPage = lazy(() => import('./pages/ParentAssignmentsPage'))
const ParentMaterialsPage = lazy(() => import('./pages/ParentMaterialsPage'))
const ParentResultsPage = lazy(() => import('./pages/ParentResultsPage'))
const ParentFeesPage = lazy(() => import('./pages/ParentFeesPage'))
const ParentNotificationsPage = lazy(() => import('./pages/ParentNotificationsPage'))
const ParentProfilePage = lazy(() => import('./pages/ParentProfilePage'))
const ParentPaymentHistoryPage = lazy(() => import('./pages/ParentPaymentHistoryPage'))
const FacultyProfileSelfPage = lazy(() => import('./pages/FacultyProfilePage'))
const FacultyCoursesBatchesPage = lazy(() => import('./pages/FacultyCoursesBatchesPage'))
const FacultyNotificationsPage = lazy(() => import('./pages/FacultyNotificationsPage'))
const AdminStudentsPage = lazy(() => import('./pages/AdminStudentsPage'))
const AdminParentsPage = lazy(() => import('./pages/AdminParentsPage'))
const AdminBatchesPage = lazy(() => import('./pages/AdminBatchesPage'))
const AdminExamsPage = lazy(() => import('./pages/AdminExamsPage'))
const AdminFeesPage = lazy(() => import('./pages/AdminFeesPage'))
const AdminReportsPage = lazy(() => import('./pages/AdminReportsPage'))
const AdminNotificationsPage = lazy(() => import('./pages/AdminNotificationsPage'))
const AdminPaymentsPage = lazy(() => import('./pages/AdminPaymentsPage'))
const AdminBranchesPage = lazy(() => import('./pages/AdminBranchesPage'))
const AdminCertificatesPage = lazy(() => import('./pages/AdminCertificatesPage'))
const AdminPermissionsPage = lazy(() => import('./pages/AdminPermissionsPage'))
const RegistrationRequestsPage = lazy(() => import('./pages/RegistrationRequestsPage'))

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Verifying session...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function RoleGuard({ children, roles }: { children: ReactNode; roles: string[] }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

function HomeRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <LandingPage />
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    </div>
  )
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/holidays" element={<HolidayManagementPage />} />
      <Route path="/student/timetable" element={<StudentTimetablePage />} />
      <Route path="/faculty/timetable" element={<FacultyTimetablePage />} />
      <Route path="/attendance" element={<AttendanceDashboard />} />
      <Route path="/attendance/manual" element={<ManualAttendancePage />} />
      <Route path="/attendance/face-recognition" element={<FaceRecognitionPage />} />
      <Route path="/attendance/fingerprint" element={<FingerprintAttendancePage />} />
      <Route path="/attendance/qr" element={<QRAttendancePage />} />
      <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
      <Route path="/attendance/analytics" element={<AttendanceAnalyticsPage />} />
      <Route path="/assignments" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY']}><AssignmentsPage /></RoleGuard>} />
      <Route path="/students" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY']}><FacultyStudentsPage /></RoleGuard>} />
      <Route path="/materials" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY']}><FacultyMaterialsPage /></RoleGuard>} />
      <Route path="/marks" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY']}><FacultyMarksPage /></RoleGuard>} />
      <Route path="/registration-requests" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY']}><RegistrationRequestsPage /></RoleGuard>} />
      <Route path="/faculty" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><FacultyListPage /></RoleGuard>} />
      <Route path="/faculty/add" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AddFacultyPage /></RoleGuard>} />
      <Route path="/faculty/profile/:id" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><FacultyProfilePage /></RoleGuard>} />
      <Route path="/faculty/edit/:id" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><EditFacultyPage /></RoleGuard>} />
      <Route path="/faculty/assign" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><FacultyAssignmentPage /></RoleGuard>} />
      <Route path="/faculty/transfer" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><FacultyTransferPage /></RoleGuard>} />
      <Route path="/faculty/search" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><FacultySearchPage /></RoleGuard>} />
      <Route path="/departments" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><DepartmentsPage /></RoleGuard>} />
      <Route path="/courses" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><CoursesPage /></RoleGuard>} />
      <Route path="/schedule" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><TimetableDashboard /></RoleGuard>} />
      <Route path="/timetable" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><TimetableDashboard /></RoleGuard>} />
      <Route path="/timetable/create" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><CreateTimetablePage /></RoleGuard>} />
      <Route path="/timetable/calendar" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><InteractiveCalendarPage /></RoleGuard>} />
      <Route path="/timetable/edit/:id" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><EditTimetablePage /></RoleGuard>} />
      <Route path="/attendance/reports" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AttendanceReportsPage /></RoleGuard>} />
      <Route path="/attendance/correction" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><CorrectionManagementPage /></RoleGuard>} />
      <Route path="/admin/students" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminStudentsPage /></RoleGuard>} />
      <Route path="/admin/parents" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminParentsPage /></RoleGuard>} />
      <Route path="/admin/batches" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminBatchesPage /></RoleGuard>} />
      <Route path="/admin/exams" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminExamsPage /></RoleGuard>} />
      <Route path="/admin/fees" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminFeesPage /></RoleGuard>} />
      <Route path="/admin/reports" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminReportsPage /></RoleGuard>} />
      <Route path="/admin/notifications" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminNotificationsPage /></RoleGuard>} />
      <Route path="/admin/payments" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminPaymentsPage /></RoleGuard>} />
      <Route path="/admin/branches" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminBranchesPage /></RoleGuard>} />
      <Route path="/admin/certificates" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminCertificatesPage /></RoleGuard>} />
      <Route path="/admin/permissions" element={<RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><AdminPermissionsPage /></RoleGuard>} />
      <Route path="/my-profile" element={<RoleGuard roles={['STUDENT']}><StudentProfilePage /></RoleGuard>} />
      <Route path="/my-attendance" element={<RoleGuard roles={['STUDENT']}><StudentAttendancePage /></RoleGuard>} />
      <Route path="/my-assignments" element={<RoleGuard roles={['STUDENT']}><StudentAssignmentsPage /></RoleGuard>} />
      <Route path="/my-materials" element={<RoleGuard roles={['STUDENT']}><StudentMaterialsPage /></RoleGuard>} />
      <Route path="/exam-schedule" element={<RoleGuard roles={['STUDENT']}><StudentExamSchedulePage /></RoleGuard>} />
      <Route path="/my-results" element={<RoleGuard roles={['STUDENT']}><StudentResultsPage /></RoleGuard>} />
      <Route path="/fee-status" element={<RoleGuard roles={['STUDENT']}><StudentFeeStatusPage /></RoleGuard>} />
      <Route path="/notifications" element={<RoleGuard roles={['STUDENT']}><StudentNotificationsPage /></RoleGuard>} />
      <Route path="/assignment-submission" element={<RoleGuard roles={['STUDENT']}><StudentAssignmentSubmissionPage /></RoleGuard>} />
      <Route path="/my-certificates" element={<RoleGuard roles={['STUDENT']}><StudentCertificatesPage /></RoleGuard>} />
      <Route path="/my-course" element={<RoleGuard roles={['STUDENT']}><StudentCourseDetailsPage /></RoleGuard>} />
      <Route path="/my-batch" element={<RoleGuard roles={['STUDENT']}><StudentBatchDetailsPage /></RoleGuard>} />
      <Route path="/faculty/profile" element={<RoleGuard roles={['FACULTY', 'HOD']}><FacultyProfileSelfPage /></RoleGuard>} />
      <Route path="/faculty/courses" element={<RoleGuard roles={['FACULTY', 'HOD']}><FacultyCoursesBatchesPage /></RoleGuard>} />
      <Route path="/faculty/notifications" element={<RoleGuard roles={['FACULTY', 'HOD']}><FacultyNotificationsPage /></RoleGuard>} />
      <Route path="/child-profile" element={<RoleGuard roles={['PARENT']}><ParentChildProfilePage /></RoleGuard>} />
      <Route path="/child-attendance" element={<RoleGuard roles={['PARENT']}><ParentAttendancePage /></RoleGuard>} />
      <Route path="/child-timetable" element={<RoleGuard roles={['PARENT']}><ParentTimetablePage /></RoleGuard>} />
      <Route path="/child-assignments" element={<RoleGuard roles={['PARENT']}><ParentAssignmentsPage /></RoleGuard>} />
      <Route path="/child-materials" element={<RoleGuard roles={['PARENT']}><ParentMaterialsPage /></RoleGuard>} />
      <Route path="/child-results" element={<RoleGuard roles={['PARENT']}><ParentResultsPage /></RoleGuard>} />
      <Route path="/child-fees" element={<RoleGuard roles={['PARENT']}><ParentFeesPage /></RoleGuard>} />
      <Route path="/payment-history" element={<RoleGuard roles={['PARENT']}><ParentPaymentHistoryPage /></RoleGuard>} />
      <Route path="/parent-notifications" element={<RoleGuard roles={['PARENT']}><ParentNotificationsPage /></RoleGuard>} />
      <Route path="/parent-profile" element={<RoleGuard roles={['PARENT']}><ParentProfilePage /></RoleGuard>} />
      <Route path="*" element={<div className="flex items-center justify-center min-h-[60vh]"><div className="text-center"><h1 className="text-6xl font-bold text-neutral-200 mb-4">404</h1><p className="text-neutral-500">Page not found</p></div></div>} />
    </Routes>
  )
}

function DashboardLayout() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Suspense fallback={<SuspenseFallback />}>
          <DashboardRoutes />
        </Suspense>
      </MainLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <HeroBackground />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/student-registration" element={<StudentRegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<div className="min-h-screen bg-white py-20 px-4"><div className="max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-6">Privacy Policy</h1><p className="text-neutral-600 leading-relaxed mb-4">Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information when you use our platform.</p><h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2><p className="text-neutral-600 leading-relaxed mb-4">We collect information you provide directly, such as your name, email address, and role within your institution, as well as usage data to improve our services.</p><h2 className="text-xl font-semibold mt-8 mb-3">How We Use Your Information</h2><p className="text-neutral-600 leading-relaxed mb-4">Your information is used to provide and improve our services, communicate with you, and ensure the security of our platform.</p><h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2><p className="text-neutral-600 leading-relaxed">If you have questions about this policy, please contact us at hello@cims.edu.</p><a href="/" className="btn btn-primary mt-8">Back to Home</a></div></div>} />
        <Route path="/terms" element={<div className="min-h-screen bg-white py-20 px-4"><div className="max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-6">Terms of Service</h1><p className="text-neutral-600 leading-relaxed mb-4">By using our platform, you agree to these terms. Please read them carefully.</p><h2 className="text-xl font-semibold mt-8 mb-3">Acceptance of Terms</h2><p className="text-neutral-600 leading-relaxed mb-4">By accessing or using our platform, you agree to be bound by these terms. If you do not agree, you may not use our services.</p><h2 className="text-xl font-semibold mt-8 mb-3">User Responsibilities</h2><p className="text-neutral-600 leading-relaxed mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p><h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2><p className="text-neutral-600 leading-relaxed mb-4">We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform.</p><a href="/" className="btn btn-primary mt-8">Back to Home</a></div></div>} />
        <Route path="/cookies" element={<div className="min-h-screen bg-white py-20 px-4"><div className="max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-6">Cookie Policy</h1><p className="text-neutral-600 leading-relaxed mb-4">We use cookies to enhance your browsing experience and provide personalized content.</p><h2 className="text-xl font-semibold mt-8 mb-3">What Are Cookies</h2><p className="text-neutral-600 leading-relaxed mb-4">Cookies are small text files stored on your device that help us remember your preferences and improve our services.</p><h2 className="text-xl font-semibold mt-8 mb-3">How We Use Cookies</h2><p className="text-neutral-600 leading-relaxed mb-4">We use essential cookies for authentication and security, analytics cookies to understand usage patterns, and preference cookies to remember your settings.</p><h2 className="text-xl font-semibold mt-8 mb-3">Managing Cookies</h2><p className="text-neutral-600 leading-relaxed mb-4">You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of our platform.</p><a href="/" className="btn btn-primary mt-8">Back to Home</a></div></div>} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-6xl font-bold text-neutral-200 mb-4">404</h1><p className="text-neutral-500 mb-4">Page not found</p><a href="/" className="btn btn-primary">Go Home</a></div></div>} />
      </Routes>
    </BrowserRouter>
  )
}
