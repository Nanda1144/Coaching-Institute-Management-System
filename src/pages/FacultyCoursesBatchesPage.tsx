import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdBook, MdGroup, MdSchool, MdRefresh, MdSearch, MdCheckCircle, MdCancel, MdHourglassEmpty, MdPerson, MdFolder } from 'react-icons/md'
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

const TABS = [
  { key: 'courses', label: 'Courses', icon: MdBook },
  { key: 'batches', label: 'Batches', icon: MdGroup },
  { key: 'subjects', label: 'Subjects', icon: MdSchool },
]

export default function FacultyCoursesBatchesPage() {
  const [activeTab, setActiveTab] = useState('courses')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [faculty, setFaculty] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [registrationsLoading, setRegistrationsLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/faculty/profile')
      .then((res) => {
        const data = res.data?.data || {}
        setFaculty(data)
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab === 'batches') {
      setRegistrationsLoading(true)
      api.get('/faculty/registration-requests')
        .then((res) => {
          const raw = res.data?.data ?? res.data ?? []
          setRegistrations(Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [])
        })
        .catch(() => setRegistrations([]))
        .finally(() => setRegistrationsLoading(false))
    }
  }, [activeTab])

  const handleRegistrationAction = async (id: string, action: 'approved' | 'rejected' | 'hold') => {
    try {
      await api.patch(`/faculty/registration-requests/${id}`, { status: action })
      setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r))
    } catch {
      // silent
    }
  }

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

  const courses = faculty?.assignedCourses ?? faculty?.courses ?? []
  const subjects = faculty?.assignedSubjects ?? faculty?.subjects ?? []
  const batches = faculty?.assignedBatches ?? faculty?.batches ?? []
  const semesters = faculty?.assignedSemesters ?? faculty?.semesters ?? []

  const filteredRegistrations = registrations.filter((r: any) =>
    !search || r.fullName?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase())
  )

  const renderCourses = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <MdBook className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-neutral-900">Assigned Courses</h2>
      </div>
      {courses.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><MdBook size={28} /></div>
          <h3>No courses assigned</h3>
          <p className="text-neutral-500">You haven't been assigned to any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c: any, i: number) => (
            <div key={i} className="card p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <MdFolder className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{typeof c === 'string' ? c : c.name || c.courseName || c.title}</p>
                  <p className="text-xs text-neutral-400">{typeof c === 'string' ? '' : c.code || ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {semesters.length > 0 && (
        <div className="card p-4 mt-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">Assigned Semesters</p>
          <div className="flex flex-wrap gap-2">
            {semesters.map((s: any, i: number) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium">{typeof s === 'string' ? s : `Sem ${s}`}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSubjects = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <MdSchool className="text-emerald-600" size={24} />
        <h2 className="text-xl font-semibold text-neutral-900">Assigned Subjects</h2>
      </div>
      {subjects.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><MdSchool size={28} /></div>
          <h3>No subjects assigned</h3>
          <p className="text-neutral-500">You haven't been assigned to any subjects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s: any, i: number) => (
            <div key={i} className="card p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MdFolder className="text-emerald-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{typeof s === 'string' ? s : s.name || s.subjectName || s.title}</p>
                  <p className="text-xs text-neutral-400">{typeof s === 'string' ? '' : s.code || s.subjectCode || ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderBatches = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <MdGroup className="text-violet-600" size={24} />
        <h2 className="text-xl font-semibold text-neutral-900">Assigned Batches</h2>
      </div>
      {batches.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><MdGroup size={28} /></div>
          <h3>No batches assigned</h3>
          <p className="text-neutral-500">You haven't been assigned to any batches yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b: any, i: number) => (
            <div key={i} className="card p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <MdGroup className="text-violet-500" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{typeof b === 'string' ? b : b.name || b.batchName || b.title}</p>
                  <p className="text-xs text-neutral-400">{typeof b === 'string' ? '' : `${b.course || ''} · ${b.section || 'A'}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-neutral-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MdPerson className="text-primary" size={24} />
            <h3 className="text-lg font-semibold text-neutral-900">Student Registration Requests</h3>
          </div>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-8 py-1.5 text-sm w-48" />
          </div>
        </div>
        {registrationsLoading ? (
          <LoadingSpinner text="Loading registration requests..." />
        ) : filteredRegistrations.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon"><MdPerson size={28} /></div>
            <h3>No registration requests</h3>
            <p className="text-neutral-500">Pending student registrations will appear here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((r: any) => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary-50 flex items-center justify-center"><MdPerson className="text-primary" size={16} /></div>
                        <span className="font-medium text-neutral-800">{r.fullName || r.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="text-neutral-600 text-sm">{r.email}</td>
                    <td className="text-neutral-600 text-sm">{r.course || r.courseName || '-'}</td>
                    <td>
                      <span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : r.status === 'hold' ? 'badge-warning' : 'badge-info'}`}>
                        {r.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {r.status !== 'approved' && (
                          <button onClick={() => handleRegistrationAction(r.id, 'approved')} className="btn btn-sm btn-success flex items-center gap-1" title="Approve">
                            <MdCheckCircle size={16} /> Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button onClick={() => handleRegistrationAction(r.id, 'rejected')} className="btn btn-sm btn-danger flex items-center gap-1" title="Reject">
                            <MdCancel size={16} /> Reject
                          </button>
                        )}
                        <button onClick={() => handleRegistrationAction(r.id, 'hold')} className="btn btn-sm btn-ghost flex items-center gap-1" title="Hold">
                          <MdHourglassEmpty size={16} /> Hold
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Courses & Batches</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your courses, batches, subjects, and student registrations</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        <motion.div variants={itemVariants} key={activeTab}>
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'subjects' && renderSubjects()}
          {activeTab === 'batches' && renderBatches()}
        </motion.div>
      </motion.div>
    </div>
  )
}
