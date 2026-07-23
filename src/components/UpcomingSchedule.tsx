import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdAccessTime, MdRoom, MdPerson, MdBook, MdSchedule, MdErrorOutline, MdRefresh } from 'react-icons/md'
import { useTimetableListShared } from '../hooks/useSharedData'
import { getFacultyName } from '../utils/unwrap'
import EmptyState from './EmptyState'

export default function UpcomingSchedule() {
  const { data: entries, isLoading, isError, error, refetch } = useTimetableListShared()

  const schedules = useMemo(() => {
    if (!Array.isArray(entries)) return []
    return entries.slice(0, 8).map((entry, index) => ({
      id: entry.id || index + 1,
      facultyName: getFacultyName(entry.faculty) || (typeof entry.faculty === 'string' ? entry.faculty : 'Unknown'),
      subject: entry.subject || entry.course || 'Unknown',
      classroom: entry.classroom || 'TBD',
      time: entry.time || 'TBD',
      department: entry.department || 'General',
    }))
  }, [entries])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={'sk' + i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-32" />
                <div className="h-2 bg-gray-200 rounded w-24" />
                <div className="h-2 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-200 shadow-md p-5 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
          <MdErrorOutline className="text-red-500 text-xl" />
        </div>
        <p className="text-sm font-medium text-gray-800 mb-1">Failed to load schedule</p>
        <p className="text-xs text-gray-500 mb-3">{error instanceof Error ? error.message : 'Something went wrong'}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
        >
          <MdRefresh className="text-sm" />
          Retry
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Today's Schedule</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {schedules.length} classes
        </span>
      </div>

      {schedules.length === 0 ? (
        <EmptyState
          icon={<MdSchedule className="w-8 h-8 text-gray-400" />}
          title="No classes today"
          message="There are no scheduled classes for today."
        />
      ) : (
        <div className="space-y-2">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center flex-shrink-0 border border-primary/10">
                <MdAccessTime className="text-primary text-xs" />
                <span className="text-[10px] font-semibold text-primary mt-0.5 leading-tight text-center px-1">
                  {schedule.time}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <MdPerson className="text-gray-400 text-xs flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-800 truncate">{schedule.facultyName}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <MdBook className="text-gray-400 text-xs flex-shrink-0" />
                  <p className="text-xs text-gray-600 truncate">{schedule.subject}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <MdRoom className="text-gray-400 text-xs flex-shrink-0" />
                  <p className="text-xs text-gray-500">{schedule.classroom}</p>
                </div>
              </div>

              <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                {schedule.department}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
