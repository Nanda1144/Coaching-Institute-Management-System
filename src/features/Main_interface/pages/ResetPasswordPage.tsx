import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, GraduationCap, CheckCircle, ArrowLeft } from 'lucide-react'
import Button from '../components/Button'
import GradientBackground from '../animations/GradientBackground'
import PageTransition from '../animations/PageTransition'
import { fadeInUp } from '../animations/variants'
import api from '../../../services/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    if (!token.trim()) {
      setError('Reset token is required')
      return false
    }
    if (!password.trim()) {
      setError('New password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      <GradientBackground colors={['#eff6ff', '#eef2ff', '#faf5ff', '#eff6ff']} duration={8} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl"
      />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <PageTransition>
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={22} aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-gray-900">CIMS</span>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10">
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-sm text-gray-500">Enter your new password below.</p>
              </motion.div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-600" size={28} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Password Reset Successful</h3>
                  <p className="text-sm text-gray-500 mb-6">Your password has been updated. You can now sign in with your new password.</p>
                  <Link to="/login">
                    <Button variant="gradient" size="lg" icon={<ArrowLeft size={18} />}>
                      Go to Login
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Reset Token</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                      <input
                        type="text"
                        value={token}
                        onChange={(e) => { setToken(e.target.value); setError('') }}
                        placeholder="Paste your reset token"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button variant="gradient" size="lg" type="submit" className="w-full" loading={loading} icon={<Lock size={18} />}>
                    Reset Password
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-semibold">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  )
}
