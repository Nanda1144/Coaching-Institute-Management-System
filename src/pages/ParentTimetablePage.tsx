import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdPerson, MdLocationOn } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
}

export default function ParentTimetablePage() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-timetable'],
    queryFn: () => parentDashboardService.getTimetable(),
  })

  const schedule = response?.data ?? []

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={'sk' + i} className="card overflow-hidden">
              <div className="skeleton h-10 w-full rounded-none" />
              <div className="divide-y divide-neutral-100">
                {[1, 2, 3].map((j) => (
                  <div key={'sk' + j} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="skeleton h-6 w-24 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="skeleton h-4 w-40" />
                      <div className="flex gap-3">
                        <div className="skeleton h-3 w-32" />
                        <div className="skeleton h-3 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Timetable</h1>
          <p className="text-neutral-500 mt-1">Your child&apos;s class schedule</p>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load timetable. Please try again later.
        </div>
      </div>
    )
  }

  if (schedule.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Timetable</h1>
          <p className="text-neutral-500 mt-1">Your child&apos;s class schedule</p>
        </motion.div>
        <div className="card empty-state">
          <div className="empty-state-icon"><MdPerson size={24} /></div>
          <p className="text-neutral-500">No schedule available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text text-3xl font-bold">Timetable</h1>
        <p className="text-neutral-500 mt-1">Your child&apos;s class schedule</p>
      </motion.div>

      <div className="space-y-4">
        {schedule.map((day: any, dayIdx: number) => (
          <motion.div
            key={day.day}
            className="card overflow-hidden"
            custom={dayIdx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="px-5 py-3 bg-primary-50 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900">{day.day}</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {day.classes.map((cls: any, i: number) => (
                <div
                  key={'sk' + i}
                  className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-neutral-50 transition-colors"
                >
                  <span className="badge badge-info shrink-0 w-fit">{cls.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{cls.subject}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MdPerson size={14} /> {cls.faculty}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdLocationOn size={14} /> {cls.room}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
