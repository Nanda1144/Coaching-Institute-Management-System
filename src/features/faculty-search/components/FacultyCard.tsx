import { motion } from 'framer-motion'
import { MdSchool, MdBook, MdTimeline, MdVisibility, MdEdit, MdAssignment } from 'react-icons/md'
import type { FacultySearchResult } from '../types/search.types'

interface FacultyCardProps {
  faculty: FacultySearchResult
  index: number
  onView: () => void
  onEdit: () => void
  onAssign: () => void
}

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
}

export default function FacultyCard({ faculty, index, onView, onEdit, onAssign }: FacultyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md hover:shadow-lg transition-all overflow-hidden group"
    >
      <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative">
        <div className="absolute -bottom-8 left-5 w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
          {faculty.photo ? (
            <img src={faculty.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">{faculty.name.charAt(0)}</span>
          )}
        </div>
      </div>

      <div className="pt-10 px-5 pb-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-800">{faculty.name}</h4>
            <p className="text-xs text-gray-500">{faculty.id}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[faculty.status] || 'bg-gray-100 text-gray-600'}`}>
            {faculty.status}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <MdSchool className="text-primary/60 text-sm" />
            <span>{faculty.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdBook className="text-primary/60 text-sm" />
            <span>{faculty.qualification}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdTimeline className="text-primary/60 text-sm" />
            <span>{faculty.experience} years experience</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors">
            <MdVisibility /> View
          </button>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-amber-600 hover:bg-amber-50 text-xs font-medium transition-colors">
            <MdEdit /> Edit
          </button>
          <button onClick={onAssign} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-purple-600 hover:bg-purple-50 text-xs font-medium transition-colors">
            <MdAssignment /> Assign
          </button>
        </div>
      </div>
    </motion.div>
  )
}
