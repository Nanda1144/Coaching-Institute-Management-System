import { motion } from 'framer-motion'
import { MdSchool, MdVisibility, MdEdit, MdAssignment } from 'react-icons/md'
import type { FacultySearchResult } from '../types/search.types'
import FacultyCard from './FacultyCard'

interface SearchResultsProps {
  faculty: FacultySearchResult[]
  view: 'card' | 'table'
  onView: (id: string) => void
  onEdit: (id: string) => void
  onAssign: (id: string) => void
}

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
}

export default function SearchResults({ faculty, view, onView, onEdit, onAssign }: SearchResultsProps) {
  if (faculty.length === 0) {
    return (
      <div className="text-center py-16">
        <MdSchool className="text-5xl mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-400">No faculty members found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  if (view === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {faculty.map((f, i) => (
          <FacultyCard
            key={f.id}
            faculty={f}
            index={i}
            onView={() => onView(f.id)}
            onEdit={() => onEdit(f.id)}
            onAssign={() => onAssign(f.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Photo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Name / ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Designation</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Qualification</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Experience</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map((f, i) => (
              <motion.tr
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-sm">
                    {f.photo || f.name.charAt(0)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{f.name}</p>
                  <p className="text-xs text-gray-400">{f.id}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                    {f.department}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{f.designation}</td>
                <td className="py-3 px-4 text-gray-600 text-xs">{f.qualification}</td>
                <td className="py-3 px-4 text-gray-600">{f.experience} yrs</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[f.status] || 'bg-gray-100 text-gray-600'}`}>
                    {f.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(f.id)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="View">
                      <MdVisibility className="text-base" />
                    </button>
                    <button onClick={() => onEdit(f.id)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors" title="Edit">
                      <MdEdit className="text-base" />
                    </button>
                    <button onClick={() => onAssign(f.id)} className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors" title="Assign">
                      <MdAssignment className="text-base" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
