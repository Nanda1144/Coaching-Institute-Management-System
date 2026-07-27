import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RegistrationFormData } from '../types/registration.types'
import FormField from './FormField'

interface AccountDetailsSectionProps {
  register: UseFormRegister<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
  passwordValue: string
}

export default function AccountDetailsSection({ register, errors, passwordValue }: AccountDetailsSectionProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-sm font-bold">4</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Username"
          registration={register('username', {
            required: 'Username is required',
            minLength: { value: 4, message: 'Username must be at least 4 characters' },
          })}
          error={errors.username}
          required
          placeholder="Choose a username"
        />
        <FormField
          label="Password"
          registration={register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
          error={errors.password}
          required
          type="password"
          placeholder="Min. 8 characters"
        />
        <FormField
          label="Confirm Password"
          registration={register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === passwordValue || 'Passwords do not match',
          })}
          error={errors.confirmPassword}
          required
          type="password"
          placeholder="Re-enter password"
        />
      </div>
    </div>
  )
}
