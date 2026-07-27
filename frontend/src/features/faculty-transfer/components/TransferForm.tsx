import { motion } from 'framer-motion'
import { MdPerson, MdBusiness, MdSchool, MdDateRange, MdDescription } from 'react-icons/md'
import type { TransferRequest } from '../types/transfer.types'

interface TransferFormProps {
  form: TransferRequest
  facultyList: { id: string; name: string; branch: string; department: string }[]
  branchOptions: string[]
  departmentOptions: string[]
  onFormChange: (form: TransferRequest) => void
  onFacultyChange: (id: string) => void
}

export default function TransferForm({
  form, facultyList, branchOptions, departmentOptions, onFormChange, onFacultyChange,
}: TransferFormProps) {
  const selectedFaculty = facultyList.find(f => f.id === form.facultyId)

  const update = (field: keyof TransferRequest, value: string) => {
    onFormChange({ ...form, [field]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6 space-y-5"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <MdPerson className="text-primary text-lg" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Transfer Details</h3>
          <p className="text-xs text-gray-500">Initiate a branch or department transfer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdPerson className="text-gray-400" /> Faculty Name <span className="text-red-500">*</span>
          </label>
          <select
            value={form.facultyId}
            onChange={e => onFacultyChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Select faculty...</option>
            {facultyList.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdBusiness className="text-gray-400" /> Current Branch
          </label>
          <input readOnly value={selectedFaculty?.branch || ''}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdSchool className="text-gray-400" /> Current Department
          </label>
          <input readOnly value={selectedFaculty?.department || ''}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed" />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdBusiness className="text-gray-400" /> New Branch <span className="text-red-500">*</span>
          </label>
          <select value={form.newBranch} onChange={e => update('newBranch', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
            <option value="">Select new branch...</option>
            {branchOptions.filter(b => b !== selectedFaculty?.branch).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdSchool className="text-gray-400" /> New Department <span className="text-red-500">*</span>
          </label>
          <select value={form.newDepartment} onChange={e => update('newDepartment', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
            <option value="">Select new department...</option>
            {departmentOptions.filter(d => d !== selectedFaculty?.department).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdDateRange className="text-gray-400" /> Transfer Date <span className="text-red-500">*</span>
          </label>
          <input type="date" value={form.transferDate} onChange={e => update('transferDate', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MdDescription className="text-gray-400" /> Reason <span className="text-red-500">*</span>
          </label>
          <input value={form.reason} onChange={e => update('reason', e.target.value)} placeholder="e.g. Department restructuring"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
      </div>
    </motion.div>
  )
}
