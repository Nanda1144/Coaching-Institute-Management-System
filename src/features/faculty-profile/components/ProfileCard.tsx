import { motion } from 'framer-motion'
import { MdEmail, MdPhone, MdSchool, MdWork, MdCalendarToday } from 'react-icons/md'
import type { FacultyProfile } from '../types/profile.types'

interface ProfileCardProps {
  profile: FacultyProfile
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md overflow-hidden"
    >
      <div className="h-28 bg-gradient-to-r from-primary via-primary-light to-accent" />
      <div className="px-6 pb-6 -mt-14 relative z-10">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">{profile.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 pt-2 space-y-1">
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1 text-gray-700">
                <MdWork className="text-primary" />
                {profile.designation}
              </span>
              <span className="inline-flex items-center gap-1 text-gray-700">
                <MdSchool className="text-primary" />
                {profile.department}
              </span>
              <span className="inline-flex items-center gap-1 text-gray-700">
                <MdCalendarToday className="text-primary" />
                {profile.experience} Years Exp.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm pt-1">
              <span className="inline-flex items-center gap-1 text-gray-700">
                <MdEmail className="text-gray-500" />
                {profile.email}
              </span>
              <span className="inline-flex items-center gap-1 text-gray-700">
                <MdPhone className="text-gray-500" />
                {profile.phone}
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {profile.status}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
