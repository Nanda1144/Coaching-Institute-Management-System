import { MdAccessTime } from 'react-icons/md'

interface TimePickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export default function TimePickerField({ label, value, onChange, error, required, disabled = false }: TimePickerFieldProps) {
  if (disabled) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
        <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-500 flex items-center h-[42px]">
          {value
            ? new Date(`2000-01-01T${value}`).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: true,
              })
            : 'Not set'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <MdAccessTime className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
              : 'border-gray-200 focus:ring-primary/20 focus:border-primary/30'
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
