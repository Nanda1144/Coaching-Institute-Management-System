import { motion } from 'framer-motion'
import { MdBook, MdDelete, MdSchool, MdLayers, MdGroup } from 'react-icons/md'
import type { AssignedSubject } from '../types/assignment.types'

interface AssignedSubjectsTableProps {
  subjects: AssignedSubject[]
  onRemove: (id: string) => void
}

export default function AssignedSubjectsTable({ subjects, onRemove }: AssignedSubjectsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4"
    >
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MdBook className="text-primary text-lg" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Assigned Subjects</h3>
        <span className="ml-auto text-xs text-gray-400">{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</span>
      </div>

      {subjects.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No subjects assigned yet. Use the form above to assign subjects.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Semester</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Batch</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5">
                      <MdBook className="text-gray-400 text-sm" />
                      <span className="font-medium text-gray-700">{s.subject}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <MdSchool className="text-gray-400 text-sm" />
                      {s.course}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <MdLayers className="text-gray-400 text-sm" />
                      Sem {s.semester}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <MdGroup className="text-gray-400 text-sm" />
                      {s.batch}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onRemove(s.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
