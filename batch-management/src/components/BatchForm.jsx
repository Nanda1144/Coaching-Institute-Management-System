import { useState } from 'react';
import FormField from './FormField';
import DaySelector from './DaySelector';
import SuccessNotification from './SuccessNotification';
import { courses, faculty, classrooms, statusOptions } from '../data/formData';
import useFormValidation from '../hooks/useFormValidation';
import './BatchForm.css';

export default function BatchForm({ onBatchCreated }) {
  const { form, errors, setField, setDays, handleSubmit, handleReset } = useFormValidation();
  const [showSuccess, setShowSuccess] = useState(false);

  function onCreate(e) {
    e.preventDefault();
    if (handleSubmit()) {
      const newBatch = {
        id: `B${String(Date.now()).slice(-4).padStart(3, '0')}`,
        name: form.batchName.trim(),
        course: form.course,
        faculty: form.faculty,
        schedule: form.days.join('-') + ' ' + form.startTime + ' - ' + form.endTime,
        classroom: form.classroom,
        students: 0,
        status: form.status,
      };
      onBatchCreated(newBatch);
      setShowSuccess(true);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <form className="batch-form" onSubmit={onCreate} noValidate>
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid">
            <FormField label="Batch Name" name="batchName" value={form.batchName} onChange={setField} error={errors.batchName} placeholder="e.g. JEE Advanced 2027" />
            <FormField label="Batch Code" name="batchCode" value={form.batchCode} onChange={setField} error={errors.batchCode} placeholder="e.g. JEE-ADV-2027" />
            <FormField label="Course" name="course" type="select" value={form.course} onChange={setField} error={errors.course} options={courses} />
            <FormField label="Faculty" name="faculty" type="select" value={form.faculty} onChange={setField} error={errors.faculty} options={faculty.map((f) => ({ value: f.name, label: `${f.name} (${f.department})` }))} />
            <FormField label="Classroom" name="classroom" type="select" value={form.classroom} onChange={setField} error={errors.classroom} options={classrooms.map((c) => ({ value: c.name, label: `${c.name} (Capacity: ${c.capacity})` }))} />
            <FormField label="Maximum Students" name="maxStudents" type="number" value={form.maxStudents} onChange={setField} error={errors.maxStudents} placeholder="e.g. 40" min={1} max={200} />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Schedule</h2>
          <div className="form-grid">
            <FormField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={setField} error={errors.startDate} min={minDate} />
            <FormField label="End Date" name="endDate" type="date" value={form.endDate} onChange={setField} error={errors.endDate} min={minDate} />
            <FormField label="Start Time" name="startTime" type="time" value={form.startTime} onChange={setField} error={errors.startTime} />
            <FormField label="End Time" name="endTime" type="time" value={form.endTime} onChange={setField} error={errors.endTime} />
            <div className="field-span-2">
              <DaySelector selectedDays={form.days} onChange={setDays} error={errors.days} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Status</h2>
          <div className="form-grid">
            <FormField label="Status" name="status" type="select" value={form.status} onChange={setField} options={statusOptions} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Batch</button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          <button type="button" className="btn btn-ghost" onClick={handleReset}>Cancel</button>
        </div>
      </form>

      <SuccessNotification show={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
