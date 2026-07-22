import { useState } from 'react'
import FormField from './FormField'
import DaySelector from './DaySelector'
import SuccessNotification from './SuccessNotification'
import useFormValidation from '../hooks/useFormValidation'

interface BatchFormProps {
  onBatchCreated: (batch: any) => void
  courses?: { value: string; label: string }[]
  facultyOptions?: { value: string; label: string }[]
  classroomOptions?: { value: string; label: string }[]
  statusOptions?: string[]
  onCancel?: () => void
}

const defaultCourses = [
  'JEE Advanced', 'JEE Mains', 'NEET UG',
  'Foundation Class 11', 'Foundation Class 12',
  'Board Class 10', 'Board Class 12', 'Olympiad Training',
].map((c) => ({ value: c, label: c }))

const defaultFaculty = [
  { id: 'F001', name: 'Dr. Rajesh Kumar', department: 'Physics' },
  { id: 'F002', name: 'Dr. Priya Sharma', department: 'Biology' },
  { id: 'F003', name: 'Mr. Amit Verma', department: 'Mathematics' },
  { id: 'F004', name: 'Ms. Sneha Patel', department: 'Chemistry' },
  { id: 'F005', name: 'Mr. Vikram Singh', department: 'Mathematics' },
  { id: 'F006', name: 'Dr. Ananya Gupta', department: 'Chemistry' },
].map((f) => ({ value: f.name, label: `${f.name} (${f.department})` }))

const defaultClassrooms = [
  'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105',
  'Room 106', 'Room 107', 'Room 108', 'Room 109', 'Room 110',
  'Room 201', 'Room 202', 'Room 203', 'Room 204', 'Room 205',
  'Room 301', 'Room 302', 'Room 303', 'Room 304',
  'Room 401', 'Room 402',
].map((c) => ({ value: c, label: c }))

const defaultStatuses = ['Active', 'Scheduled', 'Completed']

export default function BatchForm({
  onBatchCreated,
  courses = defaultCourses,
  facultyOptions = defaultFaculty,
  classroomOptions = defaultClassrooms,
  statusOptions = defaultStatuses,
  onCancel,
}: BatchFormProps) {
  const { form, errors, setField, setDays, handleSubmit, handleReset } = useFormValidation()
  const [showSuccess, setShowSuccess] = useState(false)

  function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (handleSubmit()) {
      const newBatch = {
        id: `B${String(Date.now()).slice(-4).padStart(3, '0')}`,
        name: form.batchName.trim(),
        batchName: form.batchName.trim(),
        batchCode: form.batchCode.trim(),
        course: form.course,
        faculty: form.faculty,
        schedule: form.days.join('-') + ' ' + form.startTime + ' - ' + form.endTime,
        batchTiming: form.days.join('-') + ' ' + form.startTime + ' - ' + form.endTime,
        classroom: form.classroom,
        students: 0,
        studentCount: 0,
        facultyCount: 0,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        days: form.days,
        startTime: form.startTime,
        endTime: form.endTime,
        maxStudents: Number(form.maxStudents),
      }
      onBatchCreated(newBatch)
      setShowSuccess(true)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <>
      <form onSubmit={onCreate} noValidate>
        <div className="card p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-neutral-800 pb-2 border-b border-neutral-100 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Batch Name" name="batchName" value={form.batchName} onChange={setField} error={errors.batchName} placeholder="e.g. JEE Advanced 2027" />
              <FormField label="Batch Code" name="batchCode" value={form.batchCode} onChange={setField} error={errors.batchCode} placeholder="e.g. JEE-ADV-2027" />
              <FormField label="Course" name="course" type="select" value={form.course} onChange={setField} error={errors.course} options={courses} />
              <FormField label="Faculty" name="faculty" type="select" value={form.faculty} onChange={setField} error={errors.faculty} options={facultyOptions} />
              <FormField label="Classroom" name="classroom" type="select" value={form.classroom} onChange={setField} error={errors.classroom} options={classroomOptions} />
              <FormField label="Maximum Students" name="maxStudents" type="number" value={form.maxStudents} onChange={setField} error={errors.maxStudents} placeholder="e.g. 40" min={1} max={200} />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-800 pb-2 border-b border-neutral-100 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={setField} error={errors.startDate} min={minDate} />
              <FormField label="End Date" name="endDate" type="date" value={form.endDate} onChange={setField} error={errors.endDate} min={minDate} />
              <FormField label="Start Time" name="startTime" type="time" value={form.startTime} onChange={setField} error={errors.startTime} />
              <FormField label="End Time" name="endTime" type="time" value={form.endTime} onChange={setField} error={errors.endTime} />
              <div className="sm:col-span-2">
                <DaySelector selectedDays={form.days} onChange={setDays} error={errors.days} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-800 pb-2 border-b border-neutral-100 mb-4">Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Status" name="status" type="select" value={form.status} onChange={setField} options={statusOptions.map((s) => ({ value: s, label: s }))} />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button type="submit" className="btn btn-primary">Create Batch</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
            {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
          </div>
        </div>
      </form>

      <SuccessNotification show={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  )
}
