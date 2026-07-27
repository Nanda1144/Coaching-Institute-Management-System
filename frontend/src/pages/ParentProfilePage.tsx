import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdPerson, MdSave, MdLock, MdVisibility, MdVisibilityOff, MdErrorOutline } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

export default function ParentProfilePage() {
  const [editing, setEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-profile'],
    queryFn: () => parentDashboardService.getOverview(),
  })

  useEffect(() => {
    if (response?.data) {
      const p = response.data.parent || response.data
      setForm((prev) => ({
        fullName: p.fullName ?? prev.fullName,
        email: p.email ?? prev.email,
        phone: p.phone ?? prev.phone,
        address: (typeof p.address === 'string' ? p.address : '') ?? prev.address,
      }))
    }
  }, [response])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      await parentDashboardService.updateProfile(form)
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (passwordForm.newPass !== passwordForm.confirm) return
    setPasswordSaving(true)
    setPasswordError(null)
    try {
      await parentDashboardService.changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.newPass })
      setPasswordSaved(true)
      setPasswordForm({ current: '', newPass: '', confirm: '' })
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || err?.message || 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="skeleton w-20 h-20 rounded-full mx-auto mb-3" />
            <div className="skeleton h-5 w-32 mx-auto mb-2" />
            <div className="skeleton h-4 w-48 mx-auto" />
          </div>
          <div className="lg:col-span-2 card p-6">
            <div className="skeleton h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={'sk' + i}>
                  <div className="skeleton h-3 w-16 mb-1" />
                  <div className="skeleton h-8 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="skeleton h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={'sk' + i}>
                <div className="skeleton h-3 w-20 mb-1" />
                <div className="skeleton h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">My Profile</h1>
          <p className="text-neutral-500 mt-1">Manage your account details</p>
        </motion.div>
        <div className="empty-state card">
          <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
          <h3>Failed to load profile data</h3>
          <p className="text-neutral-500">Please try again later.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text text-3xl font-bold">My Profile</h1>
        <p className="text-neutral-500 mt-1">Manage your account details</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="card p-6 text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
            <MdPerson className="text-primary" size={36} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">{form.fullName || 'User'}</h3>
          <p className="text-sm text-neutral-500">Parent</p>
        </motion.div>

        <motion.div
          className="lg:col-span-2 card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Personal Details</h3>
            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-ghost btn-sm"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'fullName' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'Address', key: 'address' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  {field.label}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm text-neutral-900 py-2">
                    {form[field.key as keyof typeof form] || '-'}
                  </p>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {saveError && (
                <p className="text-xs text-danger mb-2 flex items-center gap-1">
                  <MdErrorOutline size={14} /> {saveError}
                </p>
              )}
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="btn btn-primary mt-4"
              >
                <MdSave size={18} />
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <MdLock /> Change Password
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Current Password', key: 'current' as const },
            { label: 'New Password', key: 'newPass' as const },
            { label: 'Confirm Password', key: 'confirm' as const },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm[field.key]}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, [field.key]: e.target.value })
                  }
                  className="input-field pr-10"
                />
                {field.key === 'newPass' && (
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {passwordError && (
          <p className="text-xs text-danger mt-2 flex items-center gap-1">
            <MdErrorOutline size={14} /> {passwordError}
          </p>
        )}
        <button
          onClick={handlePasswordSave}
          disabled={
            passwordSaving ||
            passwordSaved ||
            !passwordForm.current ||
            !passwordForm.newPass ||
            passwordForm.newPass !== passwordForm.confirm
          }
          className="btn btn-primary mt-4"
        >
          <MdLock size={18} />
          {passwordSaving ? 'Updating...' : passwordSaved ? 'Updated!' : 'Update Password'}
        </button>
        {passwordForm.newPass && passwordForm.confirm && passwordForm.newPass !== passwordForm.confirm && (
          <p className="text-xs text-danger mt-2">Passwords do not match</p>
        )}
      </motion.div>
    </div>
  )
}
