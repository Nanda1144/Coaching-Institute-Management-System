import { motion } from 'framer-motion'
import { MdGroup, MdViewModule, MdCalendarMonth } from 'react-icons/md'

interface BatchAssignmentProps {
  batch: string
  section: string
  academicYear: string
  onBatchChange: (v: string) => void
  onSectionChange: (v: string) => void
  onAcademicYearChange: (v: string) => void
  batchOptions: string[]
  sectionOptions: string[]
  academicYearOptions: string[]
}

export default function BatchAssignment({
  batch, section, academicYear,
  onBatchChange, onSectionChange, onAcademicYearChange,
  batchOptions, sectionOptions, academicYearOptions,
}: BatchAssignmentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 space-y-4"
    >
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MdGroup className="text-primary text-lg" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Batch Assignment</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdGroup /> Batch</label>
          <select value={batch} onChange={e => onBatchChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select batch</option>
            {batchOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdViewModule /> Section</label>
          <select value={section} onChange={e => onSectionChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select section</option>
            {sectionOptions.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MdCalendarMonth /> Academic Year</label>
          <select value={academicYear} onChange={e => onAcademicYearChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select year</option>
            {academicYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
    </motion.div>
  )
}
