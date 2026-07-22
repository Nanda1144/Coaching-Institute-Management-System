import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  MdSecurity, MdNotifications, MdPalette, MdBackup,
  MdSave, MdBusiness, MdCalendarMonth, MdCancel, MdCheckCircle,
} from 'react-icons/md'
import settingsService from '../services/settings/settings.service'

const SECTION_META = [
  { id: 'institute', label: 'Institute Settings', icon: MdBusiness },
  { id: 'academic', label: 'Academic Year', icon: MdCalendarMonth },
  { id: 'security', label: 'Security', icon: MdSecurity },
  { id: 'notifications', label: 'Notifications', icon: MdNotifications },
  { id: 'appearance', label: 'Appearance', icon: MdPalette },
  { id: 'backup', label: 'Backup & Restore', icon: MdBackup },
]

const DEFAULT_VALUES: Record<string, Record<string, any>> = {
  institute: {
    name: 'EduManage College',
    address: '123 Education Lane',
    phone: '+1 234 567 8900',
    email: 'admin@edumanage.edu',
  },
  academic: {
    academicYear: '2026-2027',
    term: 'Fall Semester',
    startDate: '2026-08-01',
    endDate: '2026-12-20',
  },
  security: {
    passwordPolicy: 'Minimum 8 characters, 1 uppercase, 1 number',
    sessionTimeout: 60,
    twoFactor: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  },
  appearance: {
    theme: 'Light',
    primaryColor: 'Blue',
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'Daily',
    lastBackup: '2026-07-19 03:00 AM',
  },
}

const FIELD_TYPES: Record<string, Record<string, { type: string; options?: string[] }>> = {
  institute: {
    name: { type: 'text' },
    address: { type: 'text' },
    phone: { type: 'text' },
    email: { type: 'email' },
  },
  academic: {
    academicYear: { type: 'text' },
    term: { type: 'text' },
    startDate: { type: 'date' },
    endDate: { type: 'date' },
  },
  security: {
    passwordPolicy: { type: 'text' },
    sessionTimeout: { type: 'number' },
    twoFactor: { type: 'toggle' },
  },
  notifications: {
    emailNotifications: { type: 'toggle' },
    smsNotifications: { type: 'toggle' },
    pushNotifications: { type: 'toggle' },
  },
  appearance: {
    theme: { type: 'select', options: ['Light', 'Dark', 'System'] },
    primaryColor: { type: 'select', options: ['Blue', 'Indigo', 'Purple', 'Green'] },
  },
  backup: {
    autoBackup: { type: 'toggle' },
    backupFrequency: { type: 'select', options: ['Hourly', 'Daily', 'Weekly', 'Monthly'] },
    lastBackup: { type: 'text' },
  },
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('institute')
  const [formValues, setFormValues] = useState<Record<string, Record<string, any>>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
  })

  useEffect(() => {
    if (data?.data) {
      setFormValues((prev) => ({ ...prev, ...data.data }))
    }
  }, [data])

  useEffect(() => {
    setFormValues((prev) => {
      const merged = { ...DEFAULT_VALUES }
      for (const key of Object.keys(merged)) {
        merged[key] = { ...merged[key], ...(prev[key] || {}) }
      }
      return merged
    })
  }, [])

  const updateMutation = useMutation({
    mutationFn: (values: Record<string, any>) =>
      settingsService.updateSettings(activeSection, values),
  })

  const handleFieldChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [activeSection]: { ...(prev[activeSection] || {}), [key]: value },
    }))
  }

  const handleSave = () => {
    updateMutation.mutate(formValues[activeSection] || {})
  }

  const currentSection = SECTION_META.find((s) => s.id === activeSection)
  const fields = FIELD_TYPES[activeSection] || {}
  const values = formValues[activeSection] || {}

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage institute configuration and preferences</p>
        </div>
        {!isLoading && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="btn btn-primary"
          >
            {updateMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Saving...
              </>
            ) : updateMutation.isSuccess ? (
              <><MdCheckCircle size={18} /> Saved!</>
            ) : (
              <><MdSave size={18} /> Save Changes</>
            )}
          </motion.button>
        )}
      </motion.div>

      {updateMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-danger-light text-danger text-sm font-medium mb-6"
        >
          <MdCancel size={18} className="shrink-0" />
          Failed to save settings
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-1"
        >
          <div className="card overflow-hidden">
            <div className="p-1.5 space-y-0.5">
              {SECTION_META.map((section) => {
                const isActive = activeSection === section.id
                const Icon = section.icon
                return (
                  <motion.button
                    key={section.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                      isActive ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      <Icon size={16} />
                    </span>
                    <span>{section.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <div className="card p-6">
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                {currentSection && <currentSection.icon className="text-primary text-xl" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{currentSection?.label}</h3>
                <p className="text-sm text-neutral-500">Configure settings for this section</p>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-11 w-full" />
                ))}
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {Object.entries(fields).map(([key, field]) => (
                  <motion.div
                    key={key}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
                  >
                    <label className="text-sm font-medium text-neutral-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    </label>
                    <div className="w-full sm:w-64">
                      {field.type === 'toggle' ? (
                        <div className="flex justify-end">
                          <div
                            className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                              values[key] ? 'bg-primary' : 'bg-neutral-300'
                            }`}
                            onClick={() => handleFieldChange(key, !values[key])}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                values[key] ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </div>
                      ) : field.type === 'select' ? (
                        <select
                          value={values[key] || ''}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="select-field"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={values[key] || ''}
                          onChange={(e) => handleFieldChange(key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="input-field"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
