import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdHowToVote, MdArrowBack, MdHome, MdChevronRight } from 'react-icons/md'
import AcademicDetailsSection from '../components/AcademicDetailsSection'
import ClassDetailsSection from '../components/ClassDetailsSection'
import StudentAttendanceTable from '../components/StudentAttendanceTable'
import Toast from '../../../components/Toast'
import attendanceService from '../../../services/attendance/attendance.service'
import facultyService from '../../../services/faculty/faculty.service'
import { normalizeFacultyList } from '../../../utils/normalizers'
import AttendanceNavBar from '../../../components/AttendanceNavBar'
import type { StudentAttendance, ManualAttendanceForm, Errors } from '../types/manualAttendance.types'

const initialForm: ManualAttendanceForm = {
  department: '', course: '', semester: '', batch: '', section: '',
  subject: '', faculty: '', date: new Date().toISOString().split('T')[0], time: '',
}

const requiredFields: (keyof ManualAttendanceForm)[] = [
  'department', 'course', 'semester', 'batch', 'section',
  'subject', 'faculty', 'date', 'time',
]

const fieldLabels: Record<string, string> = {
  department: 'Department', course: 'Course', semester: 'Semester',
  batch: 'Batch', section: 'Section',
  subject: 'Subject', faculty: 'Faculty', date: 'Date', time: 'Time',
}

export default function ManualAttendancePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<ManualAttendanceForm>({ ...initialForm })
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [formOptions, setFormOptions] = useState<{
    departments: { value: string; label: string }[]
    courses: { value: string; label: string }[]
    semesters: { value: string; label: string }[]
    batches: { value: string; label: string }[]
    sections: { value: string; label: string }[]
    subjects: { value: string; label: string }[]
    faculties: { value: string; label: string }[]
  }>({
    departments: [],
    courses: [],
    semesters: [],
    batches: [],
    sections: [],
    subjects: [],
    faculties: [],
  })

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        let facultyListData: any[] = []
        try {
          const facRes = await facultyService.getAll()
          facultyListData = normalizeFacultyList(facRes)
        } catch (err) {
          console.warn('Failed to load faculty list:', err)
        }
        setFormOptions({
          departments: [
            { value: '', label: 'Select Department...' },
            { value: 'Computer Science', label: 'Computer Science' },
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Mechanical', label: 'Mechanical' },
            { value: 'Civil', label: 'Civil' },
            { value: 'Electrical', label: 'Electrical' },
          ],
          courses: [
            { value: '', label: 'Select Course...' },
            { value: 'B.Tech CSE', label: 'B.Tech CSE' },
            { value: 'B.Tech ECE', label: 'B.Tech ECE' },
            { value: 'B.Sc Math', label: 'B.Sc Math' },
            { value: 'M.Sc Math', label: 'M.Sc Math' },
          ],
          semesters: [
            { value: '', label: 'Select Semester...' },
            { value: '1', label: 'Semester 1' },
            { value: '2', label: 'Semester 2' },
            { value: '3', label: 'Semester 3' },
            { value: '4', label: 'Semester 4' },
            { value: '5', label: 'Semester 5' },
            { value: '6', label: 'Semester 6' },
          ],
          batches: [
            { value: '', label: 'Select Batch...' },
            { value: '2024-25', label: '2024-25' },
            { value: '2023-24', label: '2023-24' },
            { value: '2022-23', label: '2022-23' },
          ],
          sections: [
            { value: '', label: 'Select Section...' },
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
          ],
          subjects: [
            { value: '', label: 'Select Subject...' },
            { value: 'Mathematics', label: 'Mathematics' },
            { value: 'Physics', label: 'Physics' },
            { value: 'Chemistry', label: 'Chemistry' },
            { value: 'Computer Science', label: 'Computer Science' },
          ],
          faculties: [
            { value: '', label: 'Select Faculty...' },
            ...facultyListData.map((f: any) => ({ value: f.id || '', label: f.name || 'Unknown' })),
          ],
        })
      } catch {
        setToastMessage('Failed to load form options')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    fetchOptions()
  }, [])

  const handleFormChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleStatusChange = useCallback((id: string, status: StudentAttendance['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    )
  }, [])

  const handleRemarkChange = useCallback((id: string, remarks: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, remarks } : s))
    )
  }, [])

  const handleBulkStatusChange = useCallback((ids: string[], status: StudentAttendance['status']) => {
    setStudents((prev) =>
      prev.map((s) => (ids.includes(s.id) ? { ...s, status } : s))
    )
  }, [])

  const validate = (): boolean => {
    const newErrors: Errors = {}
    for (const field of requiredFields) {
      if (!form[field] || !form[field].trim()) {
        newErrors[field] = `${fieldLabels[field] || field} is required`
      }
    }
    const hasAttendance = students.some((s) => s.status !== null)
    if (!hasAttendance) {
      newErrors.attendance = 'Please mark attendance for at least one student'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const markedStudents = students.filter((s) => s.status !== null)
      let successCount = 0
      let failCount = 0
      for (const student of markedStudents) {
        try {
          await attendanceService.create({
            studentId: student.id,
            subjectId: form.subject,
            batchId: form.batch,
            classroomId: form.section || '',
            attendanceDate: form.date,
            startTime: form.time,
            endTime: form.time,
            attendanceMethod: 'manual',
            attendanceStatus: student.status,
            remarks: student.remarks || '',
          })
          successCount++
        } catch (err) {
          failCount++
          console.error('Failed to save attendance for student', student.id, err)
        }
      }
      const msg = failCount > 0
        ? `Attendance saved (${successCount} success, ${failCount} failed)`
        : `Attendance saved successfully! ${successCount} students marked.`
      setToastMessage(msg)
      setShowToast(true)
      setForm({ ...initialForm, date: new Date().toISOString().split('T')[0] })
      setStudents([])
      setErrors({})
    } catch {
      setToastMessage('Failed to save attendance. Please try again.')
      setShowToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ ...initialForm, date: new Date().toISOString().split('T')[0] })
    setStudents([])
    setErrors({})
  }

  const handleCancel = () => {
    navigate('/attendance')
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="h-8 w-64 bg-gray-100/60 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-100/40 rounded-2xl animate-pulse" />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <AttendanceNavBar />
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
            <span className="text-gray-500">Attendance</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-primary font-medium">Manual Attendance</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Manual Attendance</h2>
          <p className="text-sm text-gray-500 mt-0.5">Mark student attendance for a class session</p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to Attendance
        </button>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-5">
        <AcademicDetailsSection
          values={form}
          onChange={handleFormChange}
          errors={errors}
          departmentOptions={formOptions.departments}
          courseOptions={formOptions.courses}
          semesterOptions={formOptions.semesters}
          batchOptions={formOptions.batches}
          sectionOptions={formOptions.sections}
        />

        <ClassDetailsSection
          values={form}
          onChange={handleFormChange}
          errors={errors}
          subjectOptions={formOptions.subjects}
          facultyOptions={formOptions.faculties}
        />

        <StudentAttendanceTable
          students={students}
          onStatusChange={handleStatusChange}
          onRemarkChange={handleRemarkChange}
          onBulkStatusChange={handleBulkStatusChange}
        />

        {errors.attendance && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 text-center bg-red-50 rounded-xl px-4 py-2"
          >
            {errors.attendance}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              {students.filter((s) => s.status !== null).length} of {students.length} students marked
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto justify-center"
              >
                <MdArrowBack className="text-lg rotate-90" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto justify-center"
              >
                <MdArrowBack className="text-lg" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              >
                <MdHowToVote className="text-lg" />
                {isSubmitting ? 'Saving...' : 'Save Attendance'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </form>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  )
}
