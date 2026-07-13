import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RegistrationFormData } from '../types/registration.types'
import FormField from './FormField'
import SelectField from './SelectField'
import { employmentTypeOptions, branchOptions, statusOptions } from '../data/registrationData'

interface EmploymentDetailsSectionProps {
  register: UseFormRegister<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
}

export default function EmploymentDetailsSection({ register, errors }: EmploymentDetailsSectionProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">3</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Joining Date"
          registration={register('joiningDate', { required: 'Joining date is required' })}
          error={errors.joiningDate}
          required
          type="date"
        />
        <SelectField
          label="Employment Type"
          registration={register('employmentType', { required: 'Employment type is required' })}
          error={errors.employmentType}
          required
          options={employmentTypeOptions}
        />
        <FormField
          label="Salary"
          registration={register('salary', { required: 'Salary is required' })}
          error={errors.salary}
          required
          placeholder="e.g. ₹75,000"
        />
        <SelectField
          label="Branch"
          registration={register('branch', { required: 'Branch is required' })}
          error={errors.branch}
          required
          options={branchOptions}
        />
        <SelectField
          label="Status"
          registration={register('status', { required: 'Status is required' })}
          error={errors.status}
          required
          options={statusOptions}
        />
      </div>
    </div>
  )
}
