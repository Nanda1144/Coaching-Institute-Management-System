import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdHowToVote, MdFace, MdFingerprint, MdQrCode, MdAssessment, MdAnalytics, MdHistory } from 'react-icons/md'

const links = [
  { to: '/dashboard/attendance/manual', label: 'Manual Attendance', icon: MdHowToVote },
  { to: '/dashboard/attendance/face-recognition', label: 'Face Recognition', icon: MdFace },
  { to: '/dashboard/attendance/fingerprint', label: 'Fingerprints', icon: MdFingerprint },
  { to: '/dashboard/attendance/qr', label: 'QR Attendance', icon: MdQrCode },
  { to: '/dashboard/attendance/reports', label: 'Attendance Report', icon: MdAssessment },
  { to: '/dashboard/attendance/analytics', label: 'Attendance Analytics', icon: MdAnalytics },
  { to: '/dashboard/attendance/history', label: 'Attendance History', icon: MdHistory },
]

export default function AttendanceNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const isActive = location.pathname === link.to
        return (
          <motion.button
            key={link.to}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(link.to)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/70 text-gray-700 hover:bg-white border border-white/30'
            }`}
          >
            <link.icon className="text-lg" />
            {link.label}
          </motion.button>
        )
      })}
    </div>
  )
}
