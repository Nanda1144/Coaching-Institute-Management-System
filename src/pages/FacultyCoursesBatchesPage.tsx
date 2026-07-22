import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdBook, MdGroup, MdRefresh, MdSchool, MdFolder } from 'react-icons/md'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FacultyCoursesBatchesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [faculty, setFaculty] = useState<any>(null)

  useEffect(() => {
    api.get('/faculty/profile')
      .then((res) => {
        const data = res.data?.data || {}
        setFaculty(data)
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading your courses and batches..." />

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="empty-state card">
          <div className="empty-state-icon"><MdSchool size={28} className="text-danger" /></div>
          <h3>Failed to load data</h3>
          <p className="text-neutral-500">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4 flex items-center gap-2"><MdRefresh /> Retry</button>
        </div>
      </div>
    )
  }

  const courses = faculty?.assignedCourses || []
  const subjects = faculty?.assignedSubjects || []
  const batches = faculty?.assignedBatches || []
  const semesters = faculty?.assignedSemesters || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Courses & Batches</h1>
          <p className="text-neutral-500 text-sm mt-1">Courses, subjects, and batches assigned to you</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <MdBook className="text-primary" size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Courses</h2>
                <p className="text-xs text-neutral-400">{courses.length} assigned</p>
              </div>
            </div>
            {courses.length === 0 ? (
              <p className="text-sm text-neutral-400">No courses assigned yet</p>
            ) : (
              <div className="space-y-2">
                {courses.map((c: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50">
                    <MdFolder className="text-primary-400" size={16} />
                    <span className="text-sm text-neutral-700">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <MdSchool className="text-emerald-600" size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Subjects</h2>
                <p className="text-xs text-neutral-400">{subjects.length} assigned</p>
              </div>
            </div>
            {subjects.length === 0 ? (
              <p className="text-sm text-neutral-400">No subjects assigned yet</p>
            ) : (
              <div className="space-y-2">
                {subjects.map((s: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50">
                    <MdFolder className="text-emerald-400" size={16} />
                    <span className="text-sm text-neutral-700">{s}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <MdGroup className="text-violet-600" size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Batches</h2>
                <p className="text-xs text-neutral-400">{batches.length} assigned</p>
              </div>
            </div>
            {batches.length === 0 ? (
              <p className="text-sm text-neutral-400">No batches assigned yet</p>
            ) : (
              <div className="space-y-2">
                {batches.map((b: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50">
                    <MdGroup className="text-violet-400" size={16} />
                    <span className="text-sm text-neutral-700">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {semesters.length > 0 && (
          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <MdFolder className="text-amber-600" size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Assigned Semesters</h2>
                <p className="text-xs text-neutral-400">{semesters.length} semesters</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {semesters.map((s: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium">{s}</span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
