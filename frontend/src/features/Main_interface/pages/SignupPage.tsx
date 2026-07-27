import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Mail, Lock, Eye, EyeOff, User, GraduationCap, Users, UserCheck, Shield, ChevronRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { FaGithub, FaTwitter, FaGoogle } from 'react-icons/fa'
import Button from '../components/Button'
import PageTransition from '../animations/PageTransition'
import { cn } from '../utils/cn'
import api from '../../../services/api'

const roles = [
  { id: 'student', label: 'Student', icon: User, description: 'Access courses, track progress, view attendance and grades.', gradient: 'from-blue-600 to-indigo-600' },
  { id: 'faculty', label: 'Faculty', icon: UserCheck, description: 'Manage courses, mark attendance, grade students, share materials.', gradient: 'from-emerald-600 to-teal-600' },
  { id: 'parent', label: 'Parent', icon: Users, description: 'Monitor ward progress, receive updates, communicate with faculty.', gradient: 'from-purple-600 to-pink-600' },
  { id: 'admin', label: 'Admin', icon: Shield, description: 'Full system control, user management, analytics, configurations.', gradient: 'from-amber-500 to-orange-600' },
]

export default function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'role' | 'form' | 'success'>('role')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectRole = (roleId: string) => {
    if (roleId === 'student') {
      navigate('/student-registration')
      return
    }
    setSelectedRole(roleId); setTimeout(() => setStep('form'), 300)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Full name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format'
    if (!password.trim()) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'At least 6 characters'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!agree) errs.agree = 'You must agree to the terms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    if (selectedRole === 'student') {
      setSubmitting(true)
      try {
        const nameParts = name.trim().split(/\s+/)
        await api.post('/student-auth/register', {
          firstName: nameParts[0] || name,
          lastName: nameParts.slice(1).join(' ') || 'Student',
          email,
          password,
          phone: '',
          department: 'General',
        })
        setStep('success')
      } catch (err: any) {
        setSubmitError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.')
      } finally {
        setSubmitting(false)
      }
    } else {
      setSubmitError('Only student self-registration is available. Please contact your institute administrator for other roles.')
    }
  }

  const selectedRoleData = roles.find((r) => r.id === selectedRole)

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
                    <p className="text-center text-sm text-gray-500 mt-6">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
                    </p>
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setStep('role')}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                    >
                      <ArrowLeft size={16} /> Back to roles
                    </button>
                    <div className="flex items-items gap-3 mb-6 p-3 rounded-xl bg-gray-50 border border-gray-200">
                      {selectedRoleData && (
                        <>
                          <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', selectedRoleData.gradient)}>
                            <selectedRoleData.icon className="text-white" size={18} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Signing up as {selectedRoleData.label}
                            </p>
                            <p className="text-xs text-gray-400">{selectedRoleData.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {submitError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {submitError}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
                            placeholder="John Doe"
                            className={cn(
                              'w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                              errors.name ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400',
                            )}
                          />
                        </div>
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
                            placeholder="you@example.com"
                            className={cn(
                              'w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                              errors.email ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400',
                            )}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                            placeholder="Min. 6 characters"
                            className={cn(
                              'w-full pl-10 pr-10 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                              errors.password ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400',
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                            placeholder="Repeat your password"
                            className={cn(
                              'w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                              errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400',
                            )}
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                      </div>
                      <div>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => { setAgree(e.target.checked); setErrors((p) => ({ ...p, agree: '' })) }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                          />
                          <span className="text-xs text-gray-500">
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                          </span>
                        </label>
                        {errors.agree && <p className="text-xs text-red-500 mt-1">{errors.agree}</p>}
                      </div>
                      <Button variant="gradient" size="lg" type="submit" className="w-full" loading={submitting} icon={submitting ? undefined : <UserPlus size={18} />}>
                        {submitting ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white/80 backdrop-blur-sm px-3 text-gray-400">Or sign up with</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                          { icon: FaGoogle, label: 'Google', href: '#' },
                          { icon: FaGithub, label: 'GitHub', href: '#' },
                          { icon: FaTwitter, label: 'Twitter', href: '#' },
                        ].map((p) => (
                          <a
                            key={p.label}
                            href={p.href}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all text-sm text-gray-600 hover:text-gray-900"
                          >
                            <p.icon size={18} /><span className="hidden sm:inline">{p.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
                    </p>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-emerald-600" size={28} aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Created!</h3>
                    <p className="text-sm text-gray-500 mb-6">Welcome to CIMS. Your account has been created successfully.</p>
                    <Link to="/login">
                      <Button variant="gradient" size="md" icon={<UserPlus size={18} />}>Proceed to Login</Button>
                    </Link>
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
