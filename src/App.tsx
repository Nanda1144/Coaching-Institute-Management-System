import { useState, lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import DepartmentsPage from './pages/DepartmentsPage'
import CoursesPage from './pages/CoursesPage'
import AssignmentsPage from './pages/AssignmentsPage'
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

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return <LoadingSpinner text="Verifying session..." />
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<LoadingSpinner text="Loading..." />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
            <Route path="/faculty" element={<FacultyListPage />} />
            <Route path="/faculty/add" element={<AddFacultyPage />} />
            <Route path="/faculty/profile/:id" element={<FacultyProfilePage />} />
            <Route path="/faculty/edit/:id" element={<EditFacultyPage />} />
            <Route path="/faculty/assign" element={<FacultyAssignmentPage />} />
            <Route path="/faculty/transfer" element={<FacultyTransferPage />} />
            <Route path="/faculty/search" element={<FacultySearchPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/schedule" element={<TimetableDashboard />} />
            <Route path="/timetable" element={<TimetableDashboard />} />
            <Route path="/timetable/create" element={<CreateTimetablePage />} />
            <Route path="/timetable/calendar" element={<InteractiveCalendarPage />} />
            <Route path="/timetable/edit/:id" element={<EditTimetablePage />} />
            <Route path="/holidays" element={<HolidayManagementPage />} />
            <Route path="/student/timetable" element={<StudentTimetablePage />} />
            <Route path="/faculty/timetable" element={<FacultyTimetablePage />} />
            <Route path="/attendance" element={<AttendanceDashboard />} />
            <Route path="/attendance/manual" element={<ManualAttendancePage />} />
            <Route path="/attendance/face-recognition" element={<FaceRecognitionPage />} />
            <Route path="/attendance/fingerprint" element={<FingerprintAttendancePage />} />
            <Route path="/attendance/qr" element={<QRAttendancePage />} />
            <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
            <Route path="/attendance/reports" element={<AttendanceReportsPage />} />
            <Route path="/attendance/analytics" element={<AttendanceAnalyticsPage />} />
            <Route path="/attendance/correction" element={<CorrectionManagementPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
                  </Routes>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}
