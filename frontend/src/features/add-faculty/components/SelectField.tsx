import type { UseFormRegisterReturn } from 'react-hook-form'

interface SelectFieldProps {
  label: string
  registration: UseFormRegisterReturn
  error?: { message?: string }
  required?: boolean
  options: readonly string[] | string[]
  placeholder?: string
}

export default function SelectField({ label, registration, error, required, options, placeholder = 'Select...' }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        {...registration}
        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  )
}
