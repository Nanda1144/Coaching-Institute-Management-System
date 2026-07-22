import { useState } from 'react'
import { MdSearch, MdPerson, MdClose } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import { getInitials } from '../../../utils/unwrap'

interface FacultyOption {
  id: string
  name: string
  department: string
}

interface FacultySelectorProps {
  options: FacultyOption[]
  departmentFilter: string
  onDepartmentFilterChange: (value: string) => void
  selectedId: string
  onSelect: (id: string) => void
  departmentFilterOptions: string[]
}

export default function FacultySelector({
  options,
  departmentFilter,
  onDepartmentFilterChange,
  selectedId,
  onSelect,
  departmentFilterOptions,
}: FacultySelectorProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = options.filter(f => {
    const matchDept = departmentFilter === 'All Departments' || f.department === departmentFilter
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  const selected = options.find(f => f.id === selectedId)

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Faculty Selector</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={departmentFilter}
          onChange={e => { onDepartmentFilterChange(e.target.value); setSearch('') }}
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        >
          {departmentFilterOptions.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm cursor-pointer hover:border-primary/30 transition-all"
          >
            <MdPerson className="text-gray-400 text-lg" />
            <span className={selected ? 'text-gray-700' : 'text-gray-400'}>
              {selected ? selected.name : 'Select faculty member...'}
            </span>
          </div>
          {selected && (
            <button onClick={() => { onSelect(''); setSearch('') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <MdClose />
            </button>
          )}

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                className="absolute z-50 mt-1 w-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden origin-top"
              >
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search faculty..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No faculty found</p>
                  ) : (
                    filtered.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { onSelect(f.id); setOpen(false); setSearch('') }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-3 ${
                          f.id === selectedId ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          f.id === selectedId ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {getInitials(f.name)}
                        </div>
                        <div>
                          <p className="font-medium">{f.name}</p>
                          <p className="text-xs text-gray-400">{f.id} · {f.department}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
