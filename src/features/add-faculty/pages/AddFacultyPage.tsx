import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import type { RegistrationFormData } from '../types/registration.types'
import facultyService from '../../../services/faculty/faculty.service'
import PersonalInfoSection from '../components/PersonalInfoSection'
import AcademicDetailsSection from '../components/AcademicDetailsSection'
import EmploymentDetailsSection from '../components/EmploymentDetailsSection'
import AccountDetailsSection from '../components/AccountDetailsSection'
import EmergencyContactSection from '../components/EmergencyContactSection'
import FormActions from '../components/FormActions'

export default function AddFacultyPage() {
  const navigate = useNavigate()
  const [photoValue, setPhotoValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await facultyService.create(data as unknown as Record<string, unknown>)
      navigate('/faculty')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create faculty')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    setPhotoValue('')
    setSubmitError(null)
  }

  const handleCancel = () => {
    navigate('/faculty')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <MdHome className="text-gray-400" />
            <MdChevronRight className="text-gray-300" />
            <span>Dashboard</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-gray-500">Faculty</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-primary font-medium">Add Faculty</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add Faculty Member</h2>
          <p className="text-sm text-gray-500 mt-0.5">Register a new faculty member in the system</p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to List
        </button>
      </motion.div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <PersonalInfoSection
          register={register}
          errors={errors}
          photoValue={photoValue}
          onPhotoChange={setPhotoValue}
        />

        <AcademicDetailsSection register={register} errors={errors} />

        <EmploymentDetailsSection register={register} errors={errors} />

        <AccountDetailsSection register={register} errors={errors} passwordValue={password || ''} />

        <EmergencyContactSection register={register} errors={errors} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
        >
          <FormActions
            onCancel={handleCancel}
            onReset={handleReset}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </form>
    </motion.div>
  )
}
