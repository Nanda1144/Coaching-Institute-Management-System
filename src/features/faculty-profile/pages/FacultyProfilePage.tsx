import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import type { FacultyProfile, AssignedCourse, AssignedBatch, DaySchedule, PerformanceData, Document } from '../types/profile.types'
import facultyService from '../../../services/faculty/faculty.service'
import assignmentService from '../../../services/assignment/assignment.service'
import timetableService from '../../../services/timetable/timetable.service'
import { normalizeFaculty } from '../../../utils/normalizers'
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
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<FacultyProfile | null>(null)
  const [courses, setCourses] = useState<AssignedCourse[]>([])
  const [batches, setBatches] = useState<AssignedBatch[]>([])
  const [timetable, setTimetable] = useState<DaySchedule[]>([])
  const [attendance, setAttendance] = useState<{ present: number; absent: number; leave: number; total: number }>({ present: 0, absent: 0, leave: 0, total: 0 })
  const [performance, setPerformance] = useState<PerformanceData>({ subjectsHandled: 0, students: 0, feedbackRating: 0 })
  const [documents] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [profileRes, assignmentsRes, timetableRes] = await Promise.all([
          facultyService.getById(id),
          assignmentService.getByFaculty(id),
          timetableService.getByFaculty(id),
        ])
        const rawProfile = profileRes?.data ?? profileRes
        const norm = normalizeFaculty(rawProfile as Record<string, unknown>)
        setProfile({
          id: norm.id,
          photo: norm.photo,
          name: norm.name,
          designation: norm.designation,
          department: norm.department,
          experience: norm.experience,
          email: norm.email,
          phone: norm.phone,
          address: (rawProfile as any)?.address || '',
          dob: (rawProfile as any)?.dateOfBirth ? new Date((rawProfile as any).dateOfBirth).toISOString().split('T')[0] : '',
          gender: (rawProfile as any)?.gender || '',
          qualification: norm.qualification,
          specialization: (rawProfile as any)?.specialization?.join(', ') || '',
          joiningDate: norm.joiningDate,
          employmentType: (rawProfile as any)?.employmentType || '',
          branch: norm.branch,
          status: norm.status,
        })
        const assignmentList = Array.isArray(assignmentsRes) ? assignmentsRes : assignmentsRes?.data ?? []
        setCourses(assignmentList)
        const batchMap = new Map<string, { students: number }>()
        assignmentList.forEach((a: AssignedCourse) => {
          const batchName = a.branch || 'General'
          if (!batchMap.has(batchName)) {
            batchMap.set(batchName, { students: 0 })
          }
        })
        setBatches(
          Array.from(batchMap.entries()).map(([batchName], i) => ({
            id: `B-${String(i + 1).padStart(3, '0')}`,
            batchName,
            students: 0,
            year: 1,
          }))
        )
        const timetableData = timetableRes?.data ?? timetableRes
        if (timetableData && typeof timetableData === 'object' && !Array.isArray(timetableData)) {
          const grouped = timetableData as Record<string, any[]>
          const daySchedule: DaySchedule[] = Object.entries(grouped).map(([day, entries]) => ({
            day,
            slots: entries.map((e: any) => ({
              time: String(e.startTime || '') + ' - ' + String(e.endTime || ''),
              subject: String(e.subjectRef?.subjectName || e.subject || ''),
              room: String(e.classroom?.roomNumber || e.classroom || ''),
            })),
          }))
          setTimetable(daySchedule)
        } else {
          setTimetable(Array.isArray(timetableData) ? timetableData : [])
        }
        if (profileRes?.data?.dashboardStats) {
          const stats = profileRes.data.dashboardStats
          setAttendance(stats.attendance ?? { present: 0, absent: 0, leave: 0, total: 0 })
          setPerformance(stats.performance ?? { subjectsHandled: 0, students: 0, feedbackRating: 0 })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error || 'Profile not found'}</p>
      </div>
    )
  }

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

      <ProfileCard profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1">
          <PersonalInfo profile={profile} />
        </div>
        <div className="lg:col-span-3 space-y-5">
          <AssignedCourses courses={courses} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AssignedBatches batches={batches} />
        <AttendanceSummary attendance={attendance} />
      </div>

      <WeeklyTimetable timetable={timetable} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Performance performance={performance} />
        <Documents documents={documents} />
      </div>

      <ProfileActions
        onEdit={() => navigate(`/faculty/edit/${profile.id}`)}
        onAssignCourse={() => navigate(`/faculty/assign?id=${profile.id}`)}
        onPrint={() => window.print()}
      />
    </motion.div>
  )
}
