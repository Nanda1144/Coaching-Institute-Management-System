import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, User, GraduationCap, Users, UserCheck, Shield, ChevronRight, AlertCircle } from 'lucide-react'
import PageTransition from '../animations/PageTransition'
import { cn } from '../utils/cn'

const roles = [
  { id: 'student', label: 'Student', icon: User, description: 'Access courses, track progress, view attendance and grades.', gradient: 'from-blue-600 to-indigo-600' },
  { id: 'faculty', label: 'Faculty', icon: UserCheck, description: 'Manage courses, mark attendance, grade students, share materials.', gradient: 'from-emerald-600 to-teal-600' },
  { id: 'parent', label: 'Parent', icon: Users, description: 'Monitor ward progress, receive updates, communicate with faculty.', gradient: 'from-purple-600 to-pink-600' },
  { id: 'admin', label: 'Admin', icon: Shield, description: 'Full system control, user management, analytics, configurations.', gradient: 'from-amber-500 to-orange-600' },
]

export default function SignupPage() {
  const navigate = useNavigate()
  const [step] = useState<'role' | 'success'>('role')
  const [alertMsg, setAlertMsg] = useState('')

  const selectRole = (roleId: string) => {
    setAlertMsg('')
    if (roleId === 'student') {
      navigate('/student-registration')
      return
    }
    if (roleId === 'admin') {
      navigate('/admin-registration')
      return
    }
    setAlertMsg(
      'Self-registration is only available for students and admins. Faculty and parents should contact their respective coaching institute management to get account credentials.'
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-200/30 blur-3xl animate-float-slow"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl animate-float"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full bg-amber-200/20 blur-3xl animate-float-delayed"
      />

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-600/30">
            <UserPlus className="text-white" size={40} aria-hidden="true" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Join CIMS</h2>
          <p className="text-lg text-gray-500 leading-relaxed text-center">Create your account and start managing your institute efficiently.</p>

          <div className="mt-10 space-y-4">
            {roles.map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
                <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md', r.gradient)}>
                  <r.icon className="text-white" size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <PageTransition>
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={22} aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-gray-900">CIMS</span>
            </div>

            <div className="glass-premium rounded-3xl p-8 sm:p-10 shadow-2xl">
              <AnimatePresence mode="wait">
                {step === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                      <p className="text-sm text-gray-500">Choose your role to get started.</p>
                    </div>
                    <div className="space-y-3">
                      {roles.map((role) => {
                        const Icon = role.icon
                        return (
                          <motion.button
                            key={role.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectRole(role.id)}
                            className="w-full text-left p-4 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm border-gray-200 hover:border-blue-200 hover:shadow-md"
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', role.gradient)}>
                                <Icon className="text-white" size={22} />
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-bold text-gray-900">{role.label}</p>
                                <p className="text-xs text-gray-400">{role.description}</p>
                              </div>
                              <ChevronRight className="text-gray-300" size={20} />
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {alertMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm font-medium text-amber-800">Registration not available</p>
                            <p className="text-xs text-amber-700 mt-1">{alertMsg}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-6">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  )
}
