import { motion } from 'framer-motion'
import { MdBook, MdSchool, MdGroup, MdStar, MdErrorOutline } from 'react-icons/md'
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

export default function StudentCourseDetailsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-overview'],
    queryFn: () => studentDashboardService.getOverview(),
  })

  const overview = data?.data
  const student = overview?.student ?? {}
  const stats = overview?.stats ?? {}

  const course = student.course || 'Not assigned'
  const department = student.department || 'General'
  const semester = student.semester || '-'
  const batch = student.batch || '-'
  const section = student.section || '-'

  const courseInfo = [
    { label: 'Course Name', value: course },
    { label: 'Department', value: department },
    { label: 'Current Semester', value: `Semester ${semester}` },
    { label: 'Batch', value: batch },
    { label: 'Section', value: section },
    { label: 'Roll Number', value: student.rollNumber || '-' },
  ]

  const semesterSubjects = [
    { code: 'CS101', name: 'Data Structures', credits: 4, faculty: 'Dr. Sharma' },
    { code: 'CS102', name: 'Database Systems', credits: 4, faculty: 'Prof. Verma' },
    { code: 'CS103', name: 'Computer Networks', credits: 3, faculty: 'Dr. Patel' },
    { code: 'CS104', name: 'Operating Systems', credits: 3, faculty: 'Prof. Singh' },
    { code: 'CS105', name: 'Software Engineering', credits: 3, faculty: 'Dr. Gupta' },
    { code: 'CS106', name: 'Mathematics III', credits: 4, faculty: 'Prof. Kumar' },
  ]

  const totalCredits = semesterSubjects.reduce((s, subj) => s + subj.credits, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">Course Details</h1>
          <p className="text-neutral-500 text-sm mt-1">View your course information and curriculum</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5 animate-pulse">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            </div>
            <div className="card p-5 animate-pulse">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load course details</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="stat-card text-center">
                <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdSchool size={24} /></div>
                <div className="stat-value">{course}</div>
                <div className="stat-label">Course</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-emerald-50 text-emerald-600 mx-auto"><MdStar size={24} /></div>
                <div className="stat-value">{semesterSubjects.length}</div>
                <div className="stat-label">Subjects (Sem {semester})</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-violet-50 text-violet-600 mx-auto"><MdGroup size={24} /></div>
                <div className="stat-value">{totalCredits}</div>
                <div className="stat-label">Total Credits</div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="card p-5">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Course Information</h3>
                <div className="space-y-3">
                  {courseInfo.map((info) => (
                    <div key={info.label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                      <span className="text-sm text-neutral-500">{info.label}</span>
                      <span className="text-sm font-medium text-neutral-800">{info.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card p-5">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Semester {semester} Subjects
                </h3>
                <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0, padding: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Subject</th>
                        <th className="text-center">Credits</th>
                        <th>Faculty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semesterSubjects.map((subj) => (
                        <tr key={subj.code}>
                          <td className="text-xs font-mono text-neutral-500">{subj.code}</td>
                          <td className="font-medium text-neutral-800">{subj.name}</td>
                          <td className="text-center text-neutral-600">{subj.credits}</td>
                          <td className="text-neutral-500">{subj.faculty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
