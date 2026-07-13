import { motion } from 'framer-motion'
import { MdPerson, MdCalendarMonth, MdMale, MdSchool } from 'react-icons/md'
import type { FacultyProfile } from '../types/profile.types'

interface PersonalInfoProps {
  profile: FacultyProfile
}

const infoItems = [
  { key: 'address', label: 'Address', icon: MdPerson },
  { key: 'dob', label: 'Date of Birth', icon: MdCalendarMonth },
  { key: 'gender', label: 'Gender', icon: MdMale },
  { key: 'qualification', label: 'Qualification', icon: MdSchool },
]

export default function PersonalInfo({ profile }: PersonalInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Personal Information</h3>
      <div className="space-y-3">
        {infoItems.map(item => (
          <div key={item.key} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <item.icon className="text-primary text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-700">
                {profile[item.key as keyof FacultyProfile] || '-'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
