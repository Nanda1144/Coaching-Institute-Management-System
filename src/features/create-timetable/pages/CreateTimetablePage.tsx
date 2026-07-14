import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
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
import type { CreateTimetableFormData } from '../types/timetableForm.types'

type FormValues = { [key: string]: string }

const initialForm: FormValues = {
  academicYear: '', semester: '', department: '', course: '', batch: '', section: '',
  subject: '', faculty: '', classroom: '', building: '', floor: '',
  day: '', startTime: '', endTime: '', duration: '',
  remarks: '', status: '', recurringClass: '',
}

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

export default function CreateTimetablePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormValues>({ ...initialForm })
  const [errors, setErrors] = useState<Errors>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((field: string, value: string) => {
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
      setToastMessage('Timetable created successfully!')
      setShowToast(true)
      setForm({ ...initialForm })
      setErrors({})
    }, 1000)
  }

  const handleReset = () => {
    setForm({ ...initialForm })
    setErrors({})
  }

  const handleCancel = () => {
    navigate('/schedule')
  }

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
            <span className="text-primary font-medium">Create Timetable</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Timetable Entry</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add a new class schedule entry to the system</p>
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
        />

        <ScheduleSection
          values={form}
          onChange={handleChange}
          errors={errors}
          dayOptions={dayOptions}
        />

        <AdditionalDetailsSection
          values={form}
          onChange={handleChange}
          errors={errors}
          statusOptions={statusOptions}
          recurringOptions={recurringOptions}
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
              {isSubmitting ? 'Saving...' : 'Save Timetable'}
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
