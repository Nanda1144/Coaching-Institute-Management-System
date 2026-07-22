import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import type { Developer } from '../types'
import Badge from '../components/Badge'

interface DeveloperCardProps {
  developer: Developer
  onReadMore: (dev: Developer) => void
}

export default function DeveloperCard({ developer, onReadMore }: DeveloperCardProps) {
  const d = developer

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-gradient-to-b from-white/[0.07] to-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
    >
      {/* Animated gradient border overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/40 via-transparent to-indigo-500/40" />
      </div>

      {/* Header with avatar */}
      <div className="relative h-40 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent flex items-center justify-center">
        <div className="w-24 h-24 rounded-full ring-2 ring-white/20 ring-offset-2 ring-offset-transparent overflow-hidden shadow-xl shadow-blue-500/20 group-hover:ring-blue-400/50 transition-all duration-500">
          <img
            src={d.githubAvatar}
            alt={d.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff&size=200`
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="relative p-5 space-y-3">
        <div>
          <h3 className="text-base font-bold text-white">{d.name}</h3>
          <p className="text-xs text-blue-300 font-medium">{d.designation}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {d.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="info" size="xs">{skill}</Badge>
          ))}
          {d.skills.length > 3 && (
            <Badge variant="default" size="xs">+{d.skills.length - 3}</Badge>
          )}
        </div>

        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{d.shortDescription}</p>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <a href={d.linkedin} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-300 transition-all">
            <FaLinkedin size={14} />
          </a>
          <a href={d.github} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <FaGithub size={14} />
          </a>
          <div className="flex-1" />
          <button onClick={() => onReadMore(d)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 hover:text-blue-200 transition-colors group/btn">
            Read More
            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
