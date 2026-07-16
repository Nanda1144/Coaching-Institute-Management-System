import './FormField.css';

export default function FormField({
  label, name, type = 'text', value, onChange, error, placeholder, options, disabled, min, max,
}) {
  const id = `field-${name}`;

  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>{label}</label>
      {type === 'select' ? (
        <select id={id} className="field-input" value={value} onChange={(e) => onChange(name, e.target.value)} disabled={disabled}>
          <option value="">Select {label}</option>
          {options?.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const display = typeof opt === 'string' ? opt : opt.label;
            return <option key={val} value={val}>{display}</option>;
          })}
        </select>
      ) : (
        <input id={id} className="field-input" type={type} value={value} onChange={(e) => onChange(name, e.target.value)} placeholder={placeholder} disabled={disabled} min={min} max={max} />
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
