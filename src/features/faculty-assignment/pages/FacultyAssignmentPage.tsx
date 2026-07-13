import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import type { TeachingSlot, AssignedSubject } from '../types/assignment.types'
import {
  facultyOptions, departmentFilterOptions, courseOptions, subjectOptions,
  semesterOptions, branchOptions, batchOptions, sectionOptions,
  academicYearOptions, dayOptions, timeOptions, roomOptions,
  initialAssignedSubjects,
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
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>(initialAssignedSubjects)

  const canAssign = !!(selectedFaculty && course && subject && semester && batch)

  const handleAssign = () => {
    if (!canAssign) return
    const newSubject: AssignedSubject = {
      id: generateId(),
      subject,
      course,
      semester: Number(semester),
      batch,
    }
    setAssignedSubjects(prev => [...prev, newSubject])
    setCourse('')
    setSubject('')
    setSemester('')
    setBranch('')
    setBatch('')
    setSection('')
    setAcademicYear('')
    setScheduleSlots([])
  }

  const handleRemove = (id: string) => {
    setAssignedSubjects(prev => prev.filter(s => s.id !== id))
  }

  const handleRemoveAll = () => {
    setAssignedSubjects([])
  }

  const handleSave = () => {
    navigate('/faculty')
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
        options={facultyOptions}
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
    </motion.div>
  )
}
