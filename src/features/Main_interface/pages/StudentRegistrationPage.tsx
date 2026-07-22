import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Mail, Lock, Eye, EyeOff, User, GraduationCap, Users,
  ChevronRight, ArrowLeft, CheckCircle, AlertCircle, Phone, Calendar,
  MapPin, BookOpen, Building2, FolderOpen, Upload, FileText,
  ShieldCheck, ChevronLeft, Save,
} from 'lucide-react'
import Button from '../components/Button'
import GradientBackground from '../animations/GradientBackground'
import PageTransition from '../animations/PageTransition'
import { cn } from '../utils/cn'
import api from '../../../services/api'

const STEPS = [
  { id: 0, label: 'Personal Info', icon: User },
  { id: 1, label: 'Academic Info', icon: BookOpen },
  { id: 2, label: 'Faculty & Parent', icon: Users },
  { id: 3, label: 'Documents', icon: Upload },
  { id: 4, label: 'Review', icon: ShieldCheck },
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  gender: string
  dateOfBirth: string
  address: string
  department: string
  course: string
  semester: string
  batch: string
  preferredFacultyId: string
  parentName: string
  parentEmail: string
  parentPhone: string
  documents: { name: string; url: string }[]
}

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  gender: '', dateOfBirth: '', address: '', department: '', course: '', semester: '1',
  batch: '', preferredFacultyId: '', parentName: '', parentEmail: '', parentPhone: '',
  documents: [],
}

export default function StudentRegistrationPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [departments, setDepartments] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [facultyList, setFacultyList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    api.get('/references/departments').then((res) => {
      setDepartments(res.data?.data ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (form.department) {
      api.get('/references/courses', { params: { department: form.department } }).then((res) => {
        setCourses(res.data?.data ?? [])
      }).catch(() => {})
      api.get('/references/faculty', { params: { department: form.department } }).then((res) => {
        setFacultyList(res.data?.data ?? [])
      }).catch(() => {})
    }
  }, [form.department])

  useEffect(() => {
    if (form.department && form.course && form.semester) {
      api.get('/references/batches', { params: { department: form.department, course: form.course, semester: parseInt(form.semester) } }).then((res) => {
        setBatches(res.data?.data ?? [])
      }).catch(() => {})
    }
  }, [form.department, form.course, form.semester])

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {}
    if (s === 0) {
      if (!form.firstName.trim()) errs.firstName = 'First name is required'
      if (!form.lastName.trim()) errs.lastName = 'Last name is required'
      if (!form.email.trim()) errs.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
      if (!form.phone.trim()) errs.phone = 'Phone is required'
      if (!form.password.trim()) errs.password = 'Password is required'
      else if (form.password.length < 6) errs.password = 'At least 6 characters'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    } else if (s === 1) {
      if (!form.department) errs.department = 'Select a department'
      if (!form.course) errs.course = 'Select a course'
      if (!form.semester) errs.semester = 'Select semester'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0))

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/upload/public', fd)
      const uploaded = res.data?.data
      if (uploaded) {
        setForm((prev) => ({
          ...prev,
          documents: [...prev.documents, { name: file.name, url: uploaded.url }],
        }))
      }
    } catch {
      setErrors((prev) => ({ ...prev, documents: 'Upload failed' }))
    } finally {
      setUploading(false)
    }
  }

  const removeDocument = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      setStep(0)
      return
    }
    setSubmitError('')
    setSubmitting(true)
    try {
      await api.post('/student-auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address || undefined,
        department: form.department,
        course: form.course,
        semester: form.semester ? parseInt(form.semester) : undefined,
        batch: form.batch,
        preferredFacultyId: form.preferredFacultyId || undefined,
        parentName: form.parentName || undefined,
        parentEmail: form.parentEmail || undefined,
        parentPhone: form.parentPhone || undefined,
        documents: form.documents.length > 0 ? form.documents : undefined,
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
        <GradientBackground colors={['#f0fdf4', '#ecfdf5', '#fefce8', '#f0fdf4']} duration={8} />
        <PageTransition>
          <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Submitted!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your registration request has been submitted successfully. A faculty member will review your application.
              You will be notified once your account is approved.
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

  const selectClass = (field: string) => cn(
    'w-full px-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all appearance-none',
    errors[field] ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      <GradientBackground colors={['#f0fdf4', '#ecfdf5', '#fefce8', '#f0fdf4']} duration={8} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-200/30 blur-3xl" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl" />

      <div className="hidden lg:flex lg:w-2/5 relative items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-sm text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-600/30">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Registration</h2>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            Fill in your details to register. After submission, a faculty member will review and approve your account.
          </p>
          <div className="space-y-3">
            {STEPS.map((s) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isDone = step > s.id
              return (
                <div key={s.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl transition-all',
                    isActive ? 'bg-white/60 border border-emerald-200 shadow-sm' : 'bg-white/30'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all',
                    isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  )}>
                    {isDone ? <CheckCircle size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={cn('text-sm font-medium', isActive ? 'text-gray-900' : 'text-gray-500')}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <PageTransition>
          <div className="w-full max-w-2xl">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold text-gray-900">CIMS Registration</span>
            </div>

            {/* Progress bar */}
            <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      step >= s.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                    )}>
                      {step > s.id ? <CheckCircle size={14} /> : s.id + 1}
                    </div>
                    {s.id < STEPS.length - 1 && (
                      <div className={cn('flex-1 h-1 mx-1 rounded transition-all', step > s.id ? 'bg-emerald-500' : 'bg-gray-200')} />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Step 0: Personal Info */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h3>
                      <p className="text-xs text-gray-400 mb-4">Enter your basic personal details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                          <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="John" className={inputClass('firstName')} />
                          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                          <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Doe" className={inputClass('lastName')} />
                          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className={cn(inputClass('email'), 'pl-10')} />
                          </div>
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="9876543210" className={cn(inputClass('phone'), 'pl-10')} />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 6 characters" className={cn(inputClass('password'), 'pl-10 pr-10')} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat password" className={cn(inputClass('confirmPassword'), 'pl-10')} />
                          </div>
                          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                          <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className={inputClass('gender')}>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className={cn(inputClass('dateOfBirth'), 'pl-10')} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3 text-gray-400" size={16} />
                          <textarea value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Your address" rows={2} className={cn(inputClass('address'), 'pl-10')} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Academic Info */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Academic Information</h3>
                      <p className="text-xs text-gray-400 mb-4">Select your department, course and batch details</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <select value={form.department} onChange={(e) => { update('department', e.target.value); update('course', ''); update('batch', '') }} className={cn(selectClass('department'), 'pl-10')}>
                            <option value="">Select department</option>
                            {departments.map((d: any) => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Course *</label>
                          <div className="relative">
                            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select value={form.course} onChange={(e) => { update('course', e.target.value); update('batch', '') }} className={cn(selectClass('course'), 'pl-10')} disabled={!form.department}>
                              <option value="">Select course</option>
                              {courses.map((c: any) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          {errors.course && <p className="text-xs text-red-500 mt-1">{errors.course}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Semester *</label>
                          <div className="relative">
                            <FolderOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select value={form.semester} onChange={(e) => update('semester', e.target.value)} className={cn(selectClass('semester'), 'pl-10')}>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                <option key={s} value={s}>Semester {s}</option>
                              ))}
                            </select>
                          </div>
                          {errors.semester && <p className="text-xs text-red-500 mt-1">{errors.semester}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Batch</label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <select value={form.batch} onChange={(e) => update('batch', e.target.value)} className={cn(selectClass('batch'), 'pl-10')} disabled={!form.course}>
                            <option value="">Select batch (optional)</option>
                            {batches.map((b: any) => (
                              <option key={b.id} value={b.batchName}>{b.batchName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Faculty & Parent */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Faculty & Parent Details</h3>
                      <p className="text-xs text-gray-400 mb-4">Select a preferred faculty member and provide parent information</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Faculty (Optional)</label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <select value={form.preferredFacultyId} onChange={(e) => update('preferredFacultyId', e.target.value)} className={cn(selectClass('preferredFacultyId'), 'pl-10')} disabled={!form.department}>
                            <option value="">No preference</option>
                            {facultyList.map((f: any) => (
                              <option key={f.id} value={f.id}>{f.fullName} ({f.facultyId})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4 mt-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Parent/Guardian Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Name</label>
                            <input type="text" value={form.parentName} onChange={(e) => update('parentName', e.target.value)} placeholder="Parent name" className={inputClass('parentName')} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Email</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input type="email" value={form.parentEmail} onChange={(e) => update('parentEmail', e.target.value)} placeholder="parent@example.com" className={cn(inputClass('parentEmail'), 'pl-10')} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="tel" value={form.parentPhone} onChange={(e) => update('parentPhone', e.target.value)} placeholder="Parent phone" className={cn(inputClass('parentPhone'), 'pl-10')} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Documents</h3>
                      <p className="text-xs text-gray-400 mb-4">Upload supporting documents (optional)</p>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                        <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                        <p className="text-sm text-gray-500 mb-1">Drop files here or click to upload</p>
                        <p className="text-xs text-gray-400 mb-4">PDF, DOC, JPG up to 10MB</p>
                        <label className="btn btn-primary btn-sm cursor-pointer">
                          <Upload size={14} /> {uploading ? 'Uploading...' : 'Choose File'}
                          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                        </label>
                      </div>
                      {form.documents.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Uploaded Files ({form.documents.length})</p>
                          {form.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-emerald-500" />
                                <span className="text-sm text-gray-700">{doc.name}</span>
                              </div>
                              <button onClick={() => removeDocument(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                      {errors.documents && <p className="text-xs text-red-500">{errors.documents}</p>}
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Review & Submit</h3>
                      <p className="text-xs text-gray-400 mb-4">Please review your information before submitting</p>
                      {submitError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {submitError}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { label: 'First Name', value: form.firstName },
                          { label: 'Last Name', value: form.lastName },
                          { label: 'Email', value: form.email },
                          { label: 'Phone', value: form.phone },
                          { label: 'Gender', value: form.gender || 'Not specified' },
                          { label: 'Department', value: form.department },
                          { label: 'Course', value: form.course },
                          { label: 'Semester', value: form.semester },
                          { label: 'Batch', value: form.batch || 'Not specified' },
                          { label: 'Preferred Faculty', value: facultyList.find((f) => f.id === form.preferredFacultyId)?.fullName || 'None' },
                          { label: 'Parent Name', value: form.parentName || 'Not provided' },
                          { label: 'Documents', value: `${form.documents.length} file(s)` },
                        ].map((item) => (
                          <div key={item.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                            <p className="text-sm font-medium text-gray-900">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div>
                  {step > 0 ? (
                    <button onClick={handlePrev} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <ChevronLeft size={16} /> Previous
                    </button>
                  ) : (
                    <Link to="/signup" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <ArrowLeft size={16} /> Back to roles
                    </Link>
                  )}
                </div>
                <div>
                  {step < STEPS.length - 1 ? (
                    <button onClick={handleNext} className="btn btn-primary flex items-center gap-1.5">
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <Button variant="gradient" size="md" onClick={handleSubmit} loading={submitting} icon={<Save size={16} />}>
                      {submitting ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign in</Link>
              </p>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  )
}
