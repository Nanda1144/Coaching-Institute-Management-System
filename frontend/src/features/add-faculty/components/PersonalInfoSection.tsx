import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RegistrationFormData } from '../types/registration.types'
import FormField from './FormField'
import SelectField from './SelectField'
import PhotoUpload from './PhotoUpload'
import { genderOptions } from '../data/registrationData'

interface PersonalInfoSectionProps {
  register: UseFormRegister<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
  photoValue: string
  onPhotoChange: (value: string) => void
}

export default function PersonalInfoSection({ register, errors, photoValue, onPhotoChange }: PersonalInfoSectionProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">1</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Faculty ID"
          registration={register('facultyId', { required: 'Faculty ID is required' })}
          error={errors.facultyId}
          required
          placeholder="e.g. FAC-026"
        />
        <FormField
          label="Full Name"
          registration={register('fullName', {
            required: 'Full name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
          })}
          error={errors.fullName}
          required
          placeholder="Enter full name"
        />
        <SelectField
          label="Gender"
          registration={register('gender', { required: 'Gender is required' })}
          error={errors.gender}
          required
          options={genderOptions}
        />
        <FormField
          label="Date of Birth"
          registration={register('dob', { required: 'Date of birth is required' })}
          error={errors.dob}
          required
          type="date"
        />
        <FormField
          label="Email"
          registration={register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
          })}
          error={errors.email}
          required
          type="email"
          placeholder="email@college.edu"
        />
        <FormField
          label="Phone"
          registration={register('phone', {
            required: 'Phone is required',
            pattern: { value: /^[+\-\d\s()]{10,}$/, message: 'Invalid phone number' },
          })}
          error={errors.phone}
          required
          placeholder="+91-9876543210"
        />
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            label="Address"
            registration={register('address', { required: 'Address is required' })}
            error={errors.address}
            required
            placeholder="Enter full address"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <PhotoUpload value={photoValue} onChange={onPhotoChange} error={errors.photo} />
        </div>
      </div>
    </div>
  )
}
