import { motion } from 'framer-motion'
import { MdRateReview, MdSchool, MdDownload, MdErrorOutline, MdMilitaryTech, MdCalendarToday } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

function getGradeInfo(percentage: number) {
  if (percentage >= 90) return { grade: 'A+', color: 'badge-success', label: 'Outstanding' }
  if (percentage >= 80) return { grade: 'A', color: 'badge-success', label: 'Excellent' }
  if (percentage >= 70) return { grade: 'B+', color: 'badge-info', label: 'Very Good' }
  if (percentage >= 60) return { grade: 'B', color: 'badge-info', label: 'Good' }
  if (percentage >= 50) return { grade: 'C', color: 'badge-warning', label: 'Satisfactory' }
  return { grade: 'D', color: 'badge-danger', label: 'Needs Improvement' }
}

export default function StudentCertificatesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-certificates'],
    queryFn: () => studentDashboardService.getCertificates(),
  })

  const result = data?.data
  const certificates = result?.certificates ?? []
  const studentName = result?.studentName ?? 'Student'
  const rollNumber = result?.rollNumber ?? ''
  const course = result?.course ?? ''
  const department = result?.department ?? ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-neutral-500 text-sm mt-1">View your academic achievements and certificates</p>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <MdSchool size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{studentName}</h2>
              <p className="text-sm text-white/70">{rollNumber} &bull; {course} &bull; {department}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{result?.totalCertificates ?? 0}</p>
              <p className="text-xs text-white/70">Certificates</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{certificates.length > 0 ? Math.round(certificates.reduce((s: number, c: any) => s + c.percentage, 0) / certificates.length) : 0}%</p>
              <p className="text-xs text-white/70">Avg Score</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{course || '—'}</p>
              <p className="text-xs text-white/70">Course</p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton rounded w-1/2" />
                    <div className="h-3 skeleton rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load certificates</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : certificates.length === 0 ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdMilitaryTech size={28} /></div>
            <h3>No certificates yet</h3>
            <p>Certificates will appear here once your assignments are graded.</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-3">
            {certificates.map((cert: {
              id: string; title: string; subject: string; marksObtained: number;
              totalMarks: number; percentage: number; grade: string;
              feedback: string; issueDate: string
            }) => {
              const gradeInfo = getGradeInfo(cert.percentage)
              return (
                <div key={cert.id} className="card p-5 hover:shadow-card-hover border-l-4 border-l-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                        <MdMilitaryTech className="text-amber-500" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-800">{cert.title}</h3>
                        <p className="text-xs text-neutral-400">{cert.subject}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-neutral-400">
                            <MdCalendarToday size={14} />
                            {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {cert.marksObtained}/{cert.totalMarks} ({cert.percentage}%)
                          </span>
                        </div>
                        {cert.feedback && (
                          <p className="text-xs text-neutral-500 mt-1 italic">"{cert.feedback}"</p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className={`badge ${gradeInfo.color}`}>{cert.grade}</span>
                      <span className="text-[10px] text-neutral-400">{gradeInfo.label}</span>
                      <button className="btn btn-ghost btn-sm mt-1"><MdDownload size={14} /> PDF</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
