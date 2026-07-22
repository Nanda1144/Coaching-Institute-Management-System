import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdPerson, MdSchool, MdEmail, MdCalendarMonth } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

export default function ParentChildProfilePage() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-child-profile'],
    queryFn: () => parentDashboardService.getOverview(),
  })

  const overview = response?.data ?? null
  const child = overview?.student ?? overview ?? null

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-6 pb-6 border-b border-neutral-200">
            <div className="skeleton w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-6 w-48" />
              <div className="skeleton h-4 w-64" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-24 rounded-full" />
                <div className="skeleton h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-neutral-50">
                <div className="skeleton h-3 w-16 mb-2" />
                <div className="skeleton h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Child Profile</h1>
          <p className="text-neutral-500 mt-1">View your child&apos;s academic information</p>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load profile data. Please try again later.
        </div>
      </div>
    )
  }

  if (!child) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Child Profile</h1>
          <p className="text-neutral-500 mt-1">View your child&apos;s academic information</p>
        </motion.div>
        <div className="card empty-state">
          <div className="empty-state-icon"><MdPerson size={24} /></div>
          <p className="text-neutral-500">No profile data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text text-3xl font-bold">Child Profile</h1>
        <p className="text-neutral-500 mt-1">View your child&apos;s academic information</p>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-6 pb-6 border-b border-neutral-200">
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <MdPerson className="text-primary" size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">{child.fullName}</h3>
            <p className="text-sm text-neutral-500">{child.department} &bull; {child.course || child.year || 'Sem ' + child.semester}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {child.rollNumber && (
                <span className="badge badge-info">
                  <MdSchool size={14} /> {child.rollNumber}
                </span>
              )}
              {child.batch && (
                <span className="badge badge-neutral">
                  <MdSchool size={14} /> {child.batch}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Email', value: child.email, icon: MdEmail },
            { label: 'Phone', value: child.phone },
            {
              label: 'Date of Birth',
              value: child.dateOfBirth
                ? new Date(child.dateOfBirth).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '-',
              icon: MdCalendarMonth,
            },
            { label: 'Blood Group', value: child.bloodGroup || '-' },
            { label: 'Admission No', value: child.admissionNo || '-', icon: MdSchool },
            { label: 'Department', value: child.department, icon: MdSchool },
          ].map((field) => (
            <motion.div
              key={field.label}
              className="p-3 rounded-xl bg-neutral-50 card"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p className="text-xs text-neutral-500 mb-1">{field.label}</p>
              <p className="text-sm font-medium text-neutral-900">{field.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
