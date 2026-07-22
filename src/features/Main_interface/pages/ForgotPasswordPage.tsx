import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, GraduationCap, CheckCircle, Lock } from 'lucide-react'
import Button from '../components/Button'
import PageTransition from '../animations/PageTransition'
import api from '../../../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format')
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
      const response = await api.post('/auth/forgot-password', { email })
      const data = response.data
      if (data.data?.resetToken) {
        setResetToken(data.data.resetToken)
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
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

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <PageTransition>
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={22} aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-gray-900">CIMS</span>
            </div>

            <div className="glass-premium rounded-3xl p-8 sm:p-10 shadow-2xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-600" size={28} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Check Your Email</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    If an account exists with this email, a reset link has been sent.
                  </p>
                  {resetToken && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-left">
                      <p className="text-xs text-gray-400 font-medium mb-1">Dev Mode - Reset Token</p>
                      <p className="text-sm text-gray-700 break-all font-mono">{resetToken}</p>
                      <p className="text-xs text-amber-600 mt-2">Copy this token and use it at the reset password page.</p>
                    </div>
                  )}
                  <Link
                    to="/reset-password"
                    className="inline-block text-sm text-blue-600 hover:underline font-semibold mb-4"
                  >
                    Go to Reset Password
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                      <Lock className="text-blue-600" size={24} aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError('') }}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </div>

                    <Button variant="gradient" size="lg" type="submit" className="w-full" loading={loading} icon={<Mail size={18} />}>
                      Send Reset Link
                    </Button>
                  </form>
                </>
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
