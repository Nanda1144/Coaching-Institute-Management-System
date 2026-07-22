import { motion } from 'framer-motion'
import { MdSchedule, MdLocationOn, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import examService from '../services/exam/exam.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StudentExamSchedulePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-exams'],
    queryFn: () => examService.getAll(),
  })

  const exams = data?.data ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">Exam Schedule</h1>
          <p className="text-neutral-500 text-sm mt-1">View your upcoming examinations</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-md skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton rounded w-1/3" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load exam schedule</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : exams.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdSchedule size={28} /></div>
            <h3>No exams scheduled</h3>
            <p>There are no upcoming exams at this time.</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-3">
            {exams.map((exam: { id: string; date: string; subject: string; type: string; time: string; location: string }) => (
              <div key={exam.id} className="card p-5 hover:shadow-card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary leading-tight">{new Date(exam.date).getDate()}</p>
                      <p className="text-xs text-primary font-medium">{new Date(exam.date).toLocaleString('en-US', { month: 'short' })}</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-800">{exam.subject}</h3>
                        <span className="badge badge-info mt-1 inline-block">{exam.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1"><MdSchedule size={14} /> {exam.time}</span>
                      <span className="flex items-center gap-1"><MdLocationOn size={14} /> {exam.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
