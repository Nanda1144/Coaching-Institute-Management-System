import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import Button from '../components/Button'
import PageTransition from '../animations/PageTransition'
import { cn } from '../utils/cn'
import { useAuth } from '../../../contexts/AuthContext'

const DEMO_CREDENTIALS = [
  { role: 'Super Admin', email: 'admin@gmail.com', password: 'admin@cims', gradient: 'from-blue-600 to-indigo-600' },
  { role: 'College Admin', email: 'collegemanagement@gmail.com', password: 'collegemanagement@cims', gradient: 'from-emerald-600 to-teal-600' },
  { role: 'Faculty', email: 'faculty@gmail.com', password: 'faculty@cims', gradient: 'from-rose-600 to-pink-600' },
  { role: 'Student', email: 'student@gmail.com', password: 'student@cims', gradient: 'from-purple-600 to-pink-600' },
  { role: 'Parent', email: 'parent@gmail.com', password: 'parent@cims', gradient: 'from-amber-500 to-orange-600' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs: typeof errors = {}
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format'
    if (!password.trim()) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(email, password)
      setSubmitted(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500)
    } catch (err: any) {
      setLoginError(err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (creds: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(creds.email)
    setPassword(creds.password)
    setErrors({})
    setSubmitted(false)
    setLoginError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl animate-float-slow"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl animate-float"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-amber-200/20 blur-3xl animate-float-delayed"
      />

      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/30">
            <GraduationCap className="text-white" size={40} aria-hidden="true" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Welcome Back</h2>
          <p className="text-lg text-gray-500 leading-relaxed text-center">Sign in to access your dashboard, manage courses, track attendance, and more.</p>

          <div className="mt-10 space-y-3">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider text-center mb-4">Quick Demo Access</p>
            {DEMO_CREDENTIALS.map((c) => (
              <motion.button
                key={c.email}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fillDemo(c)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-md', c.gradient)}>
                    <LogIn className="text-white" size={16} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{c.role}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - Form */}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                <p className="text-sm text-gray-500">Welcome back! Please enter your credentials.</p>
              </motion.div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                      <LogIn className="text-emerald-600" size={28} aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Login Successful</h3>
                    <p className="text-sm text-gray-500 mb-6">Redirecting to your dashboard...</p>
                    <div className="w-12 h-1.5 rounded-full bg-gray-200 mx-auto overflow-hidden">
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '0%' }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {loginError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                        {loginError}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
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
                          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
                          placeholder="Enter your password"
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

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                        Forgot password?
                      </Link>
                    </div>

                    <Button variant="gradient" size="lg" type="submit" className="w-full" loading={loading} icon={<LogIn size={18} />}>
                      Sign In
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-white/80 backdrop-blur-sm px-3 text-gray-400">Or continue with</span></div>
                </div>
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all text-sm text-gray-600 hover:text-gray-900"
                  >
                    <FaGoogle size={18} /><span className="hidden sm:inline">Google</span>
                  </a>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-semibold">Sign up</Link>
              </p>

              {/* Mobile demo credentials */}
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center mb-3">Demo credentials</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_CREDENTIALS.map((c) => (
                    <button
                      key={`mobile-${c.email}`}
                      onClick={() => fillDemo(c)}
                      className={`text-xs p-2.5 rounded-lg bg-gradient-to-br ${c.gradient} text-white hover:shadow-lg transition-all text-left hover:-translate-y-0.5`}
                    >
                      <p className="font-semibold">{c.role}</p>
                      <p className="opacity-80 truncate mt-0.5">{c.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  )
}
