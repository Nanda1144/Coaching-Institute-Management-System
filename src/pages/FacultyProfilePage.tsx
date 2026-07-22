import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdPerson, MdSchool, MdWork, MdEmail, MdPhone, MdHome, MdRefresh, MdEdit, MdSave, MdClose } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FacultyProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    api.get('/faculty/profile')
      .then((res) => {
        const data = res.data?.data || {}
        setProfile(data)
        setForm({
          phone: data.phone || '',
          alternatePhone: data.alternatePhone || '',
          address: typeof data.address === 'object' ? data.address : {},
          emergencyContact: typeof data.emergencyContact === 'object' ? data.emergencyContact : {},
        })
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await api.patch(`/faculty/${profile.id}`, {
        phone: form.phone,
        alternatePhone: form.alternatePhone,
        address: form.address,
        emergencyContact: form.emergencyContact,
      })
      setProfile(res.data?.data || profile)
      setEditing(false)
      setSuccess('Profile updated successfully')
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading profile..." />

  if (error && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <MdPerson className="text-red-500 text-2xl" />
        </div>
        <p className="text-danger mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary flex items-center gap-2">
          <MdRefresh /> Retry
        </button>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your personal information</p>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn btn-primary flex items-center gap-2">
              <MdEdit size={18} /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => { setEditing(false); setError(null) }} className="btn btn-ghost flex items-center gap-2">
                <MdClose size={18} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary flex items-center gap-2">
                <MdSave size={18} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {success && (
        <motion.div variants={itemVariants} className="p-4 rounded-xl bg-success-light border border-success/20 text-sm text-success">{success}</motion.div>
      )}
      {error && (
        <motion.div variants={itemVariants} className="p-4 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger">{error}</motion.div>
      )}

      <motion.div variants={itemVariants} className="card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
            {profile.fullName?.charAt(0) || 'F'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{profile.fullName}</h2>
            <p className="text-sm text-neutral-500">{profile.designation}</p>
            <p className="text-xs text-neutral-400">{profile.employeeId} · {profile.department}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
            <MdPerson className="text-primary-500" /> Personal Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Email</span>
              <span className="text-sm font-medium text-neutral-900 flex items-center gap-1"><MdEmail className="text-neutral-400" size={14} />{profile.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Phone</span>
              {editing ? (
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field text-sm py-1 w-48 text-right" />
              ) : (
                <span className="text-sm font-medium text-neutral-900 flex items-center gap-1"><MdPhone className="text-neutral-400" size={14} />{profile.phone}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Alt. Phone</span>
              {editing ? (
                <input type="text" value={form.alternatePhone} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} className="input-field text-sm py-1 w-48 text-right" />
              ) : (
                <span className="text-sm font-medium text-neutral-900">{profile.alternatePhone || 'N/A'}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Gender</span>
              <span className="text-sm font-medium text-neutral-900">{profile.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Date of Birth</span>
              <span className="text-sm font-medium text-neutral-900">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
            <MdWork className="text-primary-500" /> Employment Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Employee ID</span>
              <span className="text-sm font-medium text-neutral-900">{profile.employeeId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Designation</span>
              <span className="text-sm font-medium text-neutral-900">{profile.designation}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Department</span>
              <span className="text-sm font-medium text-neutral-900">{profile.department}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Experience</span>
              <span className="text-sm font-medium text-neutral-900">{profile.experience} years</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Employment Type</span>
              <span className="text-sm font-medium text-neutral-900">{profile.employmentType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Joining Date</span>
              <span className="text-sm font-medium text-neutral-900">{profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
            <MdSchool className="text-primary-500" /> Academic Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Specialization</span>
              <span className="text-sm font-medium text-neutral-900 text-right">{(profile.specialization || []).join(', ') || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500">Qualifications</span>
              <span className="text-sm font-medium text-neutral-900 text-right">{(profile.qualification || []).join(', ') || 'N/A'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
            <MdHome className="text-primary-500" /> Address & Emergency
          </h3>
          <div className="space-y-3">
            <div className="pb-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500 block mb-1">Address</span>
              {editing ? (
                <div className="space-y-1">
                  <input type="text" placeholder="Street" value={form.address?.street || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} className="input-field text-sm py-1 w-full" />
                  <input type="text" placeholder="City" value={form.address?.city || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} className="input-field text-sm py-1 w-full" />
                  <input type="text" placeholder="State" value={form.address?.state || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} className="input-field text-sm py-1 w-full" />
                  <input type="text" placeholder="Pincode" value={form.address?.pincode || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })} className="input-field text-sm py-1 w-full" />
                </div>
              ) : (
                <span className="text-sm font-medium text-neutral-900">
                  {profile.address ? `${profile.address.street || ''}, ${profile.address.city || ''}, ${profile.address.state || ''} - ${profile.address.pincode || ''}` : 'N/A'}
                </span>
              )}
            </div>
            <div className="pb-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-500 block mb-1">Emergency Contact</span>
              {editing ? (
                <div className="space-y-1">
                  <input type="text" placeholder="Name" value={form.emergencyContact?.name || ''} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} className="input-field text-sm py-1 w-full" />
                  <input type="text" placeholder="Phone" value={form.emergencyContact?.phone || ''} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} className="input-field text-sm py-1 w-full" />
                  <input type="text" placeholder="Relation" value={form.emergencyContact?.relation || ''} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relation: e.target.value } })} className="input-field text-sm py-1 w-full" />
                </div>
              ) : (
                <span className="text-sm font-medium text-neutral-900">
                  {profile.emergencyContact ? `${profile.emergencyContact.name || ''} (${profile.emergencyContact.relation || ''}) - ${profile.emergencyContact.phone || ''}` : 'N/A'}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
