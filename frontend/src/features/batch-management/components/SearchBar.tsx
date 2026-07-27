import { MdSearch, MdClose } from 'react-icons/md'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search by batch name, ID, course, or faculty...' }: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[220px] max-w-[480px]">
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
      <input
        type="text"
        className="input-field pl-9 pr-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 p-1 rounded transition-colors"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <MdClose size={14} />
        </button>
      )}
    </div>
  )
}
