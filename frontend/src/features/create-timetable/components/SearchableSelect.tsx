import { useState, useRef, useEffect, useMemo } from 'react'
import { MdExpandMore, MdClose } from 'react-icons/md'
import type { DropdownOption } from '../types/timetableForm.types'

interface SearchableSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
}

export default function SearchableSelect({
  label, value, onChange, options, error, required, placeholder = 'Search & select...', disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label || '',
    [options, value]
  )

  const filteredOptions = useMemo(
    () => options.filter(
      (o) => o.label.toLowerCase().includes(search.toLowerCase())
    ),
    [options, search]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (opt: DropdownOption) => {
    onChange(opt.value)
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = () => {
    onChange('')
    setSearch('')
  }

  const selectedLabelDisplay = selectedLabel || value

  if (disabled) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
        <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-500 flex items-center h-[42px]">
          {selectedLabelDisplay || 'Not set'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <div
          className={`flex items-center w-full min-h-[42px] px-3.5 py-2 rounded-xl border bg-white/80 text-sm cursor-pointer transition-all ${
            error
              ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200 focus-within:border-red-400'
              : 'border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30'
          } ${isOpen ? 'ring-2 ring-primary/20 border-primary/30' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {value && !isOpen ? (
            <span className="flex-1 text-gray-700 truncate">{selectedLabel}</span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={isOpen ? search : ''}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isOpen ? 'Type to search...' : (value ? selectedLabel : placeholder)}
              className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none text-sm"
              onClick={(e) => { e.stopPropagation(); if (!isOpen) setIsOpen(true) }}
            />
          )}
          <div className="flex items-center gap-1 ml-2">
            {value && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear() }}
                className="p-0.5 rounded hover:bg-gray-100 transition-colors"
              >
                <MdClose className="text-gray-400 text-sm" />
              </button>
            )}
            <MdExpandMore className={`text-gray-400 text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-56 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-400 text-center">No options found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-primary/5 transition-colors ${
                    opt.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
