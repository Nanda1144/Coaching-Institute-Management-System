import './DaySelector.css';

const allDays = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' },
];

export default function DaySelector({ selectedDays, onChange, error }) {
  function toggle(day) {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  }

  return (
    <div className={`day-selector ${error ? 'has-error' : ''}`}>
      <label className="field-label">Days of the Week</label>
      <div className="day-chips">
        {allDays.map((day) => (
          <button
            key={day.value}
            type="button"
            className={`day-chip ${selectedDays.includes(day.value) ? 'selected' : ''}`}
            onClick={() => toggle(day.value)}
          >
            {day.label}
          </button>
        ))}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
