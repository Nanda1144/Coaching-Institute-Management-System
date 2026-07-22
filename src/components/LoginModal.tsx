import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdVisibility, MdVisibilityOff, MdEmail, MdLock, MdPerson, MdPhone, MdArrowBack } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import authService from '../services/auth/auth.service'

type ModalView = 'login' | 'signup' | 'forgot' | 'help'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [view, setView] = useState<ModalView>('login')
  const [showPassword, setShowPassword] = useState(false)

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Signup state
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault()
    setSignupError('')
    setSignupLoading(true)
    try {
      await authService.register(signupData)
      setSignupSuccess(true)
      setTimeout(() => {
        setView('login')
        setSignupSuccess(false)
        setEmail(signupData.email)
      }, 2000)
    } catch (err: any) {
      setSignupError(err?.response?.data?.message || err?.message || 'Registration failed')
    } finally {
      setSignupLoading(false)
    }
  }

  function handleForgotPassword(e: FormEvent) {
    e.preventDefault()
    setForgotSent(true)
  }

  function resetView() {
    setView('login')
    setError('')
    setSignupError('')
    setForgotSent(false)
    setSignupSuccess(false)
  }

  function closeModal() {
    resetView()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 z-10"
            >
              <MdClose className="text-xl" />
            </button>

            {/* Header */}
            <div className="pt-8 pb-4 px-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              {view === 'login' && <><h2 className="text-xl font-bold text-gray-800">Welcome Back</h2><p className="text-sm text-gray-500 mt-1">Sign in to your account</p></>}
              {view === 'signup' && <><h2 className="text-xl font-bold text-gray-800">Create Account</h2><p className="text-sm text-gray-500 mt-1">Join EduManage today</p></>}
              {view === 'forgot' && <><h2 className="text-xl font-bold text-gray-800">Reset Password</h2><p className="text-sm text-gray-500 mt-1">We'll send you a reset link</p></>}
              {view === 'help' && <><h2 className="text-xl font-bold text-gray-800">Need Help?</h2><p className="text-sm text-gray-500 mt-1">We're here to assist you</p></>}
            </div>

            <div className="px-8 pb-8">
              {/* Login Form */}
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button type="button" onClick={() => setView('forgot')} className="text-blue-600 hover:text-blue-700 font-medium">
                      Forgot Password?
                    </button>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setView('signup')} className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign Up
                    </button>
                  </p>

                  <button type="button" onClick={() => setView('help')} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Need Help?
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {view === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupSuccess ? (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 text-center">
                      Registration successful! Redirecting to login...
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                          <div className="relative">
                            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={signupData.firstName}
                              onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                              placeholder="First Name"
                              required
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                          <div className="relative">
                            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={signupData.lastName}
                              onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                              placeholder="Last Name"
                              required
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                          <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                        <div className="relative">
                          <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            placeholder="Enter your phone number"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                          <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            placeholder="Create a password"
                            required
                            minLength={6}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {signupError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{signupError}</div>
                      )}

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
                      >
                        {signupLoading ? 'Creating Account...' : 'Create Account'}
                      </button>

                      <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <button type="button" onClick={() => setView('login')} className="text-blue-600 hover:text-blue-700 font-medium">
                          Sign In
                        </button>
                      </p>
                    </>
                  )}
                </form>
              )}

              {/* Forgot Password */}
              {view === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotSent ? (
                    <div className="text-center">
                      <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 mb-4">
                        Password reset link sent! Check your email inbox.
                      </div>
                      <button type="button" onClick={() => setView('login')} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Back to Login
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                          <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                      >
                        Send Reset Link
                      </button>
                      <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
                        <MdArrowBack className="inline mr-1" /> Back to Login
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Help */}
              {view === 'help' && (
                <div className="space-y-4 text-sm text-gray-600">
                  <p>If you're experiencing issues with your account, here are some options:</p>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="font-medium text-gray-800">Forgot Password?</p>
                      <button onClick={() => setView('forgot')} className="text-blue-600 hover:text-blue-700 mt-1">Reset it here</button>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="font-medium text-gray-800">Account Issues</p>
                      <p className="text-xs mt-1">Contact your institution administrator for account-related issues.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="font-medium text-gray-800">Technical Support</p>
                      <p className="text-xs mt-1">Email: support@edumanage.com<br />Phone: +1 (555) 123-4567</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setView('login')} className="w-full text-center text-blue-600 hover:text-blue-700 font-medium">
                    <MdArrowBack className="inline mr-1" /> Back to Login
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
