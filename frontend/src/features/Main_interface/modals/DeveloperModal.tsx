import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, User, LogIn, UserPlus } from 'lucide-react'
import { FaLinkedin as Linkedin, FaGithub as Github } from 'react-icons/fa'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { modalOverlay, modalContent } from '../animations/variants'
import { Link } from 'react-router-dom'
import type { Developer } from '../types'

interface DeveloperModalProps {
  isOpen: boolean
  onClose: () => void
  developer: Developer | null
}

export default function DeveloperModal({ isOpen, onClose, developer }: DeveloperModalProps) {
  if (!developer) return null
  const d = developer

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100 flex items-center justify-between p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900">Developer Profile</h3>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-[40%] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8 md:min-h-[500px]">
                <div className="w-40 h-40 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-xl">
                  <User size={72} className="text-gray-400" />
                </div>
              </div>

              <div className="md:w-[60%] p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{d.name}</h2>
                  <p className="text-sm text-blue-600 font-medium">{d.designation}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {d.skills.map((skill) => (
                    <Badge key={skill} variant="gradient" size="sm">{skill}</Badge>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Contribution</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{d.contribution}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Detailed Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{d.fullDescription}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {d.responsibilities.map((r) => (
                      <li key={r} className="text-sm text-gray-600">{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Project Contribution</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{d.projectContribution}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
                  <a href={`mailto:${d.email}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <Mail size={14} /> {d.email}
                  </a>
                  <a href={`tel:${d.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <Phone size={14} /> {d.phone}
                  </a>
                  <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <Linkedin size={14} /> LinkedIn
                  </a>
                  <a href={d.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <Github size={14} /> GitHub
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="md" icon={<LogIn size={16} />} fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button variant="gradient" size="md" icon={<UserPlus size={16} />} fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
