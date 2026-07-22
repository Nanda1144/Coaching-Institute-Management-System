interface DaySelectorProps {
  selectedDays: string[]
  onChange: (days: string[]) => void
  error?: string
}

const allDays = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' },
]

export default function DaySelector({ selectedDays, onChange, error }: DaySelectorProps) {
  function toggle(day: string) {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day))
    } else {
      onChange([...selectedDays, day])
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-700">Days of the Week</label>
      <div className="flex gap-1.5 flex-wrap">
        {allDays.map((day) => (
          <button
            key={day.value}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
              ${selectedDays.includes(day.value)
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50'}`}
            onClick={() => toggle(day.value)}
          >
            {day.label}
          </button>
        ))}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
