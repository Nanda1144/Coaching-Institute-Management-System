import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, ArrowRight, LogIn, UserPlus } from 'lucide-react'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { modalOverlay, modalContent } from '../animations/variants'
import { cn } from '../utils/cn'
import { Link } from 'react-router-dom'
import type { ServiceDetail } from '../types'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceDetail | null
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  if (!service) return null

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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100">
              <div className="flex items-start justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', service.gradient)}>
                    {React.createElement(service.icon as React.ComponentType<any>, { className: 'text-white', size: 24 })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <Badge variant="info" size="xs">{service.targetAudience.slice(0, 60)}...</Badge>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <p className="text-gray-600 leading-relaxed">{service.fullDescription}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 p-2">
                      <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50">
                      <ArrowRight className="text-blue-600 shrink-0 mt-0.5" size={14} />
                      <span className="text-sm text-gray-700">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Target Audience</p>
                <p className="text-sm text-gray-700">{service.targetAudience}</p>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
