import { useState } from 'react'

export interface BatchFormState {
  batchName: string
  batchCode: string
  course: string
  faculty: string
  classroom: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  days: string[]
  maxStudents: string
  status: string
}

const initialForm: BatchFormState = {
  batchName: '',
  batchCode: '',
  course: '',
  faculty: '',
  classroom: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  days: [],
  maxStudents: '',
  status: 'Scheduled',
}

function validate(form: BatchFormState) {
  const errors: Record<string, string> = {}

  if (!form.batchName.trim()) {
    errors.batchName = 'Batch name is required'
  } else if (form.batchName.trim().length < 3) {
    errors.batchName = 'Batch name must be at least 3 characters'
  }

  if (!form.batchCode.trim()) {
    errors.batchCode = 'Batch code is required'
  } else if (!/^[a-zA-Z0-9-]+$/.test(form.batchCode.trim())) {
    errors.batchCode = 'Batch code must be alphanumeric (hyphens allowed)'
  }

  if (!form.course) errors.course = 'Please select a course'
  if (!form.faculty) errors.faculty = 'Please select a faculty member'
  if (!form.classroom) errors.classroom = 'Please select a classroom'

  if (!form.startDate) {
    errors.startDate = 'Start date is required'
  } else {
    const today = new Date().toISOString().split('T')[0]
    if (form.startDate < today) errors.startDate = 'Start date cannot be in the past'
  }

  if (!form.endDate) {
    errors.endDate = 'End date is required'
  } else if (form.startDate && form.endDate < form.startDate) {
    errors.endDate = 'End date must be after start date'
  }

  if (!form.startTime) errors.startTime = 'Start time is required'
  if (!form.endTime) errors.endTime = 'End time is required'
  else if (form.startTime && form.endTime <= form.startTime) errors.endTime = 'End time must be after start time'

  if (!form.days || form.days.length === 0) errors.days = 'Select at least one day'

  if (!form.maxStudents) {
    errors.maxStudents = 'Maximum students is required'
  } else if (isNaN(Number(form.maxStudents)) || Number(form.maxStudents) < 1) {
    errors.maxStudents = 'Must be at least 1'
  } else if (Number(form.maxStudents) > 200) {
    errors.maxStudents = 'Cannot exceed 200'
  }

  return errors
}

export default function useFormValidation() {
  const [form, setForm] = useState<BatchFormState>({ ...initialForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function setField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (submitted) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  function setDays(days: string[]) {
    setField('days', days.join(','))
    setForm((prev) => ({ ...prev, days }))
  }

  function handleSubmit() {
    const validationErrors = validate(form)
    setErrors(validationErrors)
    setSubmitted(true)
    return Object.keys(validationErrors).length === 0
  }

  function handleReset() {
    setForm({ ...initialForm })
    setErrors({})
    setSubmitted(false)
  }

  return { form, errors, submitted, setField, setDays, handleSubmit, handleReset }
}
