import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'
import type { TeamMember } from '../types'
import { staggerItem } from '../animations/variants'
import Avatar from '../components/Avatar'
import IconButton from '../components/IconButton'
import { handleNavigation } from '../utils/navigation'

interface TeamCardProps extends TeamMember {
  index?: number
}

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <FaLinkedin size={16} />,
  twitter: <FaTwitter size={16} />,
  github: <Globe size={16} />,
  website: <Globe size={16} />,
}

export default function TeamCard({ name, role, bio, social }: TeamCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-center mb-4">
        <Avatar name={name} size="xl" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-blue-600 font-medium mb-3">{role}</p>

      {bio && (
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{bio}</p>
      )}

      {social && social.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          {social.map((s, i) => (
            <IconButton
              key={'sk' + i}
              icon={socialIcons[s.platform] || <Globe size={16} />}
              label={s.platform}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(s.url)}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
