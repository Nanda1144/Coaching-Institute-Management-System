import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import type { RegistrationFormData } from '../types/registration.types'
import facultyService from '../../../services/faculty/faculty.service'
import PersonalInfoSection from '../components/PersonalInfoSection'
import AcademicDetailsSection from '../components/AcademicDetailsSection'
import EmploymentDetailsSection from '../components/EmploymentDetailsSection'
import AccountDetailsSection from '../components/AccountDetailsSection'
import EmergencyContactSection from '../components/EmergencyContactSection'
import FormActions from '../components/FormActions'
import Toast from '../../../components/Toast'

export default function EditFacultyPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [photoValue, setPhotoValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>()

  const password = watch('password')
  const handleCloseToast = useCallback(() => setShowToast(false), [])

  useEffect(() => {
    if (!id) return
    const fetchFaculty = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const result = await facultyService.getById(id)
        const faculty = result?.data ?? result
        const defaults: RegistrationFormData = {
          facultyId: faculty.id ?? '',
          fullName: faculty.name ?? '',
          gender: faculty.gender ?? '',
          dob: faculty.dob ?? '',
          photo: faculty.photo ?? '',
          email: faculty.email ?? '',
          phone: faculty.phone ?? '',
          address: faculty.address ?? '',
          qualification: faculty.qualification ?? '',
          specialization: faculty.specialization ?? '',
          experience: String(faculty.experience ?? ''),
          department: faculty.department ?? '',
          designation: faculty.designation ?? '',
          joiningDate: faculty.joiningDate ?? '',
          employmentType: faculty.employmentType ?? '',
          salary: faculty.salary ?? '',
          branch: faculty.branch ?? '',
          status: faculty.status ?? '',
          username: faculty.username ?? faculty.email ?? '',
          password: '',
          confirmPassword: '',
          emergencyName: faculty.emergencyName ?? '',
          emergencyPhone: faculty.emergencyPhone ?? '',
          emergencyRelationship: faculty.emergencyRelationship ?? '',
        }
        reset(defaults)
        setPhotoValue(faculty.photo ?? '')
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load faculty data')
      } finally {
        setLoading(false)
      }
    }
    fetchFaculty()
  }, [id, reset])

  const onSubmit = async (data: RegistrationFormData) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      await facultyService.update(id, data as unknown as Record<string, unknown>)
      setShowToast(true)
      setTimeout(() => navigate('/faculty'), 1500)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to update faculty')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
  }

  const handleCancel = () => {
    navigate('/faculty')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{fetchError}</p>
      </div>
    )
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
