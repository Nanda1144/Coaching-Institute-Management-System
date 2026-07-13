import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RegistrationFormData } from '../types/registration.types'
import FormField from './FormField'
import SelectField from './SelectField'
import { qualificationOptions, specializationOptions, departmentOptions, designationOptions } from '../data/registrationData'

interface AcademicDetailsSectionProps {
  register: UseFormRegister<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
}

export default function AcademicDetailsSection({ register, errors }: AcademicDetailsSectionProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">2</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Academic Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          label="Qualification"
          registration={register('qualification', { required: 'Qualification is required' })}
          error={errors.qualification}
          required
          options={qualificationOptions}
        />
        <SelectField
          label="Specialization"
          registration={register('specialization', { required: 'Specialization is required' })}
          error={errors.specialization}
          required
          options={specializationOptions}
        />
        <FormField
          label="Experience (Years)"
          registration={register('experience', {
            required: 'Experience is required',
            min: { value: 0, message: 'Experience cannot be negative' },
          })}
          error={errors.experience}
          required
          type="number"
          placeholder="e.g. 5"
        />
        <SelectField
          label="Department"
          registration={register('department', { required: 'Department is required' })}
          error={errors.department}
          required
          options={departmentOptions}
        />
        <SelectField
          label="Designation"
          registration={register('designation', { required: 'Designation is required' })}
          error={errors.designation}
          required
          options={designationOptions}
        />
      </div>
    </div>
  )
}
