import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { facultyProfile, assignedCourses, assignedBatches, weeklyTimetable, attendanceSummary, performanceData, documents } from '../data/profileData'
import ProfileCard from '../components/ProfileCard'
import PersonalInfo from '../components/PersonalInfo'
import AssignedCourses from '../components/AssignedCourses'
import AssignedBatches from '../components/AssignedBatches'
import WeeklyTimetable from '../components/WeeklyTimetable'
import AttendanceSummary from '../components/AttendanceSummary'
import Performance from '../components/Performance'
import Documents from '../components/Documents'
import ProfileActions from '../components/ProfileActions'

export default function FacultyProfilePage() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <MdHome className="text-gray-400" />
            <MdChevronRight className="text-gray-300" />
            <span>Dashboard</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-gray-500">Faculty</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-primary font-medium">Profile</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Faculty Profile</h2>
          <p className="text-sm text-gray-500 mt-0.5">Detailed information about the faculty member</p>
        </div>
        <button
          onClick={() => navigate('/faculty')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to List
        </button>
      </motion.div>

      <ProfileCard profile={facultyProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1">
          <PersonalInfo profile={facultyProfile} />
        </div>
        <div className="lg:col-span-3 space-y-5">
          <AssignedCourses courses={assignedCourses} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AssignedBatches batches={assignedBatches} />
        <AttendanceSummary attendance={attendanceSummary} />
      </div>

      <WeeklyTimetable timetable={weeklyTimetable} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Performance performance={performanceData} />
        <Documents documents={documents} />
      </div>

      <ProfileActions
        onEdit={() => navigate(`/faculty/edit/${facultyProfile.id}`)}
        onAssignCourse={() => navigate(`/faculty/assign?id=${facultyProfile.id}`)}
        onPrint={() => window.print()}
      />
    </motion.div>
  )
}
