import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import type { RegistrationFormData } from '../types/registration.types'
import { defaultEditValues } from '../data/editData'
import PersonalInfoSection from '../components/PersonalInfoSection'
import AcademicDetailsSection from '../components/AcademicDetailsSection'
import EmploymentDetailsSection from '../components/EmploymentDetailsSection'
import AccountDetailsSection from '../components/AccountDetailsSection'
import EmergencyContactSection from '../components/EmergencyContactSection'
import FormActions from '../components/FormActions'
import Toast from '../../../components/Toast'

export default function EditFacultyPage() {
  const navigate = useNavigate()
  const [photoValue, setPhotoValue] = useState(defaultEditValues.photo)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>({ defaultValues: defaultEditValues })

  const password = watch('password')
  const handleCloseToast = useCallback(() => setShowToast(false), [])

  const onSubmit = (_data: RegistrationFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowToast(true)
      setTimeout(() => navigate('/faculty'), 1500)
    }, 1000)
  }

  const handleReset = () => {
    reset(defaultEditValues)
    setPhotoValue(defaultEditValues.photo)
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
            <span className="text-primary font-medium">Edit Faculty</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Faculty Member</h2>
          <p className="text-sm text-gray-500 mt-0.5">Update faculty member details</p>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to List
        </button>
      </motion.div>

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
            submitLabel="Save Changes"
          />
        </motion.div>
      </form>

      <Toast
        message="Faculty profile updated successfully!"
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </motion.div>
  )
}
