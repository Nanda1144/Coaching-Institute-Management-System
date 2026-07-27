import { motion } from 'framer-motion'
import { MdSchool, MdBook, MdLayers, MdLocationOn } from 'react-icons/md'

interface CourseAssignmentProps {
  course: string
  subject: string
  semester: string
  branch: string
  onCourseChange: (v: string) => void
  onSubjectChange: (v: string) => void
  onSemesterChange: (v: string) => void
  onBranchChange: (v: string) => void
  courseOptions: string[]
  subjectOptions: string[]
  semesterOptions: number[]
  branchOptions: string[]
}

export default function CourseAssignment({
  course, subject, semester, branch,
  onCourseChange, onSubjectChange, onSemesterChange, onBranchChange,
  courseOptions, subjectOptions, semesterOptions, branchOptions,
}: CourseAssignmentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4"
    >
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MdSchool className="text-primary text-lg" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Course Assignment</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdSchool /> Course</label>
          <select value={course} onChange={e => onCourseChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select course</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdBook /> Subject</label>
          <select value={subject} onChange={e => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select subject</option>
            {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdLayers /> Semester</label>
          <select value={semester} onChange={e => onSemesterChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select semester</option>
            {semesterOptions.map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdLocationOn /> Branch</label>
          <select value={branch} onChange={e => onBranchChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select branch</option>
            {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
    </motion.div>
  )
}
