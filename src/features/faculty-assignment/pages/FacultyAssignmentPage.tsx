import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import Toast from '../../../components/Toast'
import { useNavigate } from 'react-router-dom'
import type { TeachingSlot, AssignedSubject } from '../types/assignment.types'
import type { Faculty } from '../../faculty/types/faculty.types'
import facultyService from '../../../services/faculty/faculty.service'
import assignmentService from '../../../services/assignment/assignment.service'
import { normalizeFacultyList } from '../../../utils/normalizers'
import {
  departmentFilterOptions, courseOptions, subjectOptions,
  semesterOptions, branchOptions, batchOptions, sectionOptions,
  academicYearOptions, dayOptions, timeOptions, roomOptions,
} from '../data/assignmentData'
import FacultySelector from '../components/FacultySelector'
import CourseAssignment from '../components/CourseAssignment'
import BatchAssignment from '../components/BatchAssignment'
import TeachingSchedule from '../components/TeachingSchedule'
import AssignedSubjectsTable from '../components/AssignedSubjectsTable'
import AssignmentActions from '../components/AssignmentActions'

function generateId() {
  return `AS-${String(Date.now()).slice(-6)}`
}

export default function FacultyAssignmentPage() {
  const navigate = useNavigate()

  const [facultyOptions, setFacultyOptions] = useState<{ id: string; name: string; department: string }[]>([])
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [departmentFilter, setDepartmentFilter] = useState('All Departments')
  const [selectedFaculty, setSelectedFaculty] = useState('')

  const [course, setCourse] = useState('')
  const [subject, setSubject] = useState('')
  const [semester, setSemester] = useState('')
  const [branch, setBranch] = useState('')

  const [batch, setBatch] = useState('')
  const [section, setSection] = useState('')
  const [academicYear, setAcademicYear] = useState('')

  const [scheduleSlots, setScheduleSlots] = useState<TeachingSlot[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [facultyRes, assignmentsRes] = await Promise.all([
          facultyService.getAll(),
          assignmentService.getAll(),
        ])
        const facultyList: Faculty[] = normalizeFacultyList(facultyRes)
        setFacultyOptions(
          facultyList.map((f: Faculty) => ({
            id: f.id,
            name: f.name,
            department: f.department,
          }))
        )
        const assignmentRaw = assignmentsRes?.data ?? []
        const assignmentList = Array.isArray(assignmentRaw) ? assignmentRaw : (assignmentRaw?.data ?? [])
        setAssignedSubjects(assignmentList)
    } catch {
      setFacultyOptions([])
      setAssignedSubjects([])
      setToastMessage('Failed to load assignment data')
      setShowToast(true)
    } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const canAssign = !!(selectedFaculty && course && subject && semester && batch)

  const handleAssign = async () => {
    if (!canAssign) return
    const newSubject: AssignedSubject = {
      id: generateId(),
      subject,
      course,
      semester: Number(semester),
      batch,
    }
    try {
      await assignmentService.create(newSubject as unknown as Record<string, unknown>)
      setAssignedSubjects(prev => [...prev, newSubject])
      setToastMessage('Assignment created successfully')
      setShowToast(true)
    } catch {
      setAssignedSubjects(prev => [...prev, newSubject])
      setToastMessage('Failed to create assignment')
      setShowToast(true)
    }
    setCourse('')
    setSubject('')
    setSemester('')
    setBranch('')
    setBatch('')
    setSection('')
    setAcademicYear('')
    setScheduleSlots([])
  }

  const handleRemove = async (id: string) => {
    try {
      await assignmentService.delete(id)
      setToastMessage('Assignment removed')
      setShowToast(true)
    } catch {
      setToastMessage('Failed to remove assignment')
      setShowToast(true)
    }
    setAssignedSubjects(prev => prev.filter(s => s.id !== id))
  }

  const handleRemoveAll = async () => {
    for (const s of assignedSubjects) {
      try {
        await assignmentService.delete(s.id)
      } catch {
        setToastMessage('Failed to remove some assignments')
        setShowToast(true)
      }
    }
    setAssignedSubjects([])
    setToastMessage('All assignments removed')
    setShowToast(true)
  }

  const handleSave = async () => {
    for (const s of assignedSubjects) {
      try {
        await assignmentService.create(s as unknown as Record<string, unknown>)
      } catch {
        setToastMessage('Failed to save some assignments')
        setShowToast(true)
      }
    }
    navigate('/faculty')
  }

  const filteredOptions = departmentFilter === 'All Departments'
    ? facultyOptions
    : facultyOptions.filter(f => f.department === departmentFilter)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
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
            <span className="text-primary font-medium">Faculty Assignments</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Faculty Assignment Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Assign courses, batches, and schedules to faculty members</p>
        </div>
        <button
          onClick={() => navigate('/faculty')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to List
        </button>
      </motion.div>

      <FacultySelector
        options={filteredOptions}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        selectedId={selectedFaculty}
        onSelect={setSelectedFaculty}
        departmentFilterOptions={departmentFilterOptions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CourseAssignment
          course={course}
          subject={subject}
          semester={semester}
          branch={branch}
          onCourseChange={setCourse}
          onSubjectChange={setSubject}
          onSemesterChange={setSemester}
          onBranchChange={setBranch}
          courseOptions={courseOptions}
          subjectOptions={subjectOptions}
          semesterOptions={semesterOptions}
          branchOptions={branchOptions}
        />
        <BatchAssignment
          batch={batch}
          section={section}
          academicYear={academicYear}
          onBatchChange={setBatch}
          onSectionChange={setSection}
          onAcademicYearChange={setAcademicYear}
          batchOptions={batchOptions}
          sectionOptions={sectionOptions}
          academicYearOptions={academicYearOptions}
        />
      </div>

      <TeachingSchedule
        slots={scheduleSlots}
        onSlotsChange={setScheduleSlots}
        dayOptions={dayOptions}
        timeOptions={timeOptions}
        roomOptions={roomOptions}
      />

      <AssignedSubjectsTable subjects={assignedSubjects} onRemove={handleRemove} />

      <AssignmentActions
        onAssign={handleAssign}
        onRemoveAll={handleRemoveAll}
        onSave={handleSave}
        canAssign={canAssign}
        hasSubjects={assignedSubjects.length > 0}
      />
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  )
}
