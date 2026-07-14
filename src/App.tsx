import { useState, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import FacultyListPage from './features/faculty/pages/FacultyListPage'
import AddFacultyPage from './features/add-faculty/pages/AddFacultyPage'
import EditFacultyPage from './features/add-faculty/pages/EditFacultyPage'
import FacultyProfilePage from './features/faculty-profile/pages/FacultyProfilePage'
import FacultyAssignmentPage from './features/faculty-assignment/pages/FacultyAssignmentPage'
import FacultyTransferPage from './features/faculty-transfer/pages/FacultyTransferPage'
import FacultySearchPage from './features/faculty-search/pages/FacultySearchPage'
import TimetableDashboard from './features/timetable/pages/TimetableDashboard'
import CreateTimetablePage from './features/create-timetable/pages/CreateTimetablePage'
import EditTimetablePage from './features/create-timetable/pages/EditTimetablePage'
import InteractiveCalendarPage from './features/interactive-calendar/pages/InteractiveCalendarPage'
import HolidayManagementPage from './features/holiday-management/pages/HolidayManagementPage'
import StudentTimetablePage from './features/student-timetable/pages/StudentTimetablePage'
import FacultyTimetablePage from './features/faculty-timetable/pages/FacultyTimetablePage'
import AttendanceDashboard from './features/attendance/pages/AttendanceDashboard'
import ManualAttendancePage from './features/manual-attendance/pages/ManualAttendancePage'
import FaceRecognitionPage from './features/face-recognition/pages/FaceRecognitionPage'
import FingerprintAttendancePage from './features/fingerprint-attendance/pages/FingerprintAttendancePage'
import QRAttendancePage from './features/qr-attendance/pages/QRAttendancePage'
import AttendanceHistoryPage from './features/attendance-history/pages/AttendanceHistoryPage'
import AttendanceReportsPage from './features/attendance-reports/pages/AttendanceReportsPage'
import AttendanceAnalyticsPage from './features/attendance-analytics/pages/AttendanceAnalyticsPage'
import CorrectionManagementPage from './features/attendance-correction/pages/CorrectionManagementPage'

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
              {children}
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
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/faculty" element={<FacultyListPage />} />
          <Route path="/faculty/add" element={<AddFacultyPage />} />
          <Route path="/faculty/profile/:id" element={<FacultyProfilePage />} />
          <Route path="/faculty/edit/:id" element={<EditFacultyPage />} />
          <Route path="/faculty/assign" element={<FacultyAssignmentPage />} />
          <Route path="/faculty/transfer" element={<FacultyTransferPage />} />
          <Route path="/faculty/search" element={<FacultySearchPage />} />
          <Route path="/departments" element={<Dashboard />} />
          <Route path="/courses" element={<Dashboard />} />
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
          <Route path="/assignments" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
