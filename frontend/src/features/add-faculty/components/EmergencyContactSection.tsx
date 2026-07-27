import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RegistrationFormData } from '../types/registration.types'
import FormField from './FormField'
import SelectField from './SelectField'
import { relationshipOptions } from '../data/registrationData'

interface EmergencyContactSectionProps {
  register: UseFormRegister<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
}

export default function EmergencyContactSection({ register, errors }: EmergencyContactSectionProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">5</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Contact Name"
          registration={register('emergencyName', { required: 'Emergency contact name is required' })}
          error={errors.emergencyName}
          required
          placeholder="Full name"
        />
        <FormField
          label="Contact Phone"
          registration={register('emergencyPhone', {
            required: 'Emergency phone is required',
            pattern: { value: /^[+\-\d\s()]{10,}$/, message: 'Invalid phone number' },
          })}
          error={errors.emergencyPhone}
          required
          placeholder="+91-9876543210"
        />
        <SelectField
          label="Relationship"
          registration={register('emergencyRelationship', { required: 'Relationship is required' })}
          error={errors.emergencyRelationship}
          required
          options={relationshipOptions}
        />
      </div>
    </div>
  )
}
