import { motion } from 'framer-motion'
import { MdPerson, MdSchool, MdBook, MdGroups2 } from 'react-icons/md'
import type { StudentInfo } from '../types/studentTimetable.types'

interface StudentInfoCardProps {
  info: StudentInfo
}

export default function StudentInfoCard({ info }: StudentInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner flex-shrink-0 border-2 border-white/50">
          {info.photo ? (
            <img src={info.photo} alt={info.name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <MdPerson className="text-4xl text-primary" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-800">{info.name}</h3>
          <p className="text-sm text-primary font-medium mt-0.5">{info.rollNumber}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-1.5 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MdSchool className="text-primary/70" />
              {info.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MdBook className="text-primary/70" />
              {info.course}
            </span>
            <span className="flex items-center gap-1.5">
              <MdGroups2 className="text-primary/70" />
              {info.batch}
            </span>
            <span className="flex items-center gap-1.5">
              <MdSchool className="text-primary/70" />
              Sem {info.semester}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
