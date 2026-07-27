import { motion } from 'framer-motion'
import { MdBook, MdSchool, MdLayers, MdLocationOn } from 'react-icons/md'
import type { AssignedCourse } from '../types/profile.types'

interface AssignedCoursesProps {
  courses: AssignedCourse[]
}

export default function AssignedCourses({ courses }: AssignedCoursesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Assigned Courses</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Semester</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase">Branch</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MdSchool className="text-gray-400 text-sm" />
                    {c.course}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MdBook className="text-gray-400 text-sm" />
                    {c.subject}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MdLayers className="text-gray-400 text-sm" />
                    Sem {c.semester}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MdLocationOn className="text-gray-400 text-sm" />
                    {c.branch}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
