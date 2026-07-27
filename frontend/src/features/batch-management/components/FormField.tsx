interface Option {
  value: string
  label: string
}

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'select' | 'number' | 'date' | 'time'
  value: string
  onChange: (name: string, value: string) => void
  error?: string
  placeholder?: string
  options?: Option[] | string[]
  disabled?: boolean
  min?: number | string
  max?: number | string
}

export default function FormField({
  label, name, type = 'text', value, onChange, error, placeholder, options, disabled, min, max,
}: FormFieldProps) {
  const id = `field-${name}`

  return (
    <div className={`input-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="text-xs font-semibold text-neutral-700">{label}</label>
      {type === 'select' ? (
        <select
          id={id}
          className={`select-field ${error ? '!border-red-500' : ''}`}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
        >
          <option value="">Select {label}</option>
          {options?.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value
            const display = typeof opt === 'string' ? opt : opt.label
            return <option key={val} value={val}>{display}</option>
          })}
        </select>
      ) : (
        <input
          id={id}
          className={`input-field ${error ? '!border-red-500' : ''}`}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
        />
      )}
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
