import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserPlus, Mail, Lock, Eye, EyeOff, User, GraduationCap,
  AlertCircle, Phone, Shield, CheckCircle, Building2, BadgeCheck,
} from 'lucide-react'
import Button from '../components/Button'
import GradientBackground from '../animations/GradientBackground'
import PageTransition from '../animations/PageTransition'
import { cn } from '../utils/cn'
import api from '../../../services/api'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  instituteName: string
  designation: string
}

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  instituteName: '', designation: '',
}

export default function AdminRegistrationPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    else if (form.phone.length < 10) errs.phone = 'Phone must be at least 10 characters'
    if (!form.password.trim()) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'At least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      await api.post('/admin-auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        instituteName: form.instituteName || undefined,
        designation: form.designation || undefined,
      })
      setSuccess(true)
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
        <GradientBackground colors={['#fefce8', '#fff7ed', '#f0f9ff', '#fefce8']} duration={8} />
        <PageTransition>
          <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Registered!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your admin account has been created successfully. You can now sign in and start managing your institute.
            </p>
            <Link to="/login">
              <Button variant="gradient" size="md" icon={<UserPlus size={18} />}>
                Proceed to Login
              </Button>
            </Link>
          </div>
        </PageTransition>
      </div>
    )
  }

  const inputClass = (field: string) => cn(
    'w-full px-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
    errors[field] ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400'
  )

  const fieldError = (field: string) => errors[field] ? (
    <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
  ) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      <GradientBackground colors={['#fefce8', '#fff7ed', '#f0f9ff', '#fefce8']} duration={8} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/30 blur-3xl" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-3xl" />

      <div className="hidden lg:flex lg:w-2/5 relative items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-sm text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-600/30">
            <Shield className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Registration</h2>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            Register as an institute administrator to manage students, faculty, courses, fees and analytics.
          </p>
          <div className="space-y-3">
            {[
              { label: 'Account Details', desc: 'Create your admin login credentials' },
              { label: 'Institute Profile', desc: 'Provide institute information' },
              { label: 'Full Access', desc: 'Manage your institute end-to-end' },
            ].map((s) => (
              <div key={s.label} className="flex items-start gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-md">
                  <BadgeCheck className="text-white" size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold text-gray-900">CIMS</span>
            </div>

            <div className="glass-premium rounded-3xl p-8 sm:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} noValidate>
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
                  <p className="text-sm text-gray-500">Set up your institute administrator account.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={(e) => update('firstName', e.target.value)}
                          placeholder="First name"
                          autoComplete="given-name"
                          className={cn(inputClass('firstName'), 'pl-10')}
                        />
                      </div>
                      {fieldError('firstName')}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={(e) => update('lastName', e.target.value)}
                          placeholder="Last name"
                          autoComplete="family-name"
                          className={cn(inputClass('lastName'), 'pl-10')}
                        />
                      </div>
                      {fieldError('lastName')}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="admin@institute.com"
                        autoComplete="email"
                        className={cn(inputClass('email'), 'pl-10')}
                      />
                    </div>
                    {fieldError('email')}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="10-digit mobile number"
                        autoComplete="tel-national"
                        className={cn(inputClass('phone'), 'pl-10')}
                      />
                    </div>
                    {fieldError('phone')}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Institute Name <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="instituteName"
                        value={form.instituteName}
                        onChange={(e) => update('instituteName', e.target.value)}
                        placeholder="Your coaching institute name"
                        className={cn(inputClass('instituteName'), 'pl-10')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={(e) => update('password', e.target.value)}
                          placeholder="Min 6 characters"
                          autoComplete="new-password"
                          className={cn(inputClass('password'), 'pl-10 pr-10')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {fieldError('password')}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={(e) => update('confirmPassword', e.target.value)}
                          placeholder="Re-enter password"
                          autoComplete="new-password"
                          className={cn(inputClass('confirmPassword'), 'pl-10 pr-10')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {fieldError('confirmPassword')}
                    </div>
                  </div>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-50 border border-red-200"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    disabled={submitting}
                    icon={submitting ? undefined : <UserPlus size={18} />}
                  >
                    {submitting ? 'Creating account...' : 'Create Admin Account'}
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
                </p>
                <p className="text-center text-xs text-gray-400 mt-4">
                  <Link to="/signup" className="text-blue-600 hover:underline font-semibold">← Back to role selection</Link>
                </p>
              </form>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  )
}
