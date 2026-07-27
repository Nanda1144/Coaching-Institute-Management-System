import { motion } from 'framer-motion'
import { MdSchool, MdArrowUpward, MdArrowDownward, MdUnfoldMore } from 'react-icons/md'
import type { Faculty, SortConfig } from '../types/faculty.types'
import { getInitials } from '../../../utils/unwrap'
import StatusBadge from './StatusBadge'
import FacultyActions from './FacultyActions'

interface FacultyTableProps {
  faculty: Faculty[]
  sortConfig: SortConfig
  requestSort: (key: keyof Faculty) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAssignCourse: (id: string) => void
}

const columns: { key: keyof Faculty; label: string; sortable: boolean }[] = [
  { key: 'id', label: 'Faculty ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'designation', label: 'Designation', sortable: true },
  { key: 'qualification', label: 'Qualification', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'joiningDate', label: 'Joining Date', sortable: true },
]

function SortIcon({ columnKey, sortConfig }: { columnKey: keyof Faculty; sortConfig: SortConfig }) {
  if (sortConfig.key !== columnKey) {
    return <MdUnfoldMore className="text-gray-300 text-base" />
  }
  return sortConfig.direction === 'asc' ? (
    <MdArrowUpward className="text-primary text-base" />
  ) : (
    <MdArrowDownward className="text-primary text-base" />
  )
}

export default function FacultyTable({ faculty, sortConfig, requestSort, onView, onEdit, onDelete, onAssignCourse }: FacultyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
            {columns.map(col => (
              <th
                key={col.key}
                className={`text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                  col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''
                }`}
                onClick={() => col.sortable && requestSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && <SortIcon columnKey={col.key} sortConfig={sortConfig} />}
                </div>
              </th>
            ))}
            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center py-16 text-gray-500">
                <MdSchool className="text-5xl mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium text-gray-400">No faculty members found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
              </td>
            </tr>
          ) : (
            faculty.map((f, index) => (
              <motion.tr
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                    {f.photo || getInitials(f.name, '?')}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-mono text-gray-600">{f.id}</td>
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-gray-800">{f.name}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                    {f.department}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{f.designation}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{f.qualification}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{f.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{f.phone}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={f.status} />
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{f.joiningDate}</td>
                <td className="py-3 px-4">
                  <FacultyActions
                    onView={() => onView(f.id)}
                    onEdit={() => onEdit(f.id)}
                    onDelete={() => onDelete(f.id)}
                    onAssignCourse={() => onAssignCourse(f.id)}
                  />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
