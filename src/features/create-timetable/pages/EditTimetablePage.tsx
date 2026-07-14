import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack, MdEdit } from 'react-icons/md'
import AcademicDetailsSection from '../components/AcademicDetailsSection'
import ClassDetailsSection from '../components/ClassDetailsSection'
import ScheduleSection from '../components/ScheduleSection'
import AdditionalDetailsSection from '../components/AdditionalDetailsSection'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../../../components/Toast'
import {
  academicYearOptions, semesterOptions, departmentOptions, courseOptions,
  batchOptions, sectionOptions, subjectOptions, facultyOptions,
  classroomOptions, buildingOptions, floorOptions, dayOptions,
  statusOptions, recurringOptions,
} from '../data/timetableFormData'
import { getEditEntryById } from '../data/editTimetableData'
import type { CreateTimetableFormData } from '../types/timetableForm.types'

type FormValues = { [key: string]: string }

const nonEditableFields = ['academicYear', 'semester', 'department', 'building', 'floor', 'recurringClass']

const requiredFields: (keyof CreateTimetableFormData)[] = [
  'academicYear', 'semester', 'department', 'course', 'batch', 'section',
  'subject', 'faculty', 'classroom', 'building', 'floor',
  'day', 'startTime', 'endTime', 'status',
]

const fieldLabels: Record<string, string> = {
  academicYear: 'Academic Year', semester: 'Semester', department: 'Department',
  course: 'Course', batch: 'Batch', section: 'Section',
  subject: 'Subject', faculty: 'Faculty', classroom: 'Classroom',
  building: 'Building', floor: 'Floor',
  day: 'Day', startTime: 'Start Time', endTime: 'End Time',
  status: 'Status',
}

type Errors = Record<string, string>

export default function EditTimetablePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<FormValues>({})
  const [errors, setErrors] = useState<Errors>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const entry = getEditEntryById(id || '')
    if (!entry) {
      setNotFound(true)
      return
    }
    setForm({
      academicYear: entry.academicYear,
      semester: entry.semester,
      department: entry.department,
      course: entry.course,
      batch: entry.batch,
      section: entry.section,
      subject: entry.subject,
      faculty: entry.faculty,
      classroom: entry.classroom,
      building: entry.building,
      floor: entry.floor,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      duration: '',
      remarks: entry.remarks,
      status: entry.status,
      recurringClass: entry.recurringClass,
    })
  }, [id])

  const handleChange = useCallback((field: string, value: string) => {
    if (nonEditableFields.includes(field)) return
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const validate = (): boolean => {
    const newErrors: Errors = {}
    for (const field of requiredFields) {
      if (!form[field] || !form[field].trim()) {
        newErrors[field] = `${fieldLabels[field] || field} is required`
      }
    }
    if (form.startTime && form.endTime) {
      const [sh, sm] = form.startTime.split(':').map(Number)
      const [eh, em] = form.endTime.split(':').map(Number)
      const diff = (eh * 60 + em) - (sh * 60 + sm)
      if (diff <= 0) {
        newErrors.endTime = 'End time must be after start time'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setShowConfirm(true)
  }

  const handleConfirmSave = () => {
    setShowConfirm(false)
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setToastMessage(`Timetable ${id} updated successfully!`)
      setShowToast(true)
    }, 1000)
  }

  const handleReset = () => {
    const entry = getEditEntryById(id || '')
    if (!entry) return
    setForm({
      academicYear: entry.academicYear,
      semester: entry.semester,
      department: entry.department,
      course: entry.course,
      batch: entry.batch,
      section: entry.section,
      subject: entry.subject,
      faculty: entry.faculty,
      classroom: entry.classroom,
      building: entry.building,
      floor: entry.floor,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      duration: '',
      remarks: entry.remarks,
      status: entry.status,
      recurringClass: entry.recurringClass,
    })
    setErrors({})
  }

  const handleCancel = () => {
    navigate('/schedule')
  }

  if (notFound) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-8 text-center">
          <MdEdit className="text-4xl text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Timetable Not Found</h3>
          <p className="text-sm text-gray-500 mb-4">No timetable entry found with ID: {id}</p>
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            Back to Timetable
          </button>
        </div>
      </motion.div>
    )
  }

  if (Object.keys(form).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const entry = getEditEntryById(id || '')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
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
            <span className="text-gray-500">Timetable</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-primary font-medium">Edit Timetable</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Timetable Entry</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Modifying entry <span className="font-mono font-medium text-primary">{id}</span>
            {entry && <> &middot; Last modified: {entry.lastModified} by {entry.createdBy}</>}
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to Timetable
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AcademicDetailsSection
          values={form}
          onChange={handleChange}
          errors={errors}
          academicYearOptions={academicYearOptions}
          semesterOptions={semesterOptions}
          departmentOptions={departmentOptions}
          courseOptions={courseOptions}
          batchOptions={batchOptions}
          sectionOptions={sectionOptions}
          readOnlyFields={nonEditableFields}
        />

        <ClassDetailsSection
          values={form}
          onChange={handleChange}
          errors={errors}
          subjectOptions={subjectOptions}
          facultyOptions={facultyOptions}
          classroomOptions={classroomOptions}
          buildingOptions={buildingOptions}
          floorOptions={floorOptions}
          readOnlyFields={nonEditableFields}
        />

        <ScheduleSection
          values={form}
          onChange={handleChange}
          errors={errors}
          dayOptions={dayOptions}
          readOnlyFields={[]}
        />

        <AdditionalDetailsSection
          values={form}
          onChange={handleChange}
          errors={errors}
          statusOptions={statusOptions}
          recurringOptions={recurringOptions}
          readOnlyFields={['recurringClass']}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
        >
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </motion.div>
      </form>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        formValues={form}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  )
}
