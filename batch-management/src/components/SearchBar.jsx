import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by batch name, ID, course, or faculty..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
