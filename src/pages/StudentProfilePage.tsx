import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdPerson, MdSchool, MdRefresh, MdEmail, MdPhone, MdHome, MdGroup, MdCalendarMonth, MdHowToVote, MdAssignment, MdAttachMoney, MdBadge } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StudentProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      api.get('/auth/me'),
      api.get('/student-dashboard/overview').catch(() => ({ data: { data: { stats: {} } } })),
    ])
      .then(([profileRes, dashboardRes]) => {
        const data = profileRes.data?.data?.user || profileRes.data?.user || {}
        const dashboardData = dashboardRes?.data?.data || {}
        setProfile(data)
        setStats(dashboardData.stats || {})
        setError(null)
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || 'Failed to load profile')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading profile..." />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <MdPerson className="text-red-500 text-2xl" />
        </div>
        <p className="text-danger mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary flex items-center gap-2">
          <MdRefresh /> Retry
        </button>
      </div>
    )
  }

  const name = profile?.fullName || profile?.full_name || user?.name || 'Student'
  const email = profile?.email || user?.email || ''
  const phone = profile?.phone || ''
  const rollNumber = profile?.rollNumber || profile?.roll_number || ''
  const course = profile?.course || ''
  const semester = profile?.semester || ''
  const batch = profile?.batch || ''
  const department = profile?.department || ''
  const section = profile?.section || ''
  const gender = profile?.gender || ''
  const dob = profile?.dateOfBirth || profile?.dob || ''
  const address = typeof profile?.address === 'string' ? profile.address : profile?.address?.street || profile?.address?.full || ''
  const studentId = profile?.studentId || profile?.student_id || ''
  const profileImage = profile?.profileImage || profile?.profile_image || ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-neutral-500 text-sm mt-1">View your personal and academic details</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center mx-auto mb-3 shadow-md">
              {profileImage ? (
                <img src={profileImage} alt={name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{name.charAt(0)}</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">{name}</h3>
            <p className="text-sm text-neutral-500">{course ? `${course}` : ''}{semester ? ` · Sem ${semester}` : ''}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {rollNumber ? `Roll No: ${rollNumber}` : ''}{batch ? ` · ${batch}` : ''}
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <MdSchool />
                <span>{department || 'General'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <MdBadge />
                <span>{studentId || '—'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 card p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                <MdPerson className="text-primary-500 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                <MdEmail className="text-primary-500 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{email || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                <MdPhone className="text-primary-500 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                <MdHome className="text-primary-500 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Address</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{address || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                <MdPerson className="text-violet-500 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Gender</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{gender || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                <MdCalendarMonth className="text-violet-500 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Date of Birth</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">{dob ? new Date(dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-primary-50 text-center">
              <MdHowToVote className="text-primary-500 mx-auto mb-1" size={24} />
              <p className="text-2xl font-bold text-primary-700">{stats?.attendancePercent || '—'}%</p>
              <p className="text-xs text-primary-500 mt-1 font-medium">Attendance</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 text-center">
              <MdAssignment className="text-emerald-500 mx-auto mb-1" size={24} />
              <p className="text-2xl font-bold text-emerald-700">{stats?.pendingAssignments ?? '—'}</p>
              <p className="text-xs text-emerald-500 mt-1 font-medium">Pending Assignments</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 text-center">
              <MdAttachMoney className="text-amber-500 mx-auto mb-1" size={24} />
              <p className="text-2xl font-bold text-amber-700">₹{stats?.feesPaid || 0}</p>
              <p className="text-xs text-amber-500 mt-1 font-medium">Fees Paid</p>
            </div>
            <div className="p-4 rounded-xl bg-violet-50 text-center">
              <MdGroup className="text-violet-500 mx-auto mb-1" size={24} />
              <p className="text-2xl font-bold text-violet-700">{stats?.totalClasses || 0}</p>
              <p className="text-xs text-violet-500 mt-1 font-medium">Total Classes</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-primary-50 text-center">
              <p className="text-2xl font-bold text-primary-700">{rollNumber || '—'}</p>
              <p className="text-xs text-primary-500 mt-1 font-medium">Roll Number</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 text-center">
              <p className="text-2xl font-bold text-emerald-700">{course || '—'}</p>
              <p className="text-xs text-emerald-500 mt-1 font-medium">Course</p>
            </div>
            <div className="p-4 rounded-xl bg-violet-50 text-center">
              <p className="text-2xl font-bold text-violet-700">{semester ? `Sem ${semester}` : '—'}</p>
              <p className="text-xs text-violet-500 mt-1 font-medium">Semester</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 text-center">
              <p className="text-2xl font-bold text-amber-700">{section || batch || '—'}</p>
              <p className="text-xs text-amber-500 mt-1 font-medium">Section / Batch</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
